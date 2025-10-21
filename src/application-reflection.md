# Overall Design Notes: MIT DormCraft Backend

This document outlines the final design of the MITdormcraft application, the rationale for pivoting from the original concept, and a summary of key moments during the backend development process.


## Application Design Pivot: From Planning to Inspiration

The project's initial concept for Assignment 2 was "DormCraft," a tool for students to collaboratively plan and lay out dorm rooms. I have pivoted the application's focus to Inspiration and Sharing—an "Instagram for MIT dorms"—while keeping the MITdormcraft name.

This pivot was a critical design decision made to better align with the course's principles:

1.  **Clearer Modularity:** The new "inspiration feed" model lends itself perfectly to concept-oriented design. The ideas of a `User`, `Authentication`, `DesignPost`, `RoomTemplate`, and `Engagement` are all distinct and self-contained. This made it much easier to design concepts with no direct dependencies.
2.  **Simpler, More Robust State:** The original layout tool would have required managing complex state. The new model's state is far simpler (e.g., a post has an `authorID` and an `imageURL`), which allowed me to focus on mastering the essentials of the backend implementation and testing workflow.

As a result, all five concepts (`User`, `Authentication`, `RoomTemplate`, `DesignPost`, `Engagement`) are brand new for this assignment.


## Interesting Moments in Development

Here are 5 key moments from my implementation process, reflecting on design challenges and the learning process.

**1. Realizing the Need for a New `Authentication` Concept**
* **Link:** `[Link to the context of the final authentication.md spec](context/src/concepts/authentication.ts/20251019_035931.5f7d6dd4.md)` `[Link to the context of the final user.md spec](context/src/concepts/user.ts/20251019_035930.bb5289b4.md)`
* **Explanation:** My initial design just had a `User` concept that handled everything. As I started implementing, I realized I was mixing public profile data (`username`, `bio`) with highly sensitive data (passwords). The "interesting moment" was the design breakthrough of splitting this into two separate concepts: `User` for the profile and `Authentication` for the credentials. This was a major step in understanding true modularity and security. I am grateful for TAs pointing out the need!

**2. Learning Deno's Strict Test Environment**
* **Link:** `[Link to the context/ snapshot of the user.test.ts file that fixed the "Leaks Detected" error](context/src/concepts/user.test.ts/20251019_035851.109de15a.md)`
* **Explanation:** My first complete test file passed all steps but still failed with a "Leaks Detected" error. I learned this was because Deno's test sanitizer is very strict and requires all async operations, like database connections, to be started and stopped inside the test block. This taught me to write much cleaner, self-contained tests.

**3. Debugging Deno-Specific `npm` Package Failures**
* **Explanation:** A major hurdle was getting `npm` packages to work with Deno. My `Authentication` concept was completely blocked by a native build error from `bcrypt`. This forced me to learn how to debug Deno's `npm` compatibility layer and find an alternative package (`bcryptjs`). This moment was less about code and more about understanding the Deno toolchain itself.

**4. Using Tests to Enforce Security Invariants**
* **Link:** `[Link to the context/ snapshot of the engagement.test.ts file, showing the security test]`
* **Explanation:** While writing the tests for the `Engagement` concept, I had to create a scenario to test `deleteComment`. This forced me to ask myself who should have the power to delete a post. I realized I needed to pass the `userID` to the action and check it against the comment's `authorID`. The test itself drove the design of this critical security feature.

**5. Refining Prompts for the `ctx` Tool**
* **Explanation:** Early on, my prompts to the `ctx` tool were too simple. After getting code that didn't fit the modularity rules, I learned to write much better prompts. By including `@` links to the background docs and my other specs, I could "teach" the LLM the rules of my project, which resulted in far better and more accurate code generation.