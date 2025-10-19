**Concept Specification: Design Post**

    concept: DesignPost

    purpose: To store the core user-generated content: the photos and descriptions of a decorated dorm room.

    principle: Each post is a self-contained piece of content. It is immutably linked to an `authorID` (who created it) and a `templateID` (what it represents). The post's content (e.g., title) can be modified, but only by its original author

    state:
        - a set of Posts with
            postID              String
            authorID            String
            templateID          String 
            title               String 
            description         String 
            imageURL            String
            createdAt           Date 


    actions:
    - createPost(authorID: String, templateID: String, title: String, description: String, imageURL: String): (postID: String)
        requires: `authorID` and `templateID` must be valid IDs.
        effects: Creates, stores, and returns the new `postID`.

    - getPost(postID: String): (post: {postID: String, authorID: String, templateID: String, ...} | null)
        effects: Returns a specific Post, or null if not found.

    - findPostsByTemplate(templateID: String): (posts: List<{...}>)
        effects: Returns all posts for a specific room template, sorted newest first.

    - findPostsByAuthor(authorID: String): (posts: List<{...}>)
        effects: Returns all posts from a specific author, sorted newest first.

    - editPost(postID: String, userID: String, title?: String, description?: String, imageURL?: String): (success: boolean)
        requires: The `userID` must match the `authorID` of the post.
        effects: Updates the post's editable fields (title, description, image) and returns true on success.

    - deletePost(postID: String, userID: String): (success: boolean)
        requires: The `userID` must match the `authorID` of the post.
        effects: Removes a post and returns true on success.

<br>