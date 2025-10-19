# Authentication Test Output


> deno test --allow-net --allow-env --allow-sys --env src/concepts/authentication.test.ts

Check file:///Users/korantes/MITdormcraft/src/concepts/authentication.test.ts
running 1 test from ./src/concepts/authentication.test.ts
Authentication Concept Tests (Stateless) ...
  Operational Principle: Register -> Verify Credentials ...
------- output -------

--- Testing Register and Verify Lifecycle ---
REGISTER SUCCESS: Created user 68f498ee4776b2279cc9d292
VERIFIED: User profile was created in 'users' collection
VERIFY SUCCESS: Credentials are valid
----- output end -----
  Operational Principle: Register -> Verify Credentials ... ok (282ms)
  Interesting Scenario: Register (Duplicate Username) ...
------- output -------

--- Testing Duplicate Username Registration ---
REGISTER FAIL (Expected): Prevented duplicate username
----- output end -----
  Interesting Scenario: Register (Duplicate Username) ... ok (17ms)
  Interesting Scenario: Register (Duplicate Kerberos) ...
------- output -------

--- Testing Duplicate Kerberos Registration ---
REGISTER FAIL (Expected): Prevented duplicate kerberos
----- output end -----
  Interesting Scenario: Register (Duplicate Kerberos) ... ok (32ms)
  Interesting Scenario: Verify (Wrong Password) ...
------- output -------

--- Testing Verify with Wrong Password ---
VERIFY FAIL (Expected): Correctly returned null for wrong password
----- output end -----
  Interesting Scenario: Verify (Wrong Password) ... ok (84ms)
  Interesting Scenario: Verify (Non-existent User) ...
------- output -------

--- Testing Verify with Non-existent User ---
VERIFY FAIL (Expected): Correctly returned null for non-existent user
----- output end -----
  Interesting Scenario: Verify (Non-existent User) ... ok (16ms)
Authentication Concept Tests (Stateless) ... ok (1s)

ok | 1 passed (5 steps) | 0 failed (1s)


