# Design Notes: UserAccount Concept

This concept was designed to be the single source of truth for user identity.

**Initial Design Choices:**
* **`mitKerberos` as a unique identifier:** This ensures that accounts are tied to real MIT students and prevents spam or duplicate accounts from the same person. It also serves as a potential hook for future authentication logic.
* **Separation from other concepts:** The `UserAccount` concept knows nothing about Posts, Comments, or Upvotes. It only manages user data. This is crucial for modularity. Other concepts will simply refer to a user via their `userID`.

**Changes from Initial Thought:**
* I added a `createdAt` timestamp to the state. This wasn't in the initial quick design but is essential for things like sorting users, analytics, or displaying a "member since" date on profiles. It's a small change that adds a lot of future value.