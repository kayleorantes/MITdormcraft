# Deployment Guide for MITdormcraft

## Current Deployment Status

### Production URL
- **Deployed App**: https://mit-dormcraft.onrender.com (verify this URL is correct)
- **Platform**: Render
- **Database**: MongoDB Atlas

## Deployment Configuration

### Render Setup

1. **Service Type**: Web Service
2. **Runtime**: Docker
3. **Build Command**: Automatically handled by Dockerfile
4. **Start Command**: `deno task start` (defined in Dockerfile CMD)

### Required Environment Variables

Set these in Render Dashboard → Environment:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mitdormcraft?retryWrites=true&w=majority
PORT=8000
```

**Note**: Render may override PORT automatically. The app uses `Deno.args` to accept port via `--port` flag.

### Dockerfile Configuration

The included `Dockerfile`:
- Uses Deno 2.5.5 official image
- Runs as non-root `deno` user
- Exposes port 10000 (can be overridden)
- Runs build step to generate concepts.ts
- Caches dependencies for faster startup
- Uses `deno task start` command

## Deployment Steps

### First-Time Deployment

1. **Create Render Account**: https://render.com
2. **Connect GitHub**: Link your repository
3. **Create Web Service**:
   - Select your repository
   - Name: `mitdormcraft-backend`
   - Environment: Docker
   - Instance Type: Free (or paid for better performance)
4. **Set Environment Variables**:
   - Add `MONGODB_URI` with your MongoDB Atlas connection string
5. **Deploy**: Render will automatically build and deploy

### Updating Deployment

Render auto-deploys on every push to main branch:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Render automatically rebuilds and deploys
```

### Manual Deployment

In Render Dashboard:
1. Go to your service
2. Click "Manual Deploy"
3. Select branch (usually `main`)
4. Click "Deploy"

## Verifying Deployment

### Check Server Status

```bash
# Test if server is responding
curl https://mit-dormcraft.onrender.com/

# Expected output: "Concept Server with Syncs is running."
```

### Check Routes

```bash
# Test public route (no auth required)
curl -X POST https://mit-dormcraft.onrender.com/api/RoomTemplate/findTemplates \
  -H "Content-Type: application/json" \
  -d '{}'

# Should return array of room templates
```

### Check Logs

In Render Dashboard:
1. Select your service
2. Click "Logs" tab
3. Look for:
   - `✅ INCLUDED ROUTES (passed through directly):`
   - `🔒 EXCLUDED ROUTES (require syncs):`
   - `🚀 Server listening on http://localhost:8000`

## Common Issues

### Issue: Server crashes with "Connection failed"
**Cause**: `MONGODB_URI` not set or invalid
**Solution**: Check environment variable in Render dashboard

### Issue: Routes return 404
**Cause**: Build step didn't generate concepts.ts correctly
**Solution**: Check build logs; ensure all concept files are present

### Issue: CORS errors from frontend
**Cause**: Frontend URL not whitelisted
**Solution**: Check CORS settings in `RequestingConcept.ts` (currently allows all origins for development)

### Issue: "Module not found" errors
**Cause**: Import paths incorrect or dependencies not cached
**Solution**: Run `deno cache src/main.ts` in build step

## Frontend Integration

### Update Frontend Environment Variables

In your frontend repository, set:

```bash
# .env.production
VITE_API_BASE_URL=https://mit-dormcraft.onrender.com
```

Then rebuild and redeploy frontend:

```bash
npm run build
# Deploy to your frontend hosting (Vercel, Netlify, etc.)
```

## Monitoring

### Health Check Endpoint

The root endpoint `/` serves as a health check:

```bash
curl https://mit-dormcraft.onrender.com/
```

Should return: `"Concept Server with Syncs is running."`

### Render Metrics

Available in Render Dashboard:
- CPU usage
- Memory usage
- Response times
- Error rates
- Logs

## Database Connection

### MongoDB Atlas Setup

1. **Create Cluster**: Free tier available
2. **Create Database User**:
   - Username: e.g., `mitdormcraft`
   - Password: Generate secure password
3. **Whitelist IP**:
   - Add `0.0.0.0/0` to allow all IPs (required for Render)
   - Alternatively, find Render's IP ranges and whitelist those
4. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy MongoDB URI
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `mitdormcraft` or your database name

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

## Performance Optimization

### For Production

Consider these upgrades:
- **Paid Render Instance**: Faster CPU, no sleep on inactivity
- **MongoDB Atlas M10+**: Better performance than free tier
- **Redis Caching**: Add Redis for frequently accessed data
- **CDN**: Use CDN for static assets (if serving any)

### Cold Starts

Free Render instances sleep after inactivity:
- First request after sleep takes ~30 seconds
- Solution: Use paid instance ($7/month) or ping endpoint every 10 minutes

## Rollback

If deployment fails:

1. Go to Render Dashboard
2. Click your service
3. Go to "Events" tab
4. Find previous successful deployment
5. Click "Rollback to this version"

## Next Steps

- [ ] Verify deployed URL is accessible
- [ ] Test all API endpoints in production
- [ ] Update frontend to use production backend URL
- [ ] Test full user journey (registration, login, create post, etc.)
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)

## Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Deno Deploy**: https://deno.com/deploy (alternative platform)

---

**Last Updated**: November 2025  
**Assignment**: 6.1040 Assignment 4c

