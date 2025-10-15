import { assert, assertEquals, assertExists } from "std/assert";
import { EngagementConcept } from "./engagement.ts";
import { MongoClient, ObjectId } from "mongodb";

const CLIENT = new MongoClient(
  "mongodb+srv://kayleorantes:EXRGj2KgFZP76KFL@dormcraft.ayphfcs.mongodb.net/?retryWrites=true&w=majority&appName=dormcraft",
);
const DB = CLIENT.db("dormgram_test");

Deno.test("Engagement Concept Tests", async (t) => {
  const engagements = new EngagementConcept(DB);
  await DB.collection("engagements").deleteMany({});

  const postID = new ObjectId().toHexString();
  const user1ID = new ObjectId().toHexString();
  const user2ID = new ObjectId().toHexString();

  await t.step("Operational Principle: Comment and Upvote", async () => {
    console.log("\n--- Testing Operational Principle ---");
    const comment = await engagements.addComment(
      postID,
      user1ID,
      "First comment!",
    );
    assertExists(comment.commentID);
    console.log(`ADD_COMMENT SUCCESS: User 1 added a comment.`);

    let result = await engagements.toggleUpvote(postID, user2ID);
    assert(result.upvoted, "Should be upvoted");
    assertEquals(result.total, 1);
    console.log(`TOGGLE_UPVOTE SUCCESS: User 2 upvoted. Total: 1.`);

    result = await engagements.toggleUpvote(postID, user2ID);
    assert(!result.upvoted, "Should now be un-upvoted");
    assertEquals(result.total, 0);
    console.log(
      `TOGGLE_UPVOTE SUCCESS: User 2 removed their upvote. Total: 0.`,
    );
  });

  await t.step(
    "Interesting Scenario: Get engagement for a new post",
    async () => {
      console.log("\n--- Testing Engagement for New Post ---");
      const newPostID = new ObjectId().toHexString();
      const engagement = await engagements.getEngagementForPost(newPostID);
      assertEquals(engagement.upvotes.length, 0);
      assertEquals(engagement.comments.length, 0);
      console.log(
        `GET_ENGAGEMENT SUCCESS: Returned empty engagement object as expected.`,
      );
    },
  );

  await t.step("Interesting Scenario: Multiple users engage", async () => {
    console.log("\n--- Testing Multiple User Engagement ---");
    const res1 = await engagements.toggleUpvote(postID, user1ID);
    const res2 = await engagements.toggleUpvote(postID, user2ID);
    assertEquals(res1.total, 1); // User 1 upvotes
    assertEquals(res2.total, 2); // User 2 upvotes
    console.log(
      `TOGGLE_UPVOTE SUCCESS: Multiple upvotes correctly tallied to 2.`,
    );

    // User 1 tries to upvote again
    const res3 = await engagements.toggleUpvote(postID, user1ID);
    assertEquals(res3.total, 1); // Total should go down to 1
    assert(!res3.upvoted);
    console.log(
      `TOGGLE_UPVOTE SUCCESS: Second toggle from same user correctly removed vote.`,
    );
  });

  await CLIENT.close();
});
