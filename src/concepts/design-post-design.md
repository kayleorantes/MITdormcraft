# Design Notes: DesignPost Concept

## Design Rationale and Core Decisions

This concept was created new for this assignment to support the "Dormcraft" feed feature, allowing users to share and browse designs. It was not present in the original Assignment 2 design.

* **Concept's Purpose:** To act as the root entity for a user-created room design, defining its core, unchanging state.
* **State Components:** The required state includes the `authorID` (who owns it), the `templateID` (which room template it uses), and the actual design data (`designJSON`).
* **Decoupling Social Features (Strict Modularity):** This concept is intentionally designed to be **"dumb"** about social features. It does not store or manage comments, upvotes, or views. This separation of concerns ensures:
    * The `DesignPost` concept only manages the integrity of the design data.
    * Separate concepts (e.g., `CommentConcept`, `UpvoteConcept`) can manage the social interactions, making both systems highly modular.
* **Design Data Integrity:** The `designJSON` field stores the user's design as a string. This is treated as a primitive value by the concept, ensuring the concept is only responsible for storing it, not validating its contents (which is deferred to the front end).

## Implementation and Refinement Decisions

The following elements were refined or added during the implementation process to ensure robustness and a better user experience:

1.  **Timestamp Addition:** I included a **`createdAt`** timestamp during implementation. This is crucial for allowing the front end to sort the user feed chronologically, which is a standard user expectation for a feed-based application.
2.  **Ownership Check in `deletePost`:** The `deletePost` action requires both a `postID` and a **`userID`**. The implementation ensures that the passed-in `userID` matches the post's **`authorID`** before allowing deletion. This is a critical security and data integrity check enforced at the concept level.
3.  **ID Typing:** `authorID` and `templateID` are stored as **`ObjectId`** types in the database, even though they are treated as strings in the concept interface. This allows for powerful database-level operations (like joins using `$lookup`) if needed for more complex queries in the future, without violating the concept's modular, ID-only interface.
