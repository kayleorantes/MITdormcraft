**Concept Specification: Authentication**

    concept: Authentication

    purpose: To manage user sign-up, login, and session identity

    principle: This is the single source of truth for "who a user is." It is the only concept that should handle credentials. Upon successful first-time-ever login, it creates the corresponding UserAccount

    state:
        - a collection of Credentials with
            userID              String 
            mitKerberos         String 
            credentialHash      String 
        
    actions:
    - registerAndCreateAccount(username: String, mitKerberos: String, bio: String, credential_data: String): (userID: String)
        requires: `username` must not exist in the 'users' collection.
        requires: `mitKerberos` must not exist in the 'credentials' collection.
        effects: 1. Hashes the `credential_data`. 2. Creates a new `User` document. 3. Creates a new `Credential` document linked to the new `userID`. 4. Returns the new `userID` as a string.

    - verifyCredentials(mitKerberos: String, credential_data: String): (userID: String | null)
        requires: User with `mitKerberos` exists.
        effects: Compares the provided `credential_data` with the stored hash. If they match, returns the `userID`. If not, returns `null`.

<br>
