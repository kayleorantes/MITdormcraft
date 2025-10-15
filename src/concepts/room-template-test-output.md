# Room Template Test Output

> deno test --allow-net room-template.test.ts

running 1 test from room-template.test.ts

--- Testing Operational Principle ---
ADD_TEMPLATE SUCCESS: Added 2 templates.
FIND_TEMPLATES SUCCESS: Found 1 template for New Vassar.

--- Testing Find with No Filters ---
FIND_TEMPLATES SUCCESS: Correctly returned all 2 templates.

--- Testing Find with No Matches ---
FIND_TEMPLATES SUCCESS: Correctly returned 0 templates for non-existent dorm.

RoomTemplate Concept Tests ... ok (3 steps)

ok | 1 passed | 0 failed