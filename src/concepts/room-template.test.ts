import { assertEquals } from "std/assert";
import { RoomTemplateConcept } from "./room-template.ts";
import { MongoClient } from "mongodb";

const CLIENT = new MongoClient(
  "mongodb+srv://kayleorantes:EXRGj2KgFZP76KFL@dormcraft.ayphfcs.mongodb.net/?retryWrites=true&w=majority&appName=dormcraft",
);
const DB = CLIENT.db("dormgram_test");

Deno.test("RoomTemplate Concept Tests", async (t) => {
  const templates = new RoomTemplateConcept(DB);
  await DB.collection("room_templates").deleteMany({});

  await t.step("Operational Principle: Add and Find Templates", async () => {
    console.log("\n--- Testing Operational Principle ---");
    await templates.addTemplate("New Vassar", "Double");
    await templates.addTemplate("Baker House", "Single");
    console.log("ADD_TEMPLATE SUCCESS: Added 2 templates.");

    const found = await templates.findTemplates("New Vassar");
    assertEquals(found.length, 1);
    assertEquals(found[0].roomType, "Double");
    console.log("FIND_TEMPLATES SUCCESS: Found 1 template for New Vassar.");
  });

  await t.step("Interesting Scenario: Find with no filters", async () => {
    console.log("\n--- Testing Find with No Filters ---");
    const all = await templates.findTemplates();
    assertEquals(all.length, 2);
    console.log("FIND_TEMPLATES SUCCESS: Correctly returned all 2 templates.");
  });

  await t.step("Interesting Scenario: Find with no matches", async () => {
    console.log("\n--- Testing Find with No Matches ---");
    const none = await templates.findTemplates("Simmons Hall");
    assertEquals(none.length, 0);
    console.log(
      "FIND_TEMPLATES SUCCESS: Correctly returned 0 templates for non-existent dorm.",
    );
  });

  await CLIENT.close();
});
