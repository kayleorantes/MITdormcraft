# Design Notes: Engagement Concept

This concept isolates all social interaction logic, which is crucial for modularity.

**Initial Design Choices:**
* **Post-Centric Documents:** Each document in the `engagements` collection corresponds to one `postID`. This is a common and efficient data modeling pattern for this type of problem. It allows us to get all comments and upvotes for a post in a single database query.
* **`toggleUpvote` Action:** Instead of separate `upvote` and `removeUpvote` actions, a single `toggleUpvote` action simplifies the logic for both the backend and the frontend. The frontend doesn't need to track the user's current vote state; it just calls `toggleUpvote`, and the backend handles the logic. The return value immediately gives the frontend the new state (`upvoted: boolean`) and count (`total: number`) to update the UI.
* **Upvotes as a Set:** The state for `upvotes` is defined as a Set of `UserID`s. In the MongoDB implementation, this is handled by `$addToSet`, which automatically prevents duplicate entries. This ensures a user cannot upvote the same post multiple times.

**Changes from Initial Thought:**
* I added a `commentID` to each comment object within the `comments` list. Initially, I omitted this, but it's essential for any future features like deleting or editing a specific comment. Without a unique ID, targeting a single comment in a long list would be difficult and inefficient.