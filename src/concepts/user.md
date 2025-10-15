# Concept: UserAccount

**purpose**: To manage user identity and profile information. This concept is the foundation for authorship and social interaction.

**principle**: Each user has a unique, persistent identity. All content creation (posts, comments, upvotes) is tied back to a user account.

**state**:
- a set of Users with
    userID       String   // Unique identifier (MongoDB ObjectId)
    username     String   // Public display name
    mitKerberos  String   // MIT email/ID for authentication
    bio          String   // A short user-provided description
    createdAt    Date     // Timestamp of account creation

**actions**:
- `createUser(username: String, mitKerberos: String, bio: String): (user: User)`
    - **requires**: `username` and `mitKerberos` must not already exist in the database.
    - **effects**: Creates, stores, and returns a new `User` object.

- `getUser(userID: String): (user: User | null)`
    - **effects**: Returns the `User` object for a given `userID`, or `null` if not found.

- `updateBio(userID: String, newBio: String): (success: boolean)`
    - **requires**: `userID` must correspond to an existing user.
    - **effects**: Updates the `bio` field for the specified user and returns `true` on success.