# Quick Environment Variables Reference

## Setup (First Time)
```bash
cp .env.example .env
# Edit .env with your values
npm run dev
```

## Current Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Yes |

## Usage in Code

### Recommended (Typed)
```typescript
import { env } from './config/env';
const url = env.supabase.url;
const key = env.supabase.apiKey;
```

### Supabase Helper
```typescript
import { getSupabaseConfig } from './config/supabase';
const config = getSupabaseConfig();
```

### Direct Access
```typescript
const url = import.meta.env.VITE_SUPABASE_URL;
```

## Important Rules
1. ✅ Always prefix with `VITE_`
2. ✅ Restart dev server after changes
3. ❌ Never commit `.env` files
4. ✅ Update `.env.example` for team

## Files
- `.env` - Your local config (git ignored)
- `.env.example` - Template (committed)
- `src/config/env.ts` - Typed config
- `src/config/supabase.ts` - Supabase helpers

## Testing
```bash
npm run dev
# Visit: http://localhost:5173/test-env-vars.html
```

## Troubleshooting
- **Not loading?** → Restart dev server
- **TypeScript error?** → Check `src/vite-env.d.ts`
- **Undefined?** → Verify `VITE_` prefix

## Full Documentation
See `ENV_SETUP.md` for complete guide.
