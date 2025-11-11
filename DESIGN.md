# MITdormcraft - Design Document

## Project Overview
MITdormcraft is a web application that allows MIT students to share and discover dorm room design inspiration. Users can browse room templates by dorm and room type, view design posts with photos and descriptions, and engage with content through likes and comments.

## Final Design Summary

### Core Concepts

#### 1. **User Account** (`UserConcept`)
- **State**: Users with username, MIT Kerberos, bio, creation date
- **Actions**: `getUser`, `getUserByUsername`, `updateUserProfile`
- **Key Design Decision**: Separated from authentication for clear separation of concerns

#### 2. **Authentication** (`AuthenticationConcept`)
- **State**: Credentials linking users to hashed passwords via MIT Kerberos
- **Actions**: `registerAndCreateAccount`, `verifyCredentials`
- **Key Design Decision**: Handles both user creation and credential management in one atomic operation

#### 3. **Session** (`SessionConcept`)
- **State**: Active sessions with tokens, expiration times
- **Actions**: `createSession`, `validateSession`, `endSession`, `endAllUserSessions`
- **Key Design Decision**: Token-based sessions with 7-day expiration and automatic cleanup via MongoDB TTL indexes

#### 4. **Room Template** (`RoomTemplateConcept`)
- **State**: Templates with dorm name and room type
- **Actions**: `addTemplate`, `getTemplate`, `findTemplates`, `updateTemplate`, `deleteTemplate`
- **Purpose**: Provides structured categorization for design posts

#### 5. **Design Post** (`DesignPostConcept`)
- **State**: Posts with author, template reference, title, description, image URL, timestamp
- **Actions**: `createPost`, `getPost`, `findPostsByTemplate`, `findPostsByAuthor`, `editPost`, `deletePost`
- **Key Design Decision**: Posts are immutably linked to templates and authors; ownership checks enforce access control

#### 6. **Engagement** (`EngagementConcept`)
- **State**: Per-post upvotes (set of user IDs) and comments (with nested author, text, timestamp)
- **Actions**: `toggleUpvote`, `addComment`, `editComment`, `deleteComment`, `getEngagementForPost`
- **Key Design Decision**: Single document per post for efficient atomic operations

## Changes from Initial Design

### Major Architectural Changes

#### 1. **Authentication & Authorization via Requesting Concept**
**Initial Design**: Authentication was planned as a front-end concern with simple pass-through API calls.

**Final Design**: Implemented the **Requesting concept** pattern from Assignment 4c, which:
- Acts as a secure gateway between HTTP requests and concept actions
- Categorizes all actions as **included** (pass-through) or **excluded** (authenticated)
- Validates session tokens before routing excluded actions to concepts
- Provides centralized access control in the back end

**Rationale**: 
- Front-end authentication is inherently insecure (users can modify requests)
- Centralized authentication logic is easier to audit and maintain
- Aligns with the sync-based architecture taught in 6.1040

#### 2. **Syncs Implementation Strategy**
**Initial Design**: Planned to use declarative syncs for all cross-concept coordination.

**Final Design**: Adopted a **pragmatic hybrid approach**:
- Authentication guards implemented imperatively in the `RequestingConcept`
- Sync engine infrastructure in place but no declarative syncs defined
- Noted in `syncs.ts` that imperative approach provides equivalent security with clearer code

**Rationale**:
- The declarative sync system adds complexity for limited benefit in this project
- Imperative authentication in Requesting is more straightforward and easier to debug
- Maintains same security properties as declarative syncs
- Future extensibility: Can add declarative syncs for notifications or other features

### API Design Evolution

#### Included Actions (Public, No Authentication)
```
✅ Read-only browsing:
- RoomTemplate/getTemplate, findTemplates
- DesignPost/getPost, findPostsByTemplate, findPostsByAuthor
- Engagement/getEngagementForPost
- UserAccount/getUser, getUserByUsername

✅ Authentication operations:
- Authentication/registerAndCreateAccount, verifyCredentials
- Session/createSession, validateSession, endSession
```

#### Excluded Actions (Require Authentication)
```
🔒 Write operations requiring authentication:
- DesignPost/createPost, editPost, deletePost
- Engagement/toggleUpvote, addComment, editComment, deleteComment
- UserAccount/updateUserProfile
- RoomTemplate/addTemplate, updateTemplate, deleteTemplate
```

**Design Rationale**:
- **Included actions** allow anonymous browsing (critical for user acquisition)
- **Excluded actions** require session tokens passed as parameters
- Authentication/Session actions are included because they *establish* authentication
- Clear separation makes security model immediately obvious to developers

### Data Model Refinements

#### 1. **Atomic Registration**
**Change**: Combined user creation and credential storage into `registerAndCreateAccount`

**Rationale**: Prevents partial registration states where user exists but credentials don't (or vice versa)

#### 2. **Engagement as Single Document**
**Change**: One engagement document per post (not per user-post pair)

**Rationale**: 
- Efficient upvote toggling with MongoDB `$addToSet` and `$pull`
- Comments naturally grouped by post
- Single query to fetch all engagement for a post

#### 3. **ObjectId References**
**Change**: All cross-concept references use MongoDB ObjectIds as hex strings

**Rationale**: Type-safe foreign keys with efficient indexing

### Front-End Integration

#### Session Token Management
- Front end stores token in `localStorage` after login/registration
- Token passed as `{ token: "...", ...otherParams }` for authenticated requests
- Requesting concept validates token and extracts `userID` before calling concept actions

#### Error Handling
- 401 Unauthorized for missing/invalid tokens
- 500 errors for malformed requests or database issues
- Clear error messages help with debugging

## Technology Stack

### Back End
- **Runtime**: Deno 2.5.5 (modern, secure, TypeScript-native)
- **Framework**: Hono (lightweight, fast HTTP routing)
- **Database**: MongoDB (flexible schema, powerful query operators)
- **Language**: TypeScript (type safety, better IDE support)

### Deployment
- **Platform**: Render (automated deployments from GitHub)
- **Configuration**: Dockerfile with multi-stage build and caching
- **Environment**: `MONGODB_URI` for database connection

## Security Considerations

### Authentication Flow
1. User registers → receives session token
2. User stores token locally
3. Authenticated requests include token
4. Requesting concept validates token → extracts userID
5. Concept action executes with verified userID

### Ownership Enforcement
- Edit/delete operations check `authorID === userID` in MongoDB query
- MongoDB atomicity ensures race condition safety
- Failed ownership checks return `false`, not errors (cleaner UX)

### Session Expiration
- Sessions expire after 7 days
- MongoDB TTL index automatically deletes expired sessions
- Graceful handling of expired tokens (returns null from `validateSession`)

## Design Trade-offs

### 1. Imperative vs Declarative Syncs
**Trade-off**: Chose imperative authentication in Requesting over declarative syncs
- **Gain**: Simpler code, easier debugging, less boilerplate
- **Loss**: Less declarative intent, potential for scattered coordination logic
- **Conclusion**: For this project's scope, clarity trumps declarativeness

### 2. Token in Request Body vs Headers
**Trade-off**: Pass session token as body parameter instead of Authorization header
- **Gain**: Simpler front-end code, consistent parameter passing
- **Loss**: Non-standard HTTP practice
- **Conclusion**: Acceptable for educational project, would use headers in production

### 3. Single Engagement Document
**Trade-off**: One engagement doc per post (not per user-post)
- **Gain**: Efficient queries, atomic operations, simpler model
- **Loss**: Document grows unbounded with comments
- **Conclusion**: Acceptable for MIT's scale, would add pagination for large-scale app

## Future Enhancements

### Potential Improvements
1. **Image Upload**: Direct image uploads to cloud storage (currently requires external URLs)
2. **Notifications**: Declarative syncs for notifying users of comments/likes
3. **Search**: Full-text search on post titles and descriptions
4. **Admin Roles**: Separate admin concept for template management
5. **Rate Limiting**: Prevent spam on comment/post creation

### Scalability Considerations
- Add comment pagination for posts with many comments
- Implement caching layer (Redis) for frequently accessed templates
- Add database indexes on frequently queried fields
- Consider sharding strategy for user and post collections

## Conclusion

The final design successfully balances security, simplicity, and functionality. The Requesting concept provides robust authentication while maintaining clean concept boundaries. The hybrid sync approach (imperative guards + sync infrastructure) offers flexibility for future enhancements without sacrificing current clarity.

The app demonstrates key 6.1040 principles:
- **Concept independence**: Each concept is self-contained with clear state and actions
- **Synchronization**: Authentication coordinated across concepts via Requesting
- **Data integrity**: Ownership checks and atomic operations ensure consistency
- **Security**: Back-end authentication prevents client-side tampering

