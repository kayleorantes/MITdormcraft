# Overall Design Notes: MITdormcraft Backend

This document outlines the final design of the MITdormcraft application, the rationale behind the pivot from the original complex planning idea, and a summary of key moments during the backend development process.


## Pivot Rationale: From Planning to Inspiration

The project's initial vision was "DormCraft," a tool for students to collaboratively plan and lay out dorm rooms. I have pivoted the application's focus to be a place for inspiration and sharing for MIT dorm room decoration. The key reasons for this shift are aligned with the Assignment 4a's core goals:

1.  **Clearer Modularity (Concept Design Focus)**: The inspiration/sharing model lends itself perfectly to modular concept-oriented design. The ideas of a `User`, a `Post`, a `Room Template` (as a category), and `Engagement` (likes/comments) are distinct and self-contained. This separation was crucial for designing concepts with **no direct dependencies**, a core requirement of the course.
2.  **More Focused User Value (Simpler Goal)**: The application now solves the problem of "What can my room look like?" by focusing on users looking at uploaded pictures of their dorm size and getting inspiration for their own room. The complex logistical problem of real-time collaborative planning has been removed.
3.  **Simpler State Management**: The state for the current concepts is far simpler than the furniture position/dimension management required by the planning idea. This allowed me to concentrate entirely on mastering the essentials of backend implementation and the Deno/MongoDB testing workflow.


## Final Application Architecture

The application is built on four independent, modular concepts that work together to create the full user experience:

* **`UserAccount`**: The foundation of identity. It knows nothing about posts or comments; it only manages user profiles.
* **`RoomTemplate`**: Acts as a controlled "tagging" system. It provides a catalog of all MIT room types (e.g., "Baker House Single") but knows nothing about the posts that use these tags.
* **`DesignPost`**: The core content concept. It links a `User` and a `RoomTemplate` to a piece of content (an image and description) but is completely unaware of social interactions.
* **`Engagement`**: The social layer. This concept is responsible for all comments and upvotes related to a `DesignPost`, but it doesn't store any of the post's actual content.

This structure ensures the system is robust and easily extensible. For instance, adding a new feature (like "bookmarks") requires modifying only the `Engagement` concept, with no changes needed to any other part of the application.


## 💡 Interesting Moments in Development

Here are 5 key moments from the implementation process. Each represents a significant learning step or a problem-solving discovery.

> **How to Get Your Links:** For each moment below, find the corresponding log file in your `/context` folder (it will be named with the date and time you ran the command). Open it on GitHub and copy the URL. This gives you a permanent link to the exact state of your code and prompts at that moment.

1.  **Learning Deno's Permission Model Incrementally**
    * **Link**: `[Link to the context file where you first saw the --allow-env error]`
    * **Explanation**: When I first ran my tests, I was hit with a cascade of permission errors: first for `--allow-net`, then `--allow-env`, and finally `--allow-sys`. This was a perfect practical demonstration of Deno's "secure by default" philosophy and taught me to think explicitly about what resources my code needs to access.

2.  **Solving the `unknown` Type Error with a Type Guard**
    * **Link**: `[Link to the context file showing the 'e is of type unknown' error and the fix]`
    * **Explanation**: I encountered an error where I couldn't access `e.message` in a `try...catch` block. I learned that this is a TypeScript safety feature and the solution is to use a type guard (`if (e instanceof Error)`). This was a key lesson in writing robust, type-safe error-handling code.

3.  **The Missing `await` and Understanding Promises**
    * **Link**: `[Link to the context file showing the 'require-await' linter error]`
    * **Explanation**: The linter flagged my `getPost` function for being `async` but not using `await`. This forced me to realize I was returning the `Promise` itself, not the resolved value. Adding the `await` keyword solidified my understanding of how asynchronous database calls work.

4.  **Fixing a Subtle Optional Chaining Bug**
    * **Link**: `[Link to the context file for the failed Engagement test]`
    * **Explanation**: My `Engagement` tests were failing with a `TypeError` because I was trying to call `.some()` on an `upvotes` array that didn't exist yet for posts that only had comments. The fix was changing `engagement?.upvotes.some(...)` to `engagement?.upvotes?.some(...)`. This was a fantastic lesson in the importance of optional chaining (`?.`) for writing resilient code that handles missing data gracefully.

5.  **Setting Up a Professional Project with `deno.json`**
    * **Link**: `[Link to the context file showing the 'no-import-prefix' error]`
    * **Explanation**: The linter initially wouldn't let me use full URLs for my test library import. This pushed me to create a `deno.json` file. I learned how this file centralizes dependency management, making the project cleaner and much easier to maintain than having URLs scattered across different files.