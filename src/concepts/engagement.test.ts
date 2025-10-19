import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import { EngagementConcept } from "./engagement.ts";
import { Collection, Db, MongoClient, ObjectId } from "npm:mongodb";

// --- Test Setup ---
const MONGODB_URL = Deno.env.get("MONGODB_URL");
const DB_NAME = Deno.env.get("DB_NAME") || "dormcraft_test";

if (!MONGODB_URL) {
  throw new Error(
    "MONGODB_URL is not set in your .env file. Please add it.",
  );
}

// Create the client, but DO NOT connect yet
const CLIENT = new MongoClient(MONGODB_URL);

// --- Test Suite ---

Deno.test("Engagement Concept Tests", async (t) => {
  // --- Connect INSIDE the test ---
  await CLIENT.connect();
  const DB: Db = CLIENT.db(DB_NAME);

  const engagements = new EngagementConcept(DB);
  const engagementCollection: Collection = DB.collection("engagements");
  await engagementCollection.deleteMany({}); // Clean up before tests

  // --- Test IDs ---
  const postID = new ObjectId().toHexString();
  const user1ID = new ObjectId().toHexString(); // Will be the author
  const user2ID = new ObjectId().toHexString(); // Will be the 'attacker'

  let testCommentID: string;

  await t.step(
    "Operational Principle 1: Upvote Lifecycle (toggleUpvote)",
    async () => {
      console.log("\n--- Testing Upvote Lifecycle ---");

      // 1. User 1 Upvotes
      let result = await engagements.toggleUpvote(postID, user1ID);
      assert(result.upvoted, "Should be upvoted");
      assertEquals(result.total, 1);
      console.log(`TOGGLE_UPVOTE SUCCESS: User 1 upvoted. Total: 1.`);

      // 2. User 2 Upvotes
      result = await engagements.toggleUpvote(postID, user2ID);
      assert(result.upvoted, "Should be upvoted");
      assertEquals(result.total, 2);
      console.log(`TOGGLE_UPVOTE SUCCESS: User 2 upvoted. Total: 2.`);

      // 3. User 1 Removes Upvote
      result = await engagements.toggleUpvote(postID, user1ID);
      assert(!result.upvoted, "Should be un-upvoted");
      assertEquals(result.total, 1);
      console.log(
        `TOGGLE_UPVOTE SUCCESS: User 1 removed upvote. Total: 1.`,
      );
    },
  );

  await t.step(
    "Operational Principle 2: Comment Lifecycle (add, edit, delete)",
    async () => {
      console.log("\n--- Testing Comment Lifecycle (as Owner) ---");

      // 1. Add Comment (as User 1)
      const comment = await engagements.addComment(
        postID,
        user1ID, // User 1 is the author
        "First comment!",
      );
      assertExists(comment.commentID);
      testCommentID = comment.commentID.toHexString();
      console.log(`ADD_COMMENT SUCCESS: User 1 added a comment.`);

      // 2. Edit Comment (as User 1)
      const editSuccess = await engagements.editComment(
        postID,
        testCommentID,
        user1ID, // User 1 is the owner
        "Edited comment!",
      );
      assert(editSuccess, "Edit should be successful");
      console.log(`EDIT_COMMENT SUCCESS: User 1 edited their comment.`);

      // Verify the edit
      let engagement = await engagements.getEngagementForPost(postID);
      assertEquals(engagement.comments[0].text, "Edited comment!");

      // 3. Delete Comment (as User 1)
      const deleteSuccess = await engagements.deleteComment(
        postID,
        testCommentID,
        user1ID, // User 1 is the owner
      );
      assert(deleteSuccess, "Delete should be successful");
      console.log(`DELETE_COMMENT SUCCESS: User 1 deleted their comment.`);

      // Verify the deletion
      engagement = await engagements.getEngagementForPost(postID);
      assertEquals(engagement.comments.length, 0);
    },
  );

  await t.step(
    "Interesting Scenario: `getEngagementForPost` (Empty & Full)",
    async () => {
      console.log("\n--- Testing `getEngagementForPost` ---");
      // 1. Test Empty
      const newPostID = new ObjectId().toHexString();
      const empty = await engagements.getEngagementForPost(newPostID);
      assertEquals(empty.upvotes.size, 0);
      assertEquals(empty.comments.length, 0);
      console.log(
        `GET_ENGAGEMENT SUCCESS: Returned empty object for new post.`,
      );

      // 2. Test Full (based on state from first test)
      const full = await engagements.getEngagementForPost(postID);
      assertEquals(full.upvotes.size, 1); // Only User 2's vote remains
      assert(full.upvotes.has(user2ID));
      console.log(
        `GET_ENGAGEMENT SUCCESS: Correctly returned 1 upvote and 0 comments.`,
      );
    },
  );

  await t.step(
    "Interesting Scenario (Security): User CANNOT edit another's comment",
    async () => {
      console.log("\n--- Testing Security: Edit (Fail) ---");
      // Setup: User 1 adds a comment
      const comment = await engagements.addComment(
        postID,
        user1ID,
        "A comment to test security",
      );

      // Attempt: User 2 tries to edit User 1's comment
      const editFail = await engagements.editComment(
        postID,
        comment.commentID.toHexString(),
        user2ID, // User 2 is the 'attacker'
        "I hacked this comment!",
      );

      assert(!editFail, "Edit should fail");
      console.log(
        `EDIT_COMMENT FAIL (Expected): User 2 correctly blocked from editing User 1's comment.`,
      );

      // Verify: The comment text did not change
      const engagement = await engagements.getEngagementForPost(postID);
      const unchangedComment = engagement.comments.find((c) =>
        c.commentID.equals(comment.commentID)
      );
      assertEquals(unchangedComment?.text, "A comment to test security");
    },
  );

  await t.step(
    "Interesting Scenario (Security): User CANNOT delete another's comment",
    async () => {
      console.log("\n--- Testing Security: Delete (Fail) ---");
      // We use the comment created in the previous step
      const commentID = (await engagements.getEngagementForPost(postID))
        .comments[0].commentID.toHexString();

      // Attempt: User 2 tries to delete User 1's comment
      const deleteFail = await engagements.deleteComment(
        postID,
        commentID,
        user2ID, // User 2 is the 'attacker'
      );

      assert(!deleteFail, "Delete should fail");
      console.log(
        `DELETE_COMMENT FAIL (Expected): User 2 correctly blocked from deleting User 1's comment.`,
      );

      // Verify: The comment still exists
      const engagement = await engagements.getEngagementForPost(postID);
      assertEquals(engagement.comments.length, 1);
    },
  );

  // Clean up
  await CLIENT.close();
});
