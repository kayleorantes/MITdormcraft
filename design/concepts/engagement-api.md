# API Specification: Engagement Concept

**Purpose:** To manage all social interactions related to a post, namely upvotes and comments.

---

## API Endpoints

### POST /api/Engagement/getEngagementForPost

**Description:** Returns the upvotes and comments for a post. If none exists, returns an empty object.

**Requirements:**
- None

**Effects:**
- Returns the upvotes and comments for a post. If none exists, returns an empty object

**Request Body:**
```json
{
  "postID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "engagement": {
    "upvotes": ["string"],
    "comments": [
      {
        "commentID": "string",
        "authorID": "string",
        "text": "string",
        "createdAt": "string"
      }
    ]
  }
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Engagement/toggleUpvote

**Description:** Adds a user ID to the upvotes set, or removes it if already present. Returns the user's new upvote status and the new set size.

**Requirements:**
- `postID` and `userID` must be valid

**Effects:**
- Adds a `userID` to the `upvotes` set, or removes it if already present. Returns the user's new upvote status and the new set size

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
  "upvoted": "boolean",
  "total": "number"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Engagement/addComment

**Description:** Adds a new comment to the comments list and returns the created comment object.

**Requirements:**
- `postID` and `authorID` must be valid

**Effects:**
- Adds a new comment to the `comments` list and returns the created comment object

**Request Body:**
```json
{
  "postID": "string",
  "authorID": "string",
  "text": "string"
}
```

**Success Response Body (Action):**
```json
{
  "comment": {
    "commentID": "string",
    "authorID": "string",
    "text": "string",
    "createdAt": "string"
  }
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Engagement/deleteComment

**Description:** Removes a comment from the comments list and returns true on success.

**Requirements:**
- `userID` must match the `authorID` of the comment

**Effects:**
- Removes a comment from the `comments` list and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "commentID": "string",
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

### POST /api/Engagement/editComment

**Description:** Updates the text of a specific comment and returns true on success.

**Requirements:**
- `userID` must match the `authorID` of the comment

**Effects:**
- Updates the `text` of a specific comment and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "commentID": "string",
  "userID": "string",
  "newText": "string"
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
