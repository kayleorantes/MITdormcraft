# Design Post Test Output


> deno test --allow-net design-post.test.ts

running 1 test from design-post.test.ts

--- Testing Operational Principle ---
CREATE_POST SUCCESS: Created post <some_object_id>
FIND_POSTS SUCCESS: Found 1 post for the template.
DELETE_POST SUCCESS: Author successfully deleted their post.

--- Testing Unauthorized Deletion ---
DELETE_POST FAIL (Expected): Prevented unauthorized deletion.

--- Testing Find with No Posts ---
FIND_POSTS SUCCESS: Correctly returned empty array.

DesignPost Concept Tests ... ok (3 steps)

ok | 1 passed | 0 failed