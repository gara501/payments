# Production Deployment Guide

This guide covers deploying the subscription management app with SQLite WASM support.

## Build Process

The app uses SQLite WASM for client-side database functionality. The build process has been configured to:

1. **Copy SQLite WASM files** to the public directory during build
2. **Set proper headers** for SharedArrayBuffer support
3. **Optimize bundle size** while preserving WASM functionality
4. **Target modern browsers** that support WASM and SharedArrayBuffer

## Building for Production

```bash
# Build the application
npm run build

# Verify the build
npm run verify-production

# Preview locally (optional)
npm run preview
```

## Deployment Requirements

### Required HTTP Headers

Your web server **MUST** set these headers for SQLite WASM to work:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

### Static File Hosting

The following files must be served correctly:

- `dist/sqlite3.wasm` - SQLite WebAssembly module
- `dist/sqlite3-worker1.js` - SQLite worker script
- `dist/sqlite3-worker1-promiser.js` - Promise-based worker
- `dist/sqlite3-opfs-async-proxy.js` - OPFS async proxy
- All files in `dist/assets/` - Application bundles

## Platform-Specific Configuration

### GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to the main branch.

#### Setup Instructions:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Configure base path** (already configured in `vite.config.ts`):
   - The app is configured to use `/payments/` as the base path for GitHub Pages
   - Update the base path in `vite.config.ts` if your repository name is different

3. **Push to main branch** - the workflow will automatically:
   - Install dependencies
   - Run tests
   - Build the application
   - Verify the production build
   - Deploy to GitHub Pages

#### Workflow Features:
- ✅ Runs tests before deployment
- ✅ Verifies production build integrity
- ✅ Only deploys on main branch pushes (not PRs)
- ✅ Uses official GitHub Pages actions
- ✅ Proper permissions and concurrency handling

**Important Note**: GitHub Pages doesn't support custom headers by default, which are required for SQLite WASM's SharedArrayBuffer functionality. The app will still work but may have limited database features. For full functionality, consider using Netlify or Vercel instead.

### Netlify

Create `netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
```

### Vercel

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy", 
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

### Apache (.htaccess)

```apache
# Enable required headers for SQLite WASM
Header always set Cross-Origin-Embedder-Policy "require-corp"
Header always set Cross-Origin-Opener-Policy "same-origin"

# Ensure WASM files are served with correct MIME type
AddType application/wasm .wasm
```

### Nginx

```nginx
location / {
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    
    # Serve WASM files with correct MIME type
    location ~* \.wasm$ {
        add_header Content-Type "application/wasm";
    }
}
```

## Browser Compatibility

The app requires browsers that support:

- **WebAssembly** (all modern browsers)
- **SharedArrayBuffer** (Chrome 68+, Firefox 79+, Safari 15.2+)
- **ES2020** features

Unsupported browsers will show an error message.

## Troubleshooting

### Common Issues

1. **"SharedArrayBuffer is not defined"**
   - Missing required HTTP headers
   - Check browser compatibility

2. **"Failed to load WASM module"**
   - WASM files not copied correctly
   - Check MIME type configuration

3. **Database initialization fails**
   - Network issues loading WASM files
   - CORS policy blocking resources

### Debugging

1. Run the verification script:
   ```bash
   npm run verify-production
   ```

2. Check browser console for errors

3. Verify headers in browser dev tools (Network tab)

4. Test locally with `npm run preview`

## Performance Notes

- SQLite WASM bundle is ~850KB (gzipped ~400KB)
- Database runs entirely in browser memory
- No server-side database required
- Data persists in browser's IndexedDB/OPFS when available

## Security Considerations

- All data is stored client-side
- No sensitive data should be stored in the database
- Consider encryption for sensitive information
- Regular backups recommended (export/import functionality)