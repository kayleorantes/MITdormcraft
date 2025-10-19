# Design Notes: Authentication Concept

## Core Design Rationale

This concept is entirely new and was created to handle all security-critical logic, separating it from the public-facing `User` profile concept. This separation of concerns is the most important architectural decision for this concept.

* `Authentication` (this concept) handles passwords and registration.
* `User` (other concept) handles public data like `username` and `bio`.

---

## Design Decisions: State

This concept manages one primary collection:

1.  **`credentials`:** This collection stores the `mitKerberos` and `credentialHash` (the hashed password). It is linked to the `users` collection via the `userID`.
    * Rationale: This isolates the most sensitive data. A breach of the `users` collection would not expose password hashes.

It does **not** manage sessions. Session creation is left to the API layer, which will first call this concept's `verifyCredentials` action.

---

## Design Decisions: Actions

1.  **`registerAndCreateAccount(...)`:** This is the most complex action.
    * Rationale: It must perform a "transaction-like" operation. 1) It checks for uniqueness of `username` (in `users`) and `mitKerberos` (in `credentials`). 2) It hashes the password using `bcrypt`. 3) It creates the `User` document. 4) It creates the `Credential` document, linking them. This ensures a `User` cannot exist without `Credentials`, and vice-versa.

2.  **`verifyCredentials(...)`:** This is the new "login" action.
    * Rationale: It simply compares a provided password with the stored hash using `bcrypt.compare`. It returns the `userID` on success or `null` on failure. It does not create a token. It is the responsibility of a higher-level service to take this successful verification and create its own session or cookie.

## Security & Dependencies

* **Hashing:** Passwords (`credential_data`) are never stored. We use `npm:bcrypt` to create a one-way hash (`bcrypt.hash`) and to compare against it (`bcrypt.compare`).