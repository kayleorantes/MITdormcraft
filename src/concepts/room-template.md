# Concept: RoomTemplate

**purpose**: To provide a standardized catalog of all possible dorm rooms at MIT. This serves as the "tag" or "category" for every user post.

**principle**: A room template represents a *type* of room (e.g., a "New Vassar Double"), not a specific, physical room instance. This aligns with the assumption that all rooms of a given type are identical.

**state**:
- a set of RoomTemplates with
    templateID   String   // Unique identifier (MongoDB ObjectId)
    dormName     String   // e.g., "New Vassar", "Next House"
    roomType     String   // e.g., "Single", "Double", "Quad"

**actions**:
- `addTemplate(dormName: String, roomType: String): (template: RoomTemplate)`
    - **effects**: Creates, stores, and returns a new, standardized `RoomTemplate`.

- `getTemplate(templateID: String): (template: RoomTemplate | null)`
    - **effects**: Retrieves a specific `RoomTemplate`, or `null` if not found.

- `findTemplates(dormName?: String, roomType?: String): (templates: List<RoomTemplate>)`
    - **effects**: Returns a list of templates matching the filter criteria. If no filters are provided, it returns all templates.