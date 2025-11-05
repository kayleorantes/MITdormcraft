# Deployment Guide for MITdormcraft

This guide explains how to deploy your frontend and backend together on Render.

## Backend Changes (Already Completed ✅)

The backend has been configured to serve frontend static files from the `./public` directory:

- **API routes** are available at `/api/*`
- **Static files** are served from `/public`
- **SPA fallback** serves `index.html` for client-side routing

## Frontend Deployment Instructions

### Step 1: Build Your Frontend

In your frontend repository, run:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This will create a `dist` folder (for Vite) or `build` folder (for Create React App) with your production-ready files.

### Step 2: Copy Frontend Build to Backend

Copy all files from your frontend build directory to the `public` directory in this repository:

```bash
# If using Vite (default output: dist/)
cp -r /path/to/your/frontend/dist/* ./public/

# If using Create React App (default output: build/)
cp -r /path/to/your/frontend/build/* ./public/
```

**Important:** Make sure to copy the contents of the build folder, not the folder itself. Your `public` directory should contain:
- `index.html`
- `assets/` folder with JS and CSS files
- Any other static assets

### Step 3: Verify Locally (Optional)

Before deploying, you can test locally:

```bash
deno task start
```

Then visit `http://localhost:8000` - you should see your frontend, and API calls to `/api/*` should work.

### Step 4: Commit and Push

```bash
git add public/
git commit -m "Add frontend build files"
git push
```

### Step 5: Deploy on Render

If Render auto-deploys from your repository, the changes will deploy automatically. Otherwise:

1. Go to your Render dashboard
2. Find your MITdormcraft service
3. Click "Manual Deploy" → "Deploy latest commit"

### Step 6: Verify Deployment

Visit `https://mit-dormcraft.onrender.com` - your frontend should now load correctly!

## Important Notes

### Frontend Environment Variables

Make sure your frontend is configured to use the correct API base URL:

- **Development:** `http://localhost:8000/api`
- **Production:** `https://mit-dormcraft.onrender.com/api`

Example configuration (for Vite):

```typescript
// config.ts or similar
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://mit-dormcraft.onrender.com/api'
  : 'http://localhost:8000/api';

export { API_BASE_URL };
```

### Updating Frontend

Whenever you make changes to your frontend:

1. Rebuild: `npm run build`
2. Copy to public: `cp -r dist/* ./public/`
3. Commit and push
4. Render will auto-deploy

### Troubleshooting

**Assets fail to load (404 errors):**
- Ensure your frontend build is in `./public` (not `./public/dist`)
- Check that `index.html` is at `./public/index.html`

**API calls fail with CORS errors:**
- The backend has CORS enabled for all origins (`*`)
- If you need to restrict this in production, update `REQUESTING_ALLOWED_DOMAIN` in `.env`

**Routes don't work (404 on page refresh):**
- This should be fixed by the SPA fallback route
- Ensure your frontend is using client-side routing (e.g., React Router in BrowserRouter mode)

## Render Configuration

Your Render service should be configured as:

- **Environment:** Deno
- **Build Command:** `deno task build`
- **Start Command:** `deno task start`
- **Port:** `8000` (or whatever `PORT` env variable is set to)

No additional static site service is needed - the backend serves everything!

