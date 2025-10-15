// import {
//   assert,
//   assertEquals,
//   assertExists,
// } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { assert, assertEquals, assertExists } from "std/assert";
import { DesignPostConcept } from "./design-post.ts";
import { MongoClient, ObjectId } from "mongodb";

const CLIENT = new MongoClient(
  "mongodb+srv://kayleorantes:EXRGj2KgFZP76KFL@dormcraft.ayphfcs.mongodb.net/?retryWrites=true&w=majority&appName=dormcraft",
);
const DB = CLIENT.db("dormgram_test");

Deno.test("DesignPost Concept Tests", async (t) => {
  const posts = new DesignPostConcept(DB);
  await DB.collection("posts").deleteMany({});

  // Mock IDs for author and template
  const author1ID = new ObjectId().toHexString();
  const author2ID = new ObjectId().toHexString();
  const templateID = new ObjectId().toHexString();
  let testPostID: string;

  await t.step(
    "Operational Principle: Create, Find, and Delete Post",
    async () => {
      console.log("\n--- Testing Operational Principle ---");
      const post = await posts.createPost(
        author1ID,
        templateID,
        "My Dorm",
        "A look inside.",
        "http://example.com/img.png",
      );
      testPostID = post._id.toHexString();
      assertExists(testPostID);
      console.log(`CREATE_POST SUCCESS: Created post ${testPostID}`);

      const found = await posts.findPosts(templateID);
      assertEquals(found.length, 1);
      assertEquals(found[0].title, "My Dorm");
      console.log(`FIND_POSTS SUCCESS: Found 1 post for the template.`);

      const success = await posts.deletePost(testPostID, author1ID);
      assert(success, "Post deletion should succeed");
      console.log(
        `DELETE_POST SUCCESS: Author successfully deleted their post.`,
      );
    },
  );

  await t.step(
    "Interesting Scenario: User tries to delete another user's post",
    async () => {
      console.log("\n--- Testing Unauthorized Deletion ---");
      const post = await posts.createPost(
        author1ID,
        templateID,
        "Another Post",
        "...",
        "url",
      );
      const success = await posts.deletePost(post._id.toHexString(), author2ID);
      assert(!success, "Deletion should fail for wrong user");
      console.log(
        `DELETE_POST FAIL (Expected): Prevented unauthorized deletion.`,
      );
    },
  );

  await t.step(
    "Interesting Scenario: Find posts for a template with no posts",
    async () => {
      console.log("\n--- Testing Find with No Posts ---");
      const emptyTemplateID = new ObjectId().toHexString();
      const found = await posts.findPosts(emptyTemplateID);
      assertEquals(found.length, 0);
      console.log(`FIND_POSTS SUCCESS: Correctly returned empty array.`);
    },
  );

  await CLIENT.close();
});
