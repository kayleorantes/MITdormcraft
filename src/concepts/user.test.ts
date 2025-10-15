import { assert, assertEquals, assertExists } from "std/assert";
import { UserAccountConcept } from "./user.ts";
import { MongoClient } from "mongodb";

const CLIENT = new MongoClient(
  "mongodb+srv://kayleorantes:EXRGj2KgFZP76KFL@dormcraft.ayphfcs.mongodb.net/?retryWrites=true&w=majority&appName=dormcraft",
);
const DB = CLIENT.db("dormgram_test");

Deno.test("UserAccount Concept Tests", async (t) => {
  const users = new UserAccountConcept(DB);
  await DB.collection("users").deleteMany({}); // Clean up before tests

  let testUserID: string;

  await t.step(
    "Operational Principle: Create, Get, and Update User",
    async () => {
      console.log("\n--- Testing Operational Principle ---");
      // 1. Create a user
      const user = await users.createUser(
        "testuser",
        "test@mit.edu",
        "Hello world!",
      );
      assertExists(user._id);
      assertEquals(user.username, "testuser");
      testUserID = user._id.toHexString();
      console.log(
        `CREATE_USER SUCCESS: Created user ${user.username} with ID ${testUserID}`,
      );

      // 2. Get the user
      const fetchedUser = await users.getUser(testUserID);
      assertExists(fetchedUser);
      assertEquals(fetchedUser.username, "testuser");
      console.log(`GET_USER SUCCESS: Fetched user ${fetchedUser.username}`);

      // 3. Update the user's bio
      const success = await users.updateBio(testUserID, "A new bio.");
      assert(success, "Bio update should be successful");
      const updatedUser = await users.getUser(testUserID);
      assertEquals(updatedUser?.bio, "A new bio.");
      console.log(
        `UPDATE_BIO SUCCESS: User bio updated to "${updatedUser?.bio}"`,
      );
    },
  );

  await t.step(
    "Interesting Scenario: Attempt to create duplicate user",
    async () => {
      console.log("\n--- Testing Duplicate User Creation ---");
      try {
        await users.createUser("testuser", "another@mit.edu", "...");
        assert(false, "Should have thrown an error for duplicate username");
      } catch (e) {
        // assert(e.message.includes("Username or Kerberos already exists"));
        // console.log(
        //   `CREATE_USER FAIL (Expected): Prevented duplicate username`,
        // );
        if (e instanceof Error) {
          assert(e.message.includes("Username or Kerberos already exists"));
          console.log(
            `CREATE_USER FAIL (Expected): Prevented duplicate username`,
          );
        } else {
          // Fail the test if what was caught wasn't a real error
          assert(false, "An unexpected non-Error type was thrown");
        }
      }
    },
  );

  await t.step("Interesting Scenario: Get a non-existent user", async () => {
    console.log("\n--- Testing Non-existent User ---");
    const fakeId = "111111111111111111111111";
    const user = await users.getUser(fakeId);
    assertEquals(user, null);
    console.log(
      `GET_USER SUCCESS: Correctly returned null for non-existent ID`,
    );
  });

  await CLIENT.close();
});
