# API Specification: Room Template Concept

**Purpose:** To provide a standardized and managed catalog of all possible dorm rooms at MIT. This serves as the "tag" or "category".

---

## API Endpoints

### POST /api/RoomTemplate/addTemplate

**Description:** Creates, stores, and returns the unique ID of a new RoomTemplate object.

**Requirements:**
- An admin-level permission

**Effects:**
- Creates, stores, and returns the unique ID of a new RoomTemplate object

**Request Body:**
```json
{
  "dormName": "string",
  "roomType": "string"
}
```

**Success Response Body (Action):**
```json
{
  "templateID": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/RoomTemplate/getTemplate

**Description:** Retrieves a specific RoomTemplate, or null if not found.

**Requirements:**
- None

**Effects:**
- Retrieves a specific RoomTemplate, or null if not found

**Request Body:**
```json
{
  "templateID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "template": {
    "templateID": "string",
    "dormName": "string",
    "roomType": "string"
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

### POST /api/RoomTemplate/findTemplate

**Description:** Returns a list of templates matching the filter criteria. If no filters are provided, it returns all templates.

**Requirements:**
- None

**Effects:**
- Returns a list of templates matching the filter criteria. If no filters are provided, it returns all templates

**Request Body:**
```json
{
  "dormName": "string",
  "roomType": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "templateID": "string",
    "dormName": "string",
    "roomType": "string"
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

### POST /api/RoomTemplate/updateTemplate

**Description:** Updates a template's details and returns true on success.

**Requirements:**
- An admin-level permission

**Effects:**
- Updates a template's details and returns true on success

**Request Body:**
```json
{
  "templateID": "string",
  "dormName": "string",
  "roomType": "string"
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

### POST /api/RoomTemplate/deleteTemplate

**Description:** Deletes a template and returns true on success.

**Requirements:**
- An admin-level permission

**Effects:**
- Deletes a template and returns true on success

**Request Body:**
```json
{
  "templateID": "string"
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
