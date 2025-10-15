# User Account Test Output

> deno test --allow-net user.test.ts

running 1 test from user.test.ts

--- Testing Operational Principle ---
CREATE_USER SUCCESS: Created user testuser with ID <some_object_id>
GET_USER SUCCESS: Fetched user testuser
UPDATE_BIO SUCCESS: User bio updated to "A new bio."

--- Testing Duplicate User Creation ---
CREATE_USER FAIL (Expected): Prevented duplicate username

--- Testing Non-existent User ---
GET_USER SUCCESS: Correctly returned null for non-existent ID

UserAccount Concept Tests ... ok (3 steps)

ok | 1 passed | 0 failed