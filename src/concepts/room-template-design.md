# Design Notes: RoomTemplate Concept Rationale

## Core Design Rationale

This concept is entirely new and serves as the foundational controlled vocabulary for the entire "Dormcraft" application.

### Design Decisions:

1.  **Templates as Categories (Not Instances):** The core decision was to model room types (e.g., Baker Single, New Vassar Double) rather than storing data for every individual room at MIT.
    * **Rationale:** This drastically simplifies the data model, reducing the needed data to a small number of templates. It makes key application features, such as filtering `DesignPosts` by room type, straightforward and efficient.

2.  **Minimalist State for Robustness:** The state is intentionally kept minimal, consisting only of essential categorical data (`dormName`, `roomType`).
    * **Rationale:** By excluding non-essential, complex details like `dimensions` (which could be added later), the concept is more robust, simpler to implement, and unlikely to require refactoring. It strictly adheres to the principle of managing a simple, unchanging vocabulary.

3.  **Flexible Querying:** The `findTemplates` action is designed to be highly flexible, allowing optional filters based on both `dormName` and `roomType`.
    * **Rationale:** This single action is sufficient to power various frontend UI components, such as a drop-down menu that first filters by dorm and then by room type.

### Implementation Notes:

* **Final Implementation:** The initial simple design has proven stable and required no complex changes or refactoring during implementation. Its primary function is a read-only lookup service, making it highly modular and independent.
