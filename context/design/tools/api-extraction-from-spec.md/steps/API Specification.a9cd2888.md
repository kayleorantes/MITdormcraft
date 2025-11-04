---
timestamp: 'Tue Oct 21 2025 02:56:40 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251021_025640.dd6f624e.md]]'
content_id: a9cd2888552570acb76aae79894c016ee3b1d8bfa8465b45c452f9ea80db31fa
---

# API Specification: Labeling Concept

**Purpose:** functionality of associating labels with items and then retrieving the items that match a given label.

***

## API Endpoints

### POST /api/Labeling/createLabel

**Description:** Creates a new label with the specified name.

**Requirements:**

* (Not explicitly defined in the concept specification)

**Effects:**

* (Not explicitly defined in the concept specification)

**Request Body:**

```json
{
  "name": "String"
}
```

**Success Response Body (Action):**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Labeling/addLabel

**Description:** Associates a given label with a specific item.

**Requirements:**

* (Not explicitly defined in the concept specification)

**Effects:**

* (Not explicitly defined in the concept specification)

**Request Body:**

```json
{
  "item": "Item",
  "label": "Label"
}
```

**Success Response Body (Action):**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Labeling/deleteLabel

**Description:** Removes the association of a label from a specific item.

**Requirements:**

* (Not explicitly defined in the concept specification)

**Effects:**

* (Not explicitly defined in the concept specification)

**Request Body:**

```json
{
  "item": "Item",
  "label": "Label"
}
```

**Success Response Body (Action):**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***
