import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import { RoomTemplateConcept } from "./room-template.ts";
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

Deno.test("RoomTemplate Concept Tests", async (t) => {
  // --- Connect INSIDE the test ---
  await CLIENT.connect();
  const DB: Db = CLIENT.db(DB_NAME);

  const templates = new RoomTemplateConcept(DB);
  const templateCollection: Collection = DB.collection("room_templates");
  await templateCollection.deleteMany({}); // Clean up before tests

  let testTemplateID: string;

  await t.step(
    "Operational Principle: Add, Get, Update, and Delete Template",
    async () => {
      console.log("\n--- Testing Operational Principle (CRUD) ---");

      // 1. Add Template
      const newID = await templates.addTemplate("Baker House", "Single");
      assertExists(newID);
      assertEquals(typeof newID, "string");
      testTemplateID = newID;
      console.log(
        `ADD_TEMPLATE SUCCESS: Created template with ID ${testTemplateID}`,
      );

      // 2. Get Template
      const fetched = await templates.getTemplate(testTemplateID);
      assertExists(fetched);
      assertEquals(fetched.dormName, "Baker House");
      console.log(`GET_TEMPLATE SUCCESS: Fetched template ${fetched.dormName}`);

      // 3. Update Template
      const updateSuccess = await templates.updateTemplate(
        testTemplateID,
        "Baker House",
        "Single (Updated)",
      );
      assert(updateSuccess, "Update should be successful");
      const updated = await templates.getTemplate(testTemplateID);
      assertEquals(updated?.roomType, "Single (Updated)");
      console.log(
        `UPDATE_TEMPLATE SUCCESS: Template roomType updated to "${updated?.roomType}"`,
      );

      // 4. Delete Template
      const deleteSuccess = await templates.deleteTemplate(testTemplateID);
      assert(deleteSuccess, "Delete should be successful");
      const deleted = await templates.getTemplate(testTemplateID);
      assertEquals(deleted, null);
      console.log(
        `DELETE_TEMPLATE SUCCESS: Template ${testTemplateID} deleted`,
      );
    },
  );

  await t.step("Variant Tests: `findTemplates` Action", async () => {
    console.log("\n--- Testing `findTemplates` Queries ---");
    // Setup: Add known templates
    await templates.addTemplate("New Vassar", "Double");
    await templates.addTemplate("New Vassar", "Single");
    await templates.addTemplate("Simmons Hall", "Single");
    console.log("Setup: Added 3 templates for finding");

    // Test 1: Find by dormName
    const vassar = await templates.findTemplates("New Vassar");
    assertEquals(vassar.length, 2);
    console.log("FIND_TEMPLATES SUCCESS: Found 2 templates for New Vassar");

    // Test 2: Find by roomType
    const singles = await templates.findTemplates(undefined, "Single");
    assertEquals(singles.length, 2);
    console.log("FIND_TEMPLATES SUCCESS: Found 2 Single templates");

    // Test 3: Find by both
    const simmonsSingle = await templates.findTemplates(
      "Simmons Hall",
      "Single",
    );
    assertEquals(simmonsSingle.length, 1);
    console.log("FIND_TEMPLATES SUCCESS: Found 1 Simmons Single template");

    // Test 4: Find all (no filters)
    const all = await templates.findTemplates();
    assertEquals(all.length, 3);
    console.log("FIND_TEMPLATES SUCCESS: Correctly returned all 3 templates");

    // Test 5: Find with no matches
    const none = await templates.findTemplates("Next House");
    assertEquals(none.length, 0);
    console.log(
      "FIND_TEMPLATES SUCCESS: Correctly returned 0 templates for non-existent dorm",
    );
  });

  await t.step(
    "Interesting Scenarios: Actions on Non-existent IDs",
    async () => {
      console.log("\n--- Testing Failures on Non-existent IDs ---");
      const fakeId = new ObjectId().toHexString();

      // Get non-existent
      const getFail = await templates.getTemplate(fakeId);
      assertEquals(getFail, null);
      console.log(
        "GET_TEMPLATE FAIL (Expected): Correctly returned null for fake ID",
      );

      // Update non-existent
      const updateFail = await templates.updateTemplate(
        fakeId,
        "Fake Dorm",
        "Fake Room",
      );
      assertEquals(updateFail, false);
      console.log(
        "UPDATE_TEMPLATE FAIL (Expected): Correctly returned false for fake ID",
      );

      // Delete non-existent
      const deleteFail = await templates.deleteTemplate(fakeId);
      assertEquals(deleteFail, false);
      console.log(
        "DELETE_TEMPLATE FAIL (Expected): Correctly returned false for fake ID",
      );
    },
  );

  // Clean up
  await CLIENT.close();
});
