# Design Notes: UserAccount Concept Rationale

## Core Design Rationale

This concept is entirely new, developed to establish a robust and centralized single source of truth for user identity within the application, as suggested for sound backend architecture.

### Design Decisions:

1.  **Strict Modularity (Identity Isolation):** The `UserAccount` concept manages only fundamental user data (`kerberos`, `name`, `profileImageURL`).
    * **Rationale:** It knows absolutely nothing about other application entities like `Posts`, `Comments`, or `Rooms`. This is critical for modularity: any other concept that needs to reference a user does so only via the `userID`.

2.  **`mitKerberos` as the Unique Identifier:** The system uses the user's MIT Kerberos ID to identify and manage the account.
    * **Rationale:** This serves as a strong, real-world unique constraint, preventing duplicate accounts for the same person and providing a reliable, verifiable identity hook for potential future authentication systems.

3.  **Account Creation Control:** The `createUser` action is designed to be idempotent (only creates if one doesn't already exist for that `kerberos`).
    * **Rationale:** This ensures that even if the front-end calls the creation function multiple times during login, a unique and consistent user account is maintained.

### Implementation and Refinement Decisions:

1.  **`createdAt` Timestamp Inclusion:** A `createdAt` timestamp was added to the state during implementation.
    * **Rationale:** Although not strictly functional for the core features, this field is essential for standard application needs, such as user analytics, providing a "member since" display on a profile, and maintaining an implicit chronological order for the database records.

2.  **Optional Fields:** Fields like `profileImageURL` are treated as optional inputs (or can be set to a default value upon creation).
    * **Rationale:** This allows the system to support a complete profile without forcing the user to provide all data immediately, improving the initial user experience.
