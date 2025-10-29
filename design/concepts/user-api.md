# API Specification: UserAccount Concept

**Purpose:** To manage user identity and profile information

---

## API Endpoints

### POST /api/UserAccount/getUser

**Description:** Retrieves a user's public profile information by their user ID.

**Requirements:**
- None specified

**Effects:**
- Returns the public-facing user object, or null if not found.

**Request Body:**
```json
{
  "userID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": {
    "userID": "string",
    "username": "string", 
    "bio": "string",
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

### POST /api/UserAccount/getUserByUsername

**Description:** Retrieves a user's public profile information by their username.

**Requirements:**
- None specified

**Effects:**
- Returns the public-facing user object, or null if not found.

**Request Body:**
```json
{
  "username": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": {
    "userID": "string",
    "username": "string",
    "bio": "string", 
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

### POST /api/UserAccount/updateUserProfile

**Description:** Updates a user's bio information in their profile.

**Requirements:**
- `userID` must correspond to an existing user.

**Effects:**
- Updates the `bio` field for the specified user and returns true on success.

**Request Body:**
```json
{
  "userID": "string",
  "bio": "string"
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
