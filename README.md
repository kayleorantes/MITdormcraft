# MITdormcraft

An inspiration and sharing platform for MIT dorm room decoration - "Instagram for MIT dorms."

## Project Structure

This is the backend repository built with Deno, MongoDB, and a concept-oriented architecture.

- **Backend Framework:** Deno with Hono web framework
- **Database:** MongoDB
- **Architecture:** Concept-oriented design with independent, modular concepts
- **Frontend:** Served from `./public` directory (see [DEPLOYMENT.md](./DEPLOYMENT.md))

## Concepts

The application is built on five independent concepts:

- **`User`** - User profiles and account management
- **`Authentication`** - Secure credential management and sessions
- **`RoomTemplate`** - MIT room types and categories
- **`DesignPost`** - User-submitted room design photos and descriptions
- **`Engagement`** - Likes, comments, and social interaction

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) 2.5.5 or later
- MongoDB instance (local or cloud)

### Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
REQUESTING_BASE_URL=/api
REQUESTING_ALLOWED_DOMAIN=*
```

### Installation

1. Clone the repository
2. Install dependencies: `deno install`
3. Build the project: `deno task build`

### Running Locally

```bash
# Start the server
deno task start

# Or run the concept server (alternative)
deno task concepts
```

The server will start at `http://localhost:8000`

- **API:** `http://localhost:8000/api/*`
- **Frontend:** `http://localhost:8000/`

### Running Tests

```bash
# Test individual concepts
deno test src/concepts/user.test.ts
deno test src/concepts/authentication.test.ts
deno test src/concepts/room-template.test.ts
deno test src/concepts/design-post.test.ts
deno test src/concepts/engagement.test.ts
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render with your frontend.

## API Documentation

API endpoints are automatically generated for each concept:

- **User:** `/api/User/*`
- **Authentication:** `/api/Authentication/*`
- **RoomTemplate:** `/api/RoomTemplate/*`
- **DesignPost:** `/api/DesignPost/*`
- **Engagement:** `/api/Engagement/*`

Each concept exposes its methods as REST endpoints. For detailed API specifications, see the design docs in `./design/concepts/`.

## Project Documentation

- `./design/` - Concept specifications and design documents
- `./design/concepts/` - Individual concept specifications
- `./design/background/` - Architecture and implementation guides
- `./src/application-reflection.md` - Design decisions and development reflection

## Docker

Build and run with Docker:

```bash
docker build -t mitdormcraft .
docker run -p 8000:8000 --env-file .env mitdormcraft
```

## License

MIT License - see LICENSE file for details.

## Contributing

This project was developed as part of MIT's 6.1040 Software Studio course.
