# MITdormcraft Backend

Backend API server for MITdormcraft - an MIT dorm room design inspiration platform where MIT students can share and discover dorm room design ideas.

## 📚 Assignment 4c Documentation

### Core Documents
- **[Design Document](DESIGN.md)** - Complete design overview, concept specifications, and changes from initial design
- **[Reflection Document](REFLECTION.md)** - Reflection on project experience, skills acquired, and LLM usage
- **[Deployment Guide](DEPLOYMENT.md)** - Detailed deployment instructions for Render and MongoDB Atlas
- **[Quick Start Guide](QUICK_START.md)** - Getting started with local development

### Deliverables
- **Demo Video**: [https://youtu.be/JkfNtzqBwAM](https://youtu.be/JkfNtzqBwAM)
- **Action Trace**: [TRACE.md](TRACE.md)
- **Deployed App**: https://mit-dormcraft.onrender.com

## 🏗️ Architecture Overview

### Concept-Oriented Design
This project implements six core concepts:

1. **User Account** - User profiles with MIT Kerberos integration
2. **Authentication** - Secure credential management with password hashing
3. **Session** - Token-based authentication with automatic expiration
4. **Room Template** - Categorization by dorm name and room type
5. **Design Post** - User-submitted designs with images and descriptions
6. **Engagement** - Likes and comments on posts

### Synchronization & Security
- **Requesting Concept**: Acts as secure gateway between HTTP requests and concepts
- **Included Actions**: Public read-only operations (browsing, viewing)
- **Excluded Actions**: Authenticated write operations (creating, editing, deleting)
- **Authentication**: Session tokens validated by Requesting concept before routing to concept actions

See [DESIGN.md](DESIGN.md) for detailed architecture documentation.

## 🚀 Deployment

### Production
- **Platform**: Render
- **URL**: https://mit-dormcraft.onrender.com
- **Database**: MongoDB Atlas  
- **Container**: Docker with Deno 2.5.5

### Environment Variables
Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 8000)

## 🛠️ Local Development

### Prerequisites
- Deno 2.5.5 or later
- MongoDB instance (local or Atlas)

### Setup
```bash
# Clone the repository
git clone [your-repo-url]
cd MITdormcraft

# Set environment variables
export MONGODB_URI="your-mongodb-connection-string"

# Generate concept imports
deno task build

# Start the server
deno task start
```

The server will start on `http://localhost:8000`

### Testing Routes
```bash
# Check server is running
curl http://localhost:8000/

# Browse templates (included action - no auth required)
curl -X POST http://localhost:8000/api/RoomTemplate/findTemplates \
  -H "Content-Type: application/json" \
  -d '{}'

# Create post (excluded action - requires auth token)
curl -X POST http://localhost:8000/api/DesignPost/createPost \
  -H "Content-Type: application/json" \
  -d '{"token":"your-session-token","templateID":"...","title":"...","description":"...","imageURL":"..."}'
```

## 📡 API Endpoints

### Included Routes (Public)
```
✅ Read-only operations (no authentication required):
  - POST /api/RoomTemplate/getTemplate
  - POST /api/RoomTemplate/findTemplates
  - POST /api/DesignPost/getPost
  - POST /api/DesignPost/findPostsByTemplate
  - POST /api/DesignPost/findPostsByAuthor
  - POST /api/Engagement/getEngagementForPost
  - POST /api/UserAccount/getUser
  - POST /api/UserAccount/getUserByUsername

✅ Authentication operations:
  - POST /api/Authentication/registerAndCreateAccount
  - POST /api/Authentication/verifyCredentials
  - POST /api/Session/createSession
  - POST /api/Session/validateSession
  - POST /api/Session/endSession
```

### Excluded Routes (Require Authentication)
```
🔒 Write operations (session token required):
  - POST /api/DesignPost/createPost
  - POST /api/DesignPost/editPost
  - POST /api/DesignPost/deletePost
  - POST /api/Engagement/toggleUpvote
  - POST /api/Engagement/addComment
  - POST /api/Engagement/editComment
  - POST /api/Engagement/deleteComment
  - POST /api/UserAccount/updateUserProfile
  - POST /api/RoomTemplate/addTemplate
  - POST /api/RoomTemplate/updateTemplate
  - POST /api/RoomTemplate/deleteTemplate
```

### Authentication Flow
1. Register: `POST /api/Authentication/registerAndCreateAccount`
   - Body: `{ username, mitKerberos, bio, credential_data }`
   - Returns: `userID`
2. Create Session: `POST /api/Session/createSession`
   - Body: `{ userID }`
   - Returns: `token`
3. Use Token: Include `token` in body of all excluded action requests
   - Example: `{ token: "abc123...", postID: "..." }`

## 🧪 Development Commands

```bash
# Generate concept imports (run after modifying concepts)
deno task build
# or
deno task import

# Start server (uses main.ts with sync engine)
deno task start

# Start server (alternative command)
deno task concepts
```

## 📁 Project Structure

```
MITdormcraft/
├── DESIGN.md                    # Design documentation
├── REFLECTION.md                # Project reflection
├── DEPLOYMENT.md                # Deployment guide
├── TRACE.md                     # Action trace
├── README.md                    # This file
├── Dockerfile                   # Container configuration
├── deno.json                    # Deno configuration and tasks
├── src/
│   ├── main.ts                  # Entry point with sync engine
│   ├── concept_server.ts        # (deprecated - old direct routing)
│   ├── concepts/
│   │   ├── concepts.ts          # Auto-generated concept barrel
│   │   ├── authentication.ts    # Authentication concept
│   │   ├── session.ts           # Session concept
│   │   ├── user-account.ts      # User concept
│   │   ├── room-template.ts     # RoomTemplate concept
│   │   ├── design-post.ts       # DesignPost concept
│   │   ├── engagement.ts        # Engagement concept
│   │   └── Requesting/
│   │       └── RequestingConcept.ts  # Authentication gateway
│   ├── syncs/
│   │   ├── syncs.ts             # Sync registration
│   │   ├── auth.sync.ts         # Auth sync notes
│   │   └── engagement.sync.ts   # Engagement sync notes
│   ├── engine/                  # Sync engine infrastructure
│   │   ├── mod.ts
│   │   ├── sync.ts
│   │   ├── actions.ts
│   │   └── ...
│   └── utils/
│       ├── database.ts          # MongoDB connection
│       └── generate_imports.ts  # Concept import generator
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds for secure credential storage
- **Session Tokens**: Cryptographically secure random tokens (64 hex characters)
- **Token Expiration**: Sessions expire after 7 days with automatic cleanup
- **Ownership Checks**: Edit/delete operations verify user owns the resource
- **Backend Authentication**: All security checks in backend (not bypassable by client)

## 🎓 6.1040 Concepts Demonstrated

- ✅ **Concept Independence**: Each concept has clear state and actions
- ✅ **Synchronization**: Requesting concept coordinates authentication across concepts
- ✅ **Back-End Syncs**: Security enforced server-side, not client-side
- ✅ **Data Integrity**: Atomic operations and ownership checks
- ✅ **Deployment**: Production-ready containerized deployment

## 📝 Notes

- **Current Implementation**: Uses imperative authentication in RequestingConcept instead of declarative syncs (see [DESIGN.md](DESIGN.md) for rationale)
- **Sync Engine**: Infrastructure in place for future declarative syncs (e.g., notifications)
- **Database**: MongoDB with TypeScript for type-safe concept implementations
- **Frontend**: Separate repository
