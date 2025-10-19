# Room Template Test Output

> deno test --allow-net --allow-env --allow-sys --env src/concepts/room-template.test.ts

Check file:///Users/korantes/MITdormcraft/src/concepts/room-template.test.ts
running 1 test from ./src/concepts/room-template.test.ts
RoomTemplate Concept Tests ...
  Operational Principle: Add, Get, Update, and Delete Template ...
------- output -------

--- Testing Operational Principle (CRUD) ---
ADD_TEMPLATE SUCCESS: Created template with ID 68f494888f712e5f0803abd5
GET_TEMPLATE SUCCESS: Fetched template Baker House
UPDATE_TEMPLATE SUCCESS: Template roomType updated to "Single (Updated)"
DELETE_TEMPLATE SUCCESS: Template 68f494888f712e5f0803abd5 deleted
----- output end -----
  Operational Principle: Add, Get, Update, and Delete Template ... ok (128ms)
  Variant Tests: `findTemplates` Action ...
------- output -------

--- Testing `findTemplates` Queries ---
Setup: Added 3 templates for finding
FIND_TEMPLATES SUCCESS: Found 2 templates for New Vassar
FIND_TEMPLATES SUCCESS: Found 2 Single templates
FIND_TEMPLATES SUCCESS: Found 1 Simmons Single template
FIND_TEMPLATES SUCCESS: Correctly returned all 3 templates
FIND_TEMPLATES SUCCESS: Correctly returned 0 templates for non-existent dorm
----- output end -----
  Variant Tests: `findTemplates` Action ... ok (135ms)
  Interesting Scenarios: Actions on Non-existent IDs ...
------- output -------

--- Testing Failures on Non-existent IDs ---
GET_TEMPLATE FAIL (Expected): Correctly returned null for fake ID
UPDATE_TEMPLATE FAIL (Expected): Correctly returned false for fake ID
DELETE_TEMPLATE FAIL (Expected): Correctly returned false for fake ID
----- output end -----
  Interesting Scenarios: Actions on Non-existent IDs ... ok (49ms)
RoomTemplate Concept Tests ... ok (843ms)

ok | 1 passed (3 steps) | 0 failed (856ms)
