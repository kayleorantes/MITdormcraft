# Design Post Test Output


> deno test --allow-net --allow-env --allow-sys --env src/concepts/design-post.test.ts


Check file:///Users/korantes/MITdormcraft/src/concepts/design-post.test.ts
running 1 test from ./src/concepts/design-post.test.ts
DesignPost Concept Tests ...
  Operational Principle: Create, Get, Edit, and Delete Post ...
------- output -------

--- Testing Full Post Lifecycle (as Owner) ---
CREATE_POST SUCCESS: Created post 68f4963c909a25e7c95ba15e
GET_POST SUCCESS: Fetched post "My Dorm"
EDIT_POST SUCCESS: Post was edited by owner
DELETE_POST SUCCESS: Post was deleted by owner
----- output end -----
  Operational Principle: Create, Get, Edit, and Delete Post ... ok (133ms)
  Variant Tests: `findPostsBy...` Actions ...
------- output -------

--- Testing Find Actions ---
Setup: Created 3 new posts for querying
FIND_BY_TEMPLATE SUCCESS: Found 2 posts for template 68f4963c909a25e7c95ba15c
FIND_BY_AUTHOR SUCCESS: Found 2 posts for author 68f4963c909a25e7c95ba15a
FIND_BY_TEMPLATE SUCCESS (Empty): Correctly returned 0 posts
----- output end -----
  Variant Tests: `findPostsBy...` Actions ... ok (131ms)
  Interesting Scenarios (Security): Unauthorized Actions ...
------- output -------

--- Testing Security: Unauthorized Edit/Delete ---
Setup: Created post 68f4963c909a25e7c95ba163 by author 1
EDIT_POST FAIL (Expected): Prevented unauthorized edit
DELETE_POST FAIL (Expected): Prevented unauthorized delete
----- output end -----
  Interesting Scenarios (Security): Unauthorized Actions ... ok (93ms)
DesignPost Concept Tests ... ok (885ms)

ok | 1 passed (3 steps) | 0 failed (891ms)