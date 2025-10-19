# User Account Test Output

> deno test --allow-net --allow-env --allow-sys --env src/concepts/user.test.ts


Check file:///Users/korantes/MITdormcraft/src/concepts/user.test.ts
running 1 test from ./src/concepts/user.test.ts
User Concept Tests ...
  Setup: Insert test user directly ...
------- output -------

--- SETUP SUCCESS: Created test user 68f4921f611080c5388a4992 ---
----- output end -----
  Setup: Insert test user directly ... ok (20ms)
  Operational Principle: Get user by ID and update profile ...
------- output -------

--- Testing GetUser and UpdateUserProfile ---
GET_USER SUCCESS: Fetched user test_user_1
UPDATE_USER_PROFILE SUCCESS: User bio updated to "A new bio."
----- output end -----
  Operational Principle: Get user by ID and update profile ... ok (52ms)
  Variant Test: Get user by Username ...
------- output -------

--- Testing GetUserByUsername ---
GET_USER_BY_USERNAME SUCCESS: Fetched user test_user_1
----- output end -----
  Variant Test: Get user by Username ... ok (16ms)
  Interesting Scenario: Get a non-existent user by ID ...
------- output -------

--- Testing Non-existent User (by ID) ---
GET_USER SUCCESS (Expected): Correctly returned null for non-existent ID
----- output end -----
  Interesting Scenario: Get a non-existent user by ID ... ok (16ms)
  Interesting Scenario: Get a non-existent user by Username ...
------- output -------

--- Testing Non-existent User (by Username) ---
GET_USER_BY_USERNAME SUCCESS (Expected): Correctly returned null for non-existent username
----- output end -----
  Interesting Scenario: Get a non-existent user by Username ... ok (16ms)
  Interesting Scenario: Update a non-existent user ...
------- output -------

--- Testing Update on Non-existent User ---
UPDATE_USER_PROFILE FAIL (Expected): Correctly returned false for non-existent user
----- output end -----
  Interesting Scenario: Update a non-existent user ... ok (16ms)
User Concept Tests ... ok (700ms)

ok | 1 passed (6 steps) | 0 failed (704ms)

korantes@Q1PF0921T6 MITdormcraft % 