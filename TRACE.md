# Action Trace from Demo Video

This file should contain the console output from your backend server during the demo video recording.

## How to Populate This File

1. Start your backend server locally or check Render logs
2. Perform your user journey (registration, login, create post, like, comment, etc.)
3. Copy the entire console output showing:
   - Initial route registration (included vs excluded)
   - Individual action traces with `[INCLUDED]` or `[EXCLUDED]` markers
   - Authentication validations
4. Paste the output below, replacing this placeholder text

## Expected Trace Format

Your trace should look similar to this example:

```
Scanning for concepts in 'src/concepts'...
  -> Found concept: Requesting
✅ Generated production barrel file: src/concepts/concepts.ts

Registering routes...

✅ INCLUDED ROUTES (passed through directly):
  - RoomTemplate/getTemplate
  - RoomTemplate/findTemplates
  - DesignPost/getPost
  - DesignPost/findPostsByTemplate
  - DesignPost/findPostsByAuthor
  - Engagement/getEngagementForPost
  - UserAccount/getUser
  - UserAccount/getUserByUsername
  - Authentication/registerAndCreateAccount
  - Authentication/verifyCredentials
  - Session/createSession
  - Session/validateSession
  - Session/endSession

🔒 EXCLUDED ROUTES (require syncs):
  - DesignPost/createPost
  - DesignPost/editPost
  - DesignPost/deletePost
  - Engagement/toggleUpvote
  - Engagement/addComment
  - Engagement/editComment
  - Engagement/deleteComment
  - UserAccount/updateUserProfile
  - RoomTemplate/addTemplate
  - RoomTemplate/updateTemplate
  - RoomTemplate/deleteTemplate

🚀 Server listening on http://localhost:8000

--- Demo Video User Journey Begins ---

[INCLUDED] RoomTemplate/findTemplates -> RoomTemplate.findTemplates
[INCLUDED] DesignPost/findPostsByTemplate -> DesignPost.findPostsByTemplate
[INCLUDED] Authentication/registerAndCreateAccount -> Authentication.registerAndCreateAccount
[INCLUDED] Session/createSession -> Session.createSession
[EXCLUDED] DesignPost/createPost -> Requesting.request
  -> Token validated for user: 507f1f77bcf86cd799439011
  -> Routing to: DesignPost.createPost
[INCLUDED] DesignPost/findPostsByTemplate -> DesignPost.findPostsByTemplate
[EXCLUDED] Engagement/toggleUpvote -> Requesting.request
  -> Token validated for user: 507f1f77bcf86cd799439011
  -> Routing to: Engagement.toggleUpvote
[INCLUDED] Engagement/getEngagementForPost -> Engagement.getEngagementForPost
[EXCLUDED] Engagement/addComment -> Requesting.request
  -> Token validated for user: 507f1f77bcf86cd799439011
  -> Routing to: Engagement.addComment

--- Demo Video User Journey Complete ---
```

## Instructions

**Replace this entire file content with your actual trace output before submission.**

To collect the trace:
- **Local**: Run `deno task start` and copy terminal output
- **Render**: Go to Render dashboard > Logs tab and copy output

See [VIDEO_INSTRUCTIONS.md](VIDEO_INSTRUCTIONS.md) for detailed instructions.

