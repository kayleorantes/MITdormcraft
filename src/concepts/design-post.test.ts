import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import { DesignPostConcept } from "./design-post.ts";
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

Deno.test("DesignPost Concept Tests", async (t) => {
  // --- Connect INSIDE the test ---
  await CLIENT.connect();
  const DB: Db = CLIENT.db(DB_NAME);

  const posts = new DesignPostConcept(DB);
  const postCollection: Collection = DB.collection("posts");
  await postCollection.deleteMany({}); // Clean up before tests

  // --- Test IDs ---
  const author1ID = new ObjectId().toHexString();
  const author2ID = new ObjectId().toHexString();
  const template1ID = new ObjectId().toHexString();
  const template2ID = new ObjectId().toHexString();

  let testPostID: string; // To store the ID of the post we create

  await t.step(
    "Operational Principle: Create, Get, Edit, and Delete Post",
    async () => {
      console.log("\n--- Testing Full Post Lifecycle (as Owner) ---");

      // 1. Create Post
      const newPostID = await posts.createPost(
        author1ID,
        template1ID,
        "My Dorm",
        "A look inside.",
        "http://example.com/img.png",
      );
      assertEquals(typeof newPostID, "string");
      testPostID = newPostID;
      console.log(`CREATE_POST SUCCESS: Created post ${testPostID}`);

      // 2. Get Post
      let post = await posts.getPost(testPostID);
      assertExists(post);
      assertEquals(post.title, "My Dorm");
      console.log(`GET_POST SUCCESS: Fetched post "${post.title}"`);

      // 3. Edit Post (as Owner)
      const editSuccess = await posts.editPost(
        testPostID,
        author1ID, // Correct user
        "My New Dorm Title",
        "A new description.",
      );
      assert(editSuccess, "Edit should be successful");
      console.log(`EDIT_POST SUCCESS: Post was edited by owner`);

      // Verify edit
      post = await posts.getPost(testPostID);
      assertExists(post);
      assertEquals(post.title, "My New Dorm Title");
      assertEquals(post.description, "A new description.");

      // 4. Delete Post (as Owner)
      const deleteSuccess = await posts.deletePost(testPostID, author1ID);
      assert(deleteSuccess, "Delete should be successful");
      console.log(`DELETE_POST SUCCESS: Post was deleted by owner`);

      // Verify delete
      post = await posts.getPost(testPostID);
      assertEquals(post, null);
    },
  );

  await t.step("Variant Tests: `findPostsBy...` Actions", async () => {
    console.log("\n--- Testing Find Actions ---");
    // Setup: Create a new set of posts
    await postCollection.deleteMany({});
    await posts.createPost(author1ID, template1ID, "Post 1", "...", "url");
    await posts.createPost(author1ID, template1ID, "Post 2", "...", "url");
    await posts.createPost(author2ID, template2ID, "Post 3", "...", "url");
    console.log("Setup: Created 3 new posts for querying");

    // Test 1: Find by Template
    const template1Posts = await posts.findPostsByTemplate(template1ID);
    assertEquals(template1Posts.length, 2);
    console.log(
      `FIND_BY_TEMPLATE SUCCESS: Found 2 posts for template ${template1ID}`,
    );

    // Test 2: Find by Author
    const author1Posts = await posts.findPostsByAuthor(author1ID);
    assertEquals(author1Posts.length, 2);
    console.log(
      `FIND_BY_AUTHOR SUCCESS: Found 2 posts for author ${author1ID}`,
    );

    // Test 3: No matches
    const noPosts = await posts.findPostsByTemplate(
      new ObjectId().toHexString(),
    );
    assertEquals(noPosts.length, 0);
    console.log(`FIND_BY_TEMPLATE SUCCESS (Empty): Correctly returned 0 posts`);
  });

  await t.step(
    "Interesting Scenarios (Security): Unauthorized Actions",
    async () => {
      console.log("\n--- Testing Security: Unauthorized Edit/Delete ---");
      // Setup: Create one post by author 1
      await postCollection.deleteMany({});
      const postID = await posts.createPost(
        author1ID,
        template1ID,
        "A post to secure",
        "...",
        "url",
      );
      console.log(`Setup: Created post ${postID} by author 1`);

      // Test 1: Unauthorized Edit
      const editFail = await posts.editPost(
        postID,
        author2ID, // 'Attacker'
        "Hacked Title",
      );
      assert(!editFail, "Edit should fail");
      console.log(`EDIT_POST FAIL (Expected): Prevented unauthorized edit`);

      // Verify it didn't change
      const post = await posts.getPost(postID);
      assertEquals(post?.title, "A post to secure");

      // Test 2: Unauthorized Delete
      const deleteFail = await posts.deletePost(
        postID,
        author2ID, // 'Attacker'
      );
      assert(!deleteFail, "Delete should fail");
      console.log(`DELETE_POST FAIL (Expected): Prevented unauthorized delete`);
    },
  );

  // Clean up
  await CLIENT.close();
});
