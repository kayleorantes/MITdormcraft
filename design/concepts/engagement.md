**Concept Specification: Engagement**

    concept: Engagement

    purpose: To manage all social interactions related to a post, namely upvotes and comments. 

    principle: This concept gathers all interactions related to a single, abstract `contentID`. All interactions are authored by a `userID`. This concept is separate from the content itself, allowing social features to be added or modified without changing the content concept

    state:
        - a set of Engagements (one per post) with
            postID              String     
            upvotes             Set<UserID>      
            comments            List<{commentID: String, authorID: String, text: String, createdAt: Date}>
        
    actions:
    - getEngagementForPost(postID: String): (engagement: {upvotes: Set<String>, comments: List<{...}>})
        effects: Returns the upvotes and comments for a post. If none exists, returns an empty object.
        
    - toggleUpvote(postID: String, userID: String): (upvoted: boolean, total: number)
        requires: `postID` and `userID` must be valid.
        effects: Adds a `userID` to the `upvotes` set, or removes it if already present. Returns the user's new upvote status and the new set size.

    - addComment(postID: String, authorID: String, text: String): (comment: {commentID: String, authorID: String, ...})
        requires: `postID` and `authorID` must be valid.
        effects: Adds a new comment to the `comments` list and returns the created comment object.

    - deleteComment(postID: String, commentID: String, userID: String): (success: boolean)
        requires: `userID` must match the `authorID` of the comment.
        effects: Removes a comment from the `comments` list and returns true on success.

    - editComment(postID: String, commentID: String, userID: String, newText: String): (success: boolean)
        requires: `userID` must match the `authorID` of the comment.
        effects: Updates the `text` of a specific comment and returns true on success.


<br>
