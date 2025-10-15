# Design Notes: RoomTemplate Concept

This concept acts as a controlled vocabulary or a "tagging" system for the entire application.

**Initial Design Choices:**
* **Templates as Categories:** The core design decision was to model room types, not individual rooms. This simplifies the application immensely. Instead of needing data for every single room at MIT, we only need a few dozen templates (e.g., Baker Single, Baker Double, etc.). This makes `findPosts` for a specific room type straightforward.
* **Simple State:** The state is minimal (`dormName`, `roomType`). I initially considered adding `dimensions` but decided against it for this assignment's scope. It's a non-essential detail that could be added later without breaking the concept's core purpose. Keeping it simple makes the concept more robust and easier to implement.

**Changes from Initial Thought:**
* No significant changes were made. The concept is simple and foundational, and the initial design has proven to be solid. The `findTemplates` action with optional filters is flexible enough for any UI needs (e.g., a dropdown for dorms, then a dropdown for room types).