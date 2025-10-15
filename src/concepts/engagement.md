# Concept: Engagement

**purpose**: To manage all social interactions related to a post, namely upvotes and comments. This keeps the `DesignPost` concept clean and focused on content.

**principle**: Engagement is always tied to a specific `Post`. All interactions (upvotes, comments) are linked to a `User`.

**state**:
- a set of Engagements with
    postID     String                             // The post being engaged with (acts as the ID for this document)
    upvotes    Set<UserID>                        // A set of user IDs who have upvoted
    comments   List<{commentID: String, authorID: String, text: String, createdAt: Date}> // A list of comments

**actions**:
- `getEngagementForPost(postID: String): (engagement: Engagement)`
    - **effects**: Returns the upvotes and comments for a post. If none exists, returns an empty engagement object.

- `toggleUpvote(postID: String, userID: String): (upvoted: boolean, total: number)`
    - **requires**: `postID` and `userID` must be valid.
    - **effects**: Adds a user's upvote if they haven't voted yet, or removes it if they have. Returns the user's new upvote status (`true` if upvoted) and the new total count.

- `addComment(postID: String, userID: String, text: String): (comment: Comment)`
    - **requires**: `postID` and `userID` must be valid.
    - **effects**: Adds a new comment to a post and returns the created comment object.