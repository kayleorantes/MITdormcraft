# Design Notes: RoomTemplate Concept

## Core Design Rationale

This concept is entirely new and serves as the foundational "controlled vocabulary" for the entire MITdormcraft application. Its purpose is to provide a standardized and managed catalog of all possible dorm room types, which other concepts can reference as a "label" or "category."

---

## Design Decisions: State

1.  **Templates as Categories (Not Instances):** The core decision was to model room types (e.g., "Baker Single") rather than individual, physical rooms.
    * Rationale: This drastically simplifies the data model by reducing it to a small set of templates. It makes key application features, such as filtering `DesignPosts` by room type, straightforward and efficient.

2.  **Minimalist State for Robustness:** The state is intentionally kept minimal (`dormName`, `roomType`).
    * Rationale: By excluding complex, non-essential details (like room dimensions), the concept is more robust and simpler to implement. It strictly adheres to its purpose of managing a simple vocabulary.

---

## Design Decisions: Actions

The concept's actions are split into two distinct categories: general-use "read" actions and privileged "write" actions.

1.  **Read Actions (for all users):**
    * `findTemplates(dormName?, roomType?)`: This is the primary read action. It is designed to be highly flexible, allowing optional filters.
    * Rationale: This single action is sufficient to power various frontend UI components, such as a drop-down menu that first filters by dorm and then by room type.
    * `getTemplate(templateID)`: A standard action to retrieve a single template by its unique ID.

2.  **Write Actions (for administrative use):**
    * `addTemplate(...)`, `updateTemplate(...)`, `deleteTemplate(...)`: These actions were added to make the catalog manageable.
    * Rationale: These actions are conceptually "admin-only." We don't want regular users adding, changing, or deleting the official list of MIT room types. This prevents data corruption (e.g., "Bkr Single", "Baker-Single"). The application's (future) API layer will be responsible for locking these actions down to admin accounts.

---

## Implementation Notes

* **`addTemplate` Return Value:** This action was implemented to return only the new `templateID` as a `string`, rather than the entire composite object. This is a cleaner, more modular pattern that adheres to concept design principles.
* **Removed "Read-Only" Status:** The concept is no longer a simple "read-only" service. It is now a fully manageable, but controlled, collection of data, with a clear separation between its read and write functionalities.