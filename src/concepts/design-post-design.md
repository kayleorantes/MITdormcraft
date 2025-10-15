# Design Notes: DesignPost Concept

This is the core content concept of the application.

**Initial Design Choices:**
* **Strict Modularity:** This concept is intentionally "dumb" about social features. It does not know what an upvote or a comment is. Its only job is to manage the post's content (title, image, etc.) and its relationship to an author and a room template. This separation of concerns is the most critical aspect of its design.
* **Ownership Check in `deletePost`:** The `deletePost` action requires both a `postID` and a `userID`. The implementation ensures that the `userID` matches the post's `authorID` before allowing deletion. This is a crucial security and data integrity feature implemented directly at the concept level.

**Changes from Initial Thought:**
* I added a `createdAt` timestamp during implementation. This is essential for sorting the feed chronologically (`findPosts` now sorts by newest first), which is a standard user expectation for this type of application.
* I specified that `authorID` and `templateID` are stored as `ObjectId` types in the database. This allows for powerful database-level operations, like "joins" (using `$lookup`), if needed for more complex queries in the future, without having to change the concept's interface.