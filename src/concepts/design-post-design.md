# Design Notes: DesignPost Concept

## Core Design Rationale

This concept is entirely new and was created to support the "MITdormcraft" feed, acting as the core content entity. Its purpose is to store the user-generated content (images and descriptions) for a specific dorm room design.

---

## Design Decisions: State

1.  **Core Content State:** The state was designed to be simple and clear, containing a `title`, `description`, and `imageURL`. This is a pivot from any earlier ideas of storing complex layout data (like JSON) and focuses purely on the "inspiration feed" model.
2.  **`authorID` and `templateID` References:** The state includes an `authorID` and a `templateID`.
    * Rationale: These `String` IDs act as foreign keys, linking the post to the `User` who created it and the `RoomTemplate` it represents. This is the core of the application's data model, connecting content to users and categories.
3.  **`createdAt` Timestamp:** A standard timestamp is included.
    * Rationale: This is essential for the primary user experience: sorting the feed chronologically.

---

## Design Decisions: Actions

1.  **Decoupling Social Features (Modularity):** This concept is intentionally "dumb" about social features.
    * Rationale: The `DesignPost` concept knows nothing about comments or upvotes. Its job is *only* to manage the post's content. All social features are handled by the separate `Engagement` concept. This is a critical separation of concerns.

2.  **Ownership Invariant (`deletePost` and `editPost`):** Both `deletePost` and `editPost` actions require a `userID` as an argument.
    * Rationale: The implementation *must* check that this `userID` matches the post's `authorID`. This enforces the critical invariant that only a post's original author can modify or delete it, building security directly into the concept's logic.

3.  **`createPost` Return Value:** This action returns only the new `postID` as a `string`, not the entire post object.
    * Rationale: This is a clean, modular pattern. The action's effect is the *creation* of a new entity; if the client needs the full object, it can immediately call `getPost(postID)`.

4.  **Query Actions (`findPostsBy...`):** Added two specific query actions: `findPostsByTemplate` and `findPostsByAuthor`.
    * Rationale: These provide the two most essential data-access patterns for the application:
        1.  `findPostsByTemplate`: Populates the feed when a user clicks on a room type (e.g., "Show me all Baker Singles").
        2.  `findPostsByAuthor`: Populates a user's profile page (e.g., "Show me all posts by this user").

---

## Implementation Notes

* **ID Typing:** `authorID` and `templateID` are stored as `ObjectId` types in the database, even though they are treated as strings in the concept's interface. This allows for powerful database-level operations (like joins using `$lookup`) in the future without violating the concept's modular, ID-only interface.