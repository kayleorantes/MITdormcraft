# Engagement Test Output

> deno test --allow-net --allow-env --allow-sys --env src/concepts/engagement.test.ts

Check file:///Users/korantes/MITdormcraft/src/concepts/engagement.test.ts
running 1 test from ./src/concepts/engagement.test.ts
Engagement Concept Tests ...
  Operational Principle 1: Upvote Lifecycle (toggleUpvote) ...
------- output -------

--- Testing Upvote Lifecycle ---
TOGGLE_UPVOTE SUCCESS: User 1 upvoted. Total: 1.
TOGGLE_UPVOTE SUCCESS: User 2 upvoted. Total: 2.
TOGGLE_UPVOTE SUCCESS: User 1 removed upvote. Total: 1.
----- output end -----
  Operational Principle 1: Upvote Lifecycle (toggleUpvote) ... ok (158ms)
  Operational Principle 2: Comment Lifecycle (add, edit, delete) ...
------- output -------

--- Testing Comment Lifecycle (as Owner) ---
ADD_COMMENT SUCCESS: User 1 added a comment.
EDIT_COMMENT SUCCESS: User 1 edited their comment.
DELETE_COMMENT SUCCESS: User 1 deleted their comment.
----- output end -----
  Operational Principle 2: Comment Lifecycle (add, edit, delete) ... ok (110ms)
  Interesting Scenario: `getEngagementForPost` (Empty & Full) ...
------- output -------

--- Testing `getEngagementForPost` ---
GET_ENGAGEMENT SUCCESS: Returned empty object for new post.
GET_ENGAGEMENT SUCCESS: Correctly returned 1 upvote and 0 comments.
----- output end -----
  Interesting Scenario: `getEngagementForPost` (Empty & Full) ... ok (46ms)
  Interesting Scenario (Security): User CANNOT edit another's comment ...
------- output -------

--- Testing Security: Edit (Fail) ---
EDIT_COMMENT FAIL (Expected): User 2 correctly blocked from editing User 1's comment.
----- output end -----
  Interesting Scenario (Security): User CANNOT edit another's comment ... ok (67ms)
  Interesting Scenario (Security): User CANNOT delete another's comment ...
------- output -------

--- Testing Security: Delete (Fail) ---
DELETE_COMMENT FAIL (Expected): User 2 correctly blocked from deleting User 1's comment.
----- output end -----
  Interesting Scenario (Security): User CANNOT delete another's comment ... ok (63ms)
Engagement Concept Tests ... ok (1s)

ok | 1 passed (5 steps) | 0 failed (1s)