# GitHub Actions Workflows

This directory contains automated workflows for the subscription management app.

## deploy.yml

Automatically builds and deploys the application to GitHub Pages when code is pushed to the main branch.

### What it does:
1. **Build Job**:
   - Installs Node.js and dependencies
   - Runs the test suite
   - Builds the production application
   - Verifies the build integrity
   - Uploads the build artifacts

2. **Deploy Job** (only on main branch):
   - Deploys the built application to GitHub Pages
   - Uses official GitHub Pages actions for security and reliability

### Setup Requirements:
1. Enable GitHub Pages in repository settings (Settings → Pages → Source: "GitHub Actions")
2. Ensure the repository name matches the base path in `vite.config.ts` (currently set to `/payments/`)
3. Push to the main branch to trigger deployment

### Features:
- ✅ Runs tests before deployment to prevent broken builds
- ✅ Only deploys successful builds
- ✅ Proper permissions and security configuration
- ✅ Concurrent deployment protection
- ✅ Builds on PRs for testing (but doesn't deploy)

### Note:
GitHub Pages has limitations with custom HTTP headers required for SQLite WASM's full functionality. The app will work but may have reduced database capabilities. For full functionality, consider using Netlify or Vercel instead.