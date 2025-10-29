# API Specification: Authentication Concept

**Purpose:** To manage user sign-up, login, and session identity

---

## API Endpoints

### POST /api/Authentication/registerAndCreateAccount

**Description:** Creates a new user account with credentials and returns the user ID.

**Requirements:**
- `username` must not exist in the 'users' collection
- `mitKerberos` must not exist in the 'credentials' collection

**Effects:**
- Hashes the `credential_data`
- Creates a new `User` document
- Creates a new `Credential` document linked to the new `userID`
- Returns the new `userID` as a string

**Request Body:**
```json
{
  "username": "string",
  "mitKerberos": "string",
  "bio": "string",
  "credential_data": "string"
}
```

**Success Response Body (Action):**
```json
{
  "userID": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Authentication/verifyCredentials

**Description:** Verifies user credentials and returns the user ID if valid.

**Requirements:**
- User with `mitKerberos` exists

**Effects:**
- Compares the provided `credential_data` with the stored hash. If they match, returns the `userID`. If not, returns `null`

**Request Body:**
```json
{
  "mitKerberos": "string",
  "credential_data": "string"
}
```

**Success Response Body (Action):**
```json
{
  "userID": "string | null"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---
