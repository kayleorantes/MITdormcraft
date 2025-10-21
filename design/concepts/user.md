**Concept Specification: User Account**

    concept: UserAccount

    purpose: To manage user identity and profile information

    principle: Each user has a unique, persistent identity. All content creation (posts, comments, upvotes) is tied back to a user account

    state:
        - a set of Users with
            userID              String 
            username            String 
            mitKerberos         String
            bio                 String 
            createdAt           Date
        
    actions:
    - getUser(userID: String): (user: {userID: String, username: String, bio: String, createdAt: Date} | null)
        effects: Returns the public-facing user object, or null if not found.

    - getUserByUsername(username: String): (user: {userID: String, username: String, bio: String, createdAt: Date} | null)
        effects: Returns the public-facing user object, or null if not found.

    - updateUserProfile(userID: String, bio: String): (success: boolean)
        requires: `userID` must correspond to an existing user.
        effects: Updates the `bio` field for the specified user and returns true on success.

<br>
