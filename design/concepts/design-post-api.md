# API Specification: Design Post Concept

**Purpose:** To store the core user-generated content: the photos and descriptions of a decorated dorm room.

---

## API Endpoints

### POST /api/DesignPost/createPost

**Description:** Creates, stores, and returns the new post ID.

**Requirements:**
- `authorID` and `templateID` must be valid IDs

**Effects:**
- Creates, stores, and returns the new `postID`

**Request Body:**
```json
{
  "authorID": "string",
  "templateID": "string",
  "title": "string",
  "description": "string",
  "imageURL": "string"
}
```

**Success Response Body (Action):**
```json
{
  "postID": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/getPost

**Description:** Returns a specific Post, or null if not found.

**Requirements:**
- None

**Effects:**
- Returns a specific Post, or null if not found

**Request Body:**
```json
{
  "postID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "post": {
    "postID": "string",
    "authorID": "string",
    "templateID": "string",
    "title": "string",
    "description": "string",
    "imageURL": "string",
    "createdAt": "string"
  } | null
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/findPostsByTemplate

**Description:** Returns all posts for a specific room template, sorted newest first.

**Requirements:**
- None

**Effects:**
- Returns all posts for a specific room template, sorted newest first

**Request Body:**
```json
{
  "templateID": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "postID": "string",
    "authorID": "string",
    "templateID": "string",
    "title": "string",
    "description": "string",
    "imageURL": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/findPostsByAuthor

**Description:** Returns all posts from a specific author, sorted newest first.

**Requirements:**
- None

**Effects:**
- Returns all posts from a specific author, sorted newest first

**Request Body:**
```json
{
  "authorID": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "postID": "string",
    "authorID": "string",
    "templateID": "string",
    "title": "string",
    "description": "string",
    "imageURL": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/editPost

**Description:** Updates the post's editable fields (title, description, image) and returns true on success.

**Requirements:**
- The `userID` must match the `authorID` of the post

**Effects:**
- Updates the post's editable fields (title, description, image) and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "userID": "string",
  "title": "string",
  "description": "string",
  "imageURL": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/deletePost

**Description:** Removes a post and returns true on success.

**Requirements:**
- The `userID` must match the `authorID` of the post

**Effects:**
- Removes a post and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "userID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---
