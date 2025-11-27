# Production Deployment Guide

This guide covers deploying the subscription management app with Supabase backend.

## Build Process

The app uses Supabase for cloud-based PostgreSQL database functionality. The build process has been configured to:

1. **Embed Supabase credentials** from environment variables during build
2. **Optimize bundle size** for production
3. **Target modern browsers** (ES2020+)

## Building for Production

```bash
# Set environment variables (or use .env file)
export VITE_SUPABASE_URL=your_supabase_project_url
export VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Build the application
npm run build

# Preview locally (optional)
npm run preview
```

## Deployment Requirements

### Environment Variables

Your deployment platform must have access to these environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

**Important**: These variables are embedded in the JavaScript bundle at build time, so they must be available during the build process, not just at runtime.

### Static File Hosting

The following files must be served correctly:

- `dist/index.html` - Main HTML file
- `dist/assets/` - Application bundles (JavaScript and CSS)

## Platform-Specific Configuration

### GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to the main branch.

#### Setup Instructions:

1. **Add Supabase secrets** to your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add `VITE_SUPABASE_URL` with your Supabase project URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anonymous key

2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

3. **Configure base path** (already configured in `vite.config.ts`):
   - The app is configured to use `/payments/` as the base path for GitHub Pages
   - Update the base path in `vite.config.ts` if your repository name is different

4. **Push to main branch** - the workflow will automatically:
   - Install dependencies
   - Run tests with Supabase credentials
   - Build the application with Supabase credentials
   - Deploy to GitHub Pages

#### Workflow Features:
- ✅ Runs tests before deployment
- ✅ Embeds Supabase credentials during build
- ✅ Only deploys on main branch pushes (not PRs)
- ✅ Uses official GitHub Pages actions
- ✅ Proper permissions and concurrency handling

### Netlify

1. **Add environment variables** in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

2. **Create `netlify.toml`** (optional):

```toml
[build]
  publish = "dist"
  command = "npm run build"
```

### Vercel

1. **Add environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

2. **Create `vercel.json`** (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Cloudflare Pages

1. **Add environment variables** in Cloudflare dashboard:
   - Go to Settings → Environment variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

2. **Configure build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`

## Browser Compatibility

The app requires browsers that support:

- **ES2020** features (all modern browsers)
- **Fetch API** for Supabase communication
- **Modern JavaScript** (async/await, modules, etc.)

Supported browsers:
- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## Troubleshooting

### Common Issues

1. **"Database connection verification failed"**
   - Check that Supabase credentials are correct
   - Verify that environment variables are set during build
   - Check Supabase project status

2. **"Failed to fetch subscriptions"**
   - Check network connectivity
   - Verify Supabase Row Level Security (RLS) policies
   - Check browser console for CORS errors

3. **Build fails with missing environment variables**
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - For GitHub Actions, verify secrets are configured
   - For local builds, check `.env` file exists

### Debugging

1. Check environment variables are embedded:
   ```bash
   # After build, search for your Supabase URL in the bundle
   grep -r "supabase.co" dist/
   ```

2. Check browser console for errors

3. Verify Supabase connection in browser dev tools (Network tab)

4. Test locally with `npm run preview`

## Performance Notes

- Application bundle is ~850KB (gzipped ~250KB)
- Database queries are made over HTTPS to Supabase
- Data is cached in browser for offline support
- Supabase provides automatic connection pooling and optimization

## Security Considerations

- **Supabase Anonymous Key**: The `VITE_SUPABASE_ANON_KEY` is safe to expose in client-side code
- **Row Level Security (RLS)**: Ensure RLS policies are properly configured in Supabase
- **API Keys**: Never commit `.env` files to version control
- **Data Protection**: All data is stored in Supabase's secure PostgreSQL database
- **HTTPS**: Always use HTTPS in production for secure communication