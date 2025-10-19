import {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
} from "jsr:@std/assert";
import { AuthenticationConcept } from "./authentication.ts";
import { UserConcept } from "./user.ts"; // We'll use this to check if the user was created
import { Collection, Db, MongoClient, ObjectId } from "npm:mongodb";

// --- Test Setup ---
const MONGODB_URL = Deno.env.get("MONGODB_URL");
const DB_NAME = Deno.env.get("DB_NAME") || "dormcraft_test";

if (!MONGODB_URL) {
  throw new Error(
    "MONGODB_URL is not set in your .env file. Please add it.",
  );
}

const CLIENT = new MongoClient(MONGODB_URL);

// --- Test Suite ---

Deno.test("Authentication Concept Tests (Stateless)", async (t) => {
  await CLIENT.connect();
  const DB: Db = CLIENT.db(DB_NAME);

  const auth = new AuthenticationConcept(DB);
  const users = new UserConcept(DB); // To check on the User concept

  // Clean both collections
  await DB.collection("users").deleteMany({});
  await DB.collection("credentials").deleteMany({});

  const testUsername = "test_auth_user";
  const testKerberos = "auth@mit.edu";
  const testPassword = "super_safe_password123";
  let testUserID: string;

  await t.step(
    "Operational Principle: Register -> Verify Credentials",
    async () => {
      console.log("\n--- Testing Register and Verify Lifecycle ---");

      // 1. Register
      const userID = await auth.registerAndCreateAccount(
        testUsername,
        testKerberos,
        "Test Bio",
        testPassword,
      );
      assertExists(userID);
      assertEquals(typeof userID, "string");
      testUserID = userID;
      console.log(`REGISTER SUCCESS: Created user ${userID}`);

      // Verify: Check if the User document was *also* created
      const userDoc = await users.getUser(testUserID);
      assertExists(userDoc);
      assertEquals(userDoc.username, testUsername);
      console.log(`VERIFIED: User profile was created in 'users' collection`);

      // 2. Verify (Good Password)
      const verifiedID = await auth.verifyCredentials(
        testKerberos,
        testPassword,
      );
      assertEquals(verifiedID, testUserID);
      console.log(`VERIFY SUCCESS: Credentials are valid`);
    },
  );

  await t.step(
    "Interesting Scenario: Register (Duplicate Username)",
    async () => {
      console.log("\n--- Testing Duplicate Username Registration ---");
      await assertRejects(
        () =>
          auth.registerAndCreateAccount(
            testUsername, // Duplicate username
            "new_kerb@mit.edu",
            "Test Bio 2",
            "password",
          ),
        Error,
        "already exists",
      );
      console.log(
        `REGISTER FAIL (Expected): Prevented duplicate username`,
      );
    },
  );

  await t.step(
    "Interesting Scenario: Register (Duplicate Kerberos)",
    async () => {
      console.log("\n--- Testing Duplicate Kerberos Registration ---");
      await assertRejects(
        () =>
          auth.registerAndCreateAccount(
            "new_username",
            testKerberos, // Duplicate kerberos
            "Test Bio 3",
            "password",
          ),
        Error,
        "already registered",
      );
      console.log(
        `REGISTER FAIL (Expected): Prevented duplicate kerberos`,
      );
    },
  );

  await t.step("Interesting Scenario: Verify (Wrong Password)", async () => {
    console.log("\n--- Testing Verify with Wrong Password ---");
    const userID = await auth.verifyCredentials(testKerberos, "wrong_password");
    assertEquals(userID, null);
    console.log(
      `VERIFY FAIL (Expected): Correctly returned null for wrong password`,
    );
  });

  await t.step("Interesting Scenario: Verify (Non-existent User)", async () => {
    console.log("\n--- Testing Verify with Non-existent User ---");
    const userID = await auth.verifyCredentials("fake@mit.edu", "password");
    assertEquals(userID, null);
    console.log(
      `VERIFY FAIL (Expected): Correctly returned null for non-existent user`,
    );
  });

  // Clean up
  await CLIENT.close();
});
