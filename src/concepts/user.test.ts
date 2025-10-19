import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import { UserConcept } from "./user.ts";
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

Deno.test("User Concept Tests", async (t) => {
  // --- FIX: Connect INSIDE the test ---
  await CLIENT.connect();
  const DB: Db = CLIENT.db(DB_NAME);

  // --- FIX: Define these INSIDE the test ---
  const users = new UserConcept(DB);
  const userCollection: Collection = DB.collection("users");
  await userCollection.deleteMany({}); // Clean up before tests

  let testUserID: string;
  const testUsername = "test_user_1";

  // --- Setup: Manually create a user for testing ---
  await t.step("Setup: Insert test user directly", async () => {
    const result = await userCollection.insertOne({
      username: testUsername,
      mitKerberos: "test1@mit.edu",
      bio: "Initial bio.",
      createdAt: new Date(),
    });

    testUserID = result.insertedId.toHexString();
    assertExists(testUserID);
    console.log(`\n--- SETUP SUCCESS: Created test user ${testUserID} ---`);
  });

  // --- Test Cases ---

  await t.step(
    "Operational Principle: Get user by ID and update profile",
    async () => {
      console.log("\n--- Testing GetUser and UpdateUserProfile ---");

      // 1. Get the user by ID
      const fetchedUser = await users.getUser(testUserID);
      assertExists(fetchedUser);
      assertEquals(fetchedUser.username, testUsername);
      console.log(`GET_USER SUCCESS: Fetched user ${fetchedUser.username}`);

      // 2. Update the user's profile
      const success = await users.updateUserProfile(testUserID, "A new bio.");
      assert(success, "Profile update should be successful");

      // 3. Verify the update
      const updatedUser = await users.getUser(testUserID);
      assertEquals(updatedUser?.bio, "A new bio.");
      console.log(
        `UPDATE_USER_PROFILE SUCCESS: User bio updated to "${updatedUser?.bio}"`,
      );
    },
  );

  await t.step("Variant Test: Get user by Username", async () => {
    console.log("\n--- Testing GetUserByUsername ---");
    const fetchedUser = await users.getUserByUsername(testUsername);
    assertExists(fetchedUser);
    assertEquals(fetchedUser._id.toHexString(), testUserID);
    console.log(
      `GET_USER_BY_USERNAME SUCCESS: Fetched user ${fetchedUser.username}`,
    );
  });

  await t.step(
    "Interesting Scenario: Get a non-existent user by ID",
    async () => {
      console.log("\n--- Testing Non-existent User (by ID) ---");
      const fakeId = new ObjectId().toHexString(); // A valid, but non-existent ID
      const user = await users.getUser(fakeId);
      assertEquals(user, null);
      console.log(
        `GET_USER SUCCESS (Expected): Correctly returned null for non-existent ID`,
      );
    },
  );

  await t.step(
    "Interesting Scenario: Get a non-existent user by Username",
    async () => {
      console.log("\n--- Testing Non-existent User (by Username) ---");
      const fakeUsername = "non_existent_user";
      const user = await users.getUserByUsername(fakeUsername);
      assertEquals(user, null);
      console.log(
        `GET_USER_BY_USERNAME SUCCESS (Expected): Correctly returned null for non-existent username`,
      );
    },
  );

  await t.step(
    "Interesting Scenario: Update a non-existent user",
    async () => {
      console.log("\n--- Testing Update on Non-existent User ---");
      const fakeId = new ObjectId().toHexString();
      const success = await users.updateUserProfile(fakeId, "This won't work");
      assertEquals(success, false);
      console.log(
        `UPDATE_USER_PROFILE FAIL (Expected): Correctly returned false for non-existent user`,
      );
    },
  );

  // Clean up: Close the client at the end of the test
  await CLIENT.close();
});
