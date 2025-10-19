# Design Notes: Engagement Concept

## Core Design Rationale

This concept is entirely new and was created specifically to isolate all social interaction logic (like upvotes and comments) from the core content concepts (like `DesignPost`).

Rationale: This separation of concerns is critical for modularity. The `DesignPost` concept doesn't need to know what a "comment" is, and this `Engagement` concept doesn't need to know what a "post" is. This concept only knows how to associate interactions with an abstract `postID` (a content identifier), making the system easy to maintain and extend.

---

## Design Decisions: State

1.  **Post-Centric Documents:** Each document in the `engagements` collection corresponds to one `postID`.
    * Rationale: This is a highly efficient data modeling pattern. It allows us to retrieve all comments and upvotes for a single post in one database query, which is performant for loading a post's entire social view.

2.  **`upvotes` as a Set:** The state for upvotes is defined as a Set of `userID`s.
    * Rationale: This naturally enforces the invariant that a user can only upvote a post once. In the MongoDB implementation, this directly maps to the `$addToSet` and `$pull` operators, which automatically handle duplicate prevention.

3.  **`comments` as a List:** The state for comments is a List of comment objects.
    * Rationale: This allows for an ordered, chronological feed of comments directly within the engagement document.

4.  **Unique `commentID`s:** Each comment object within the `comments` list is given its own unique `commentID`.
    * Rationale: This is essential for enabling `editComment` and `deleteComment` actions. Without a unique ID, it would be impossible to reliably target a specific comment for an update or deletion.

---

## Design Decisions: Actions

1.  **`getEngagementForPost(postID)`:** This is the primary read action.
    * Rationale: It simply retrieves the engagement document. If no document exists (i.e., no one has upvoted or commented yet), the implementation should return an empty, default object so the frontend doesn't have to handle `null` cases.

2.  **`toggleUpvote(postID, userID)`:** A single, unified action for upvoting.
    * Rationale: This simplifies client-side logic. The frontend doesn't need to track if the user has already upvoted; it just calls `toggleUpvote`. The backend handles the logic (add if not present, remove if present) and returns the new state, which the UI can use to update itself.

3.  **`addComment(postID, authorID, text)`:** The standard creation action for comments.
    * Rationale: This action appends a new comment object (complete with a new `commentID`, the `authorID`, text, and a `createdAt` timestamp) to the `comments` list.

4.  **`editComment(...)` and `deleteComment(...)`:** These actions manage the comment lifecycle.
    * Rationale: These actions were included to provide full CRUD functionality. Crucially, both actions require the `userID` of the person *making* the request. The implementation must check that this `userID` matches the `authorID` stored on the comment, enforcing the invariant that only the original author of a comment can modify or delete it.