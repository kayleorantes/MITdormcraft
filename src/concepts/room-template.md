**Original Concept Specification: Room Template**

    concept: RoomTemplate

    purpose: To provide a standardized and managed catalog of all possible dorm rooms at MIT. This serves as the "tag" or "category".

    principle: A room template represents a type of room, not a specific, physical room instance. This aligns with the assumption that all rooms of a given type are identical. It is a read-heavy "lookup" concept for users and a write-heavy "management" concept for administrators.

    state:
        - a set of RoomTemplates with
            templateID   String 
            dormName     String  
            roomType     String 
        
    actions:
    - addTemplate(dormName: String, roomType: String): (templateID: String)
        requires: An admin-level permission
        effects: Creates, stores, and returns the unique ID of a new RoomTemplate object
    
    - getTemplate(templateID: String): (template: {templateID: String, dormName: String, roomType: String} | null)
        effects: Retrieves a specific RoomTemplate, or null if not found

    - findTemplate(dormName?: String, roomType?: String): (templates: List<{templateID: String, dormName: String, roomType: String}>)
        effects: Returns a list of templates matching the filter criteria. If no filters are provided, it returns all templates

    - updateTemplate(templateID: String, dormName?: String, roomType?: String): (success: boolean)
        requires: An admin-level permission
        effects: Updates a template's details and returns true on success

    - deleteTemplate(templateID: String): (success: boolean)
        requires: An admin-level permission
        effects: Deletes a template and returns true on success.
<br>