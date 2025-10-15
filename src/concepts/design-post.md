# Concept: DesignPost

**purpose**: To store the core user-generated content: the photos and descriptions of a decorated dorm room.

**principle**: Each post is authored by one `User` and is categorized under exactly one `RoomTemplate`. The post itself is independent of the social feedback it receives.

**state**:
- a set of Posts with
    postID       String   // Unique identifier (MongoDB ObjectId)
    authorID     String   // Reference to the User who created it
    templateID   String   // Reference to the RoomTemplate it represents
    title        String   // A title for the design, e.g., "Cozy Minimalist Setup"
    description  String   // Text describing the design
    imageURL     String   // URL to the hosted image of the dorm room
    createdAt    Date     // Time of post creation for sorting

**actions**:
- `createPost(authorID: String, templateID: String, title: String, description: String, imageURL: String): (post: Post)`
    - **requires**: `authorID` and `templateID` must be valid, existing IDs.
    - **effects**: Creates, stores, and returns a new `Post` object.

- `getPost(postID: String): (post: Post | null)`
    - **effects**: Returns a specific `Post`, or `null` if not found.

- `findPosts(templateID: String): (posts: List<Post>)`
    - **effects**: Returns all posts for a specific room template, sorted newest first.

- `deletePost(postID: String, userID: String): (success: boolean)`
    - **requires**: The `userID` must match the `authorID` of the post.
    - **effects**: Removes a post and returns `true` on success.