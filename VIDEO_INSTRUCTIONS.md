# Video and Trace Instructions for Assignment 4c

## Making Your Demo Video

### Requirements
- **Length**: Up to 3 minutes
- **Content**: Show key features with audio narration
- **User Journey**: Demonstrate at least one complete, intelligible user journey
- **Format**: Any standard video format (MP4, MOV, etc.)

### Suggested User Journey

#### Journey 1: New User Registration and Post Creation
1. **Start on homepage** (narrate: "Welcome to MITdormcraft, an MIT dorm design inspiration platform")
2. **Browse templates** without logging in (narrate: "Users can browse room templates by dorm and type")
3. **View existing posts** for a template (narrate: "Each template has design posts from students")
4. **Click register** (narrate: "To create posts, users need to register with MIT Kerberos")
5. **Fill registration form** with username, Kerberos, password, bio
6. **Login** with credentials (narrate: "After registration, users receive a session token")
7. **Create a new post** with template, title, description, image URL
8. **View your post** in the feed (narrate: "Posts appear immediately in the template's feed")
9. **Like the post** from another user's perspective (if possible, or narrate the feature)
10. **Add a comment** to the post (narrate: "Users can engage with likes and comments")

#### Journey 2: Browsing and Engagement
1. **Show homepage with templates**
2. **Filter by dorm** (e.g., "New Vassar")
3. **Click a template** to see posts
4. **Scroll through posts** and show details
5. **Click on a user profile** to see their posts
6. **Like multiple posts**
7. **Comment on a post**
8. **Edit your own comment**
9. **Show how only post owners can edit/delete**

### Recording Tips
- **Screen recording tools**: 
  - Mac: QuickTime Player (File > New Screen Recording) or Cmd+Shift+5
  - Windows: Xbox Game Bar (Win+G) or OBS Studio
  - Cross-platform: OBS Studio, Loom, Zoom
- **Audio narration**: Use your computer's built-in mic or headset
- **Preparation**: 
  - Write a script or bullet points beforehand
  - Practice the flow once before recording
  - Have test data ready (don't create it during recording)
- **Editing**: Trim mistakes or long pauses; keep it concise

### Narration Script Template

```
[0:00-0:15] Introduction
"Hi, I'm [name], and this is MITdormcraft, a platform where MIT students share and discover 
dorm room design inspiration."

[0:15-0:45] Browsing Features
"Users can browse room templates by dorm and room type. Here I'm filtering for New Vassar 
double rooms. Each template shows design posts from students with photos and descriptions."

[0:45-1:30] Registration and Authentication
"To create posts, users register with their MIT Kerberos. The backend uses a secure 
authentication system with session tokens. After logging in, users can create posts..."

[1:30-2:30] Creating and Engaging
"I'm creating a new post with a title, description, and image URL. The post immediately 
appears in the feed. Other users can like posts and add comments. Notice that I can only 
edit or delete my own posts—this is enforced by the backend's authentication system."

[2:30-3:00] Conclusion
"The app demonstrates concept-oriented design with five core concepts: User, Authentication, 
Session, RoomTemplate, DesignPost, and Engagement. The Requesting concept ensures all write 
operations are authenticated. Thanks for watching!"
```

## Collecting the Action Trace

### What Is the Action Trace?
The backend console logs every incoming HTTP request, showing whether it's **included** (passed through) or **excluded** (authenticated). This trace demonstrates that your synchronization and authentication system is working.

### How to Collect the Trace

#### Option 1: From Render Dashboard (Deployed App)
1. Go to your Render dashboard: https://dashboard.render.com
2. Select your MITdormcraft backend service
3. Click on the **"Logs"** tab
4. Perform your user journey (registration, login, create post, like, comment, etc.)
5. Watch the logs appear in real-time
6. **Copy the entire log output** from the Render console
7. Paste into a file named `TRACE.txt` or `TRACE.md` in your repo

#### Option 2: From Local Development
1. Open terminal and navigate to your project directory
2. Start the backend server:
   ```bash
   cd /Users/korantes/MITdormcraft
   deno task start
   ```
3. You should see output like:
   ```
   ✅ INCLUDED ROUTES (passed through directly):
     - RoomTemplate/getTemplate
     - RoomTemplate/findTemplates
     ...
   
   🔒 EXCLUDED ROUTES (require syncs):
     - DesignPost/createPost
     - DesignPost/editPost
     ...
   
   🚀 Server listening on http://localhost:8000
   ```
4. In another terminal or browser, perform your user journey
5. Watch the backend terminal for output like:
   ```
   [INCLUDED] RoomTemplate/findTemplates -> RoomTemplate.findTemplates
   [INCLUDED] DesignPost/findPostsByTemplate -> DesignPost.findPostsByTemplate
   [EXCLUDED] DesignPost/createPost -> Requesting.request
   [EXCLUDED] Engagement/toggleUpvote -> Requesting.request
   ```
6. **Copy the entire terminal output** after your user journey
7. Save to `TRACE.txt` or `TRACE.md`

### What Should the Trace Show?

Your trace should demonstrate:
- ✅ **Included routes** being called directly (browsing, viewing posts)
- ✅ **Excluded routes** going through Requesting.request (creating posts, liking, commenting)
- ✅ Session creation during login/registration
- ✅ Authentication checks for protected actions
- ✅ A complete user journey from start to finish

### Example Trace Output

```
Registering routes...

✅ INCLUDED ROUTES (passed through directly):
  - RoomTemplate/getTemplate
  - RoomTemplate/findTemplates
  - DesignPost/getPost
  - DesignPost/findPostsByTemplate
  - UserAccount/getUser
  - Authentication/registerAndCreateAccount
  - Session/createSession

🔒 EXCLUDED ROUTES (require syncs):
  - DesignPost/createPost
  - DesignPost/editPost
  - Engagement/toggleUpvote
  - Engagement/addComment
  - UserAccount/updateUserProfile

🚀 Server listening on http://localhost:8000

--- User Journey Begins ---

[INCLUDED] RoomTemplate/findTemplates -> RoomTemplate.findTemplates
[INCLUDED] Authentication/registerAndCreateAccount -> Authentication.registerAndCreateAccount
[INCLUDED] Session/createSession -> Session.createSession
[INCLUDED] DesignPost/findPostsByTemplate -> DesignPost.findPostsByTemplate
[EXCLUDED] DesignPost/createPost -> Requesting.request
  -> Authenticated user: 507f1f77bcf86cd799439011
  -> Calling DesignPost.createPost
[EXCLUDED] Engagement/toggleUpvote -> Requesting.request
  -> Authenticated user: 507f1f77bcf86cd799439011
  -> Calling Engagement.toggleUpvote
[EXCLUDED] Engagement/addComment -> Requesting.request
  -> Authenticated user: 507f1f77bcf86cd799439011
  -> Calling Engagement.addComment

--- User Journey Complete ---
```

## Uploading Your Video

### Recommended Platforms
1. **YouTube** (unlisted): Upload to YouTube and mark as "Unlisted" (not private, not public)
2. **Google Drive**: Upload video, set sharing to "Anyone with the link"
3. **Dropbox**: Upload and create shareable link
4. **MIT Box**: Upload to MIT's Box storage (MIT credentials required)

### Getting the Link
- Make sure the link is **publicly accessible** (or at least accessible to course staff)
- Test the link in an incognito/private browser window to confirm access
- Add the link to your README (see below)

## Final Checklist

Before submission, ensure you have:
- [ ] **Video** (up to 3 minutes, showing user journey with narration)
- [ ] **Trace** (console output from backend during video demo, saved as `TRACE.txt` or `TRACE.md`)
- [ ] **Video link** (publicly accessible, added to README)
- [ ] **Design document** (`DESIGN.md` with 1-2 pages summarizing design)
- [ ] **Reflection document** (`REFLECTION.md` with 0.5-1 page reflecting on experience)
- [ ] **Updated README** (linking to all documents and deployed app)
- [ ] **Commit hashes** (front-end and back-end repo commits for submission)
- [ ] **Deployed app URL** (accessible at public URL)

## Need Help?

If you encounter issues:
- **Video won't record**: Try a different tool (OBS Studio is free and cross-platform)
- **Trace not showing**: Check that you're running `deno task start` (not the old `concept_server.ts`)
- **Deployed app not working**: Check Render logs for errors; verify `MONGODB_URI` environment variable is set
- **Video too long**: Focus on one clear user journey; trim pauses and mistakes

Good luck! 🚀

