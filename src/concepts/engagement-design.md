# Design Notes: EngagementConcept Rationale

## Core Design Rationale

This concept is entirely new and was created specifically to isolate all social interaction logic from the core `DesignPost` concept, which is crucial for achieving strict modularity and adhering to the principle of separation of concerns.

### Initial Design Decisions:

1.  **Post-Centric Documents:** Each document in the `engagements` collection corresponds to one `postID`.
    * **Rationale:** This is a highly efficient data modeling pattern. It allows us to retrieve all comments and upvotes for a single post in one database query, which is performant for loading a post's entire social view.

2.  **Unified `toggleUpvote` Action:** The concept uses a single `toggleUpvote` action instead of separate `upvote` and `removeUpvote` actions.
    * **Rationale:** This simplifies the client-side logic. The frontend only needs to call `toggleUpvote`, and the backend handles the necessary logic (add if not present, remove if present). The return value immediately gives the new state (`upvoted: boolean`) and the current count (`total: number`) to update the UI.

3.  **Upvotes as a Set (Uniqueness Invariant):** The state for upvotes is defined as a Set of `userID`s.
    * **Rationale:** This naturally enforces the invariant that a user can only upvote a post once. In the MongoDB implementation, this directly maps to the `$addToSet` operator, which automatically prevents duplicate entries and simplifies transactional logic.

### Rationale for State Structure (Refinements):

1.  **Unique `commentID`s:** I included a unique `commentID` for each comment object within the `comments` list.
    * **Rationale:** While initially simpler to omit, a unique ID is essential for future application capabilities, such as allowing a user to `deleteComment(postID, commentID, userID)` or `editComment(...)`. Without this ID, targeting a single comment in a long list would be difficult and inefficient.

2.  **`commentCount` Field (Performance Cache):** A dedicated `commentCount` field is maintained in the state.
    * **Rationale:** Although the count could be derived by counting the array of comments, maintaining a cached count allows the application to quickly return the total comment number without having to fully project and count a potentially long array on every query.
