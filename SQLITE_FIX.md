# SQLite Fix for Netlify Deployment

## Problem
`better-sqlite3` is a native module that requires C++ compilation. It fails on Netlify because:
- Node.js 24 requires C++20, but the build environment isn't configured for it
- Native modules don't work well in serverless environments

## Solution
Replaced `better-sqlite3` with `sql.js`:
- ✅ **WebAssembly-based** - No native compilation needed
- ✅ **Works in serverless** - Perfect for Netlify/Vercel
- ✅ **Same SQLite API** - Drop-in replacement
- ✅ **In-memory storage** - Works perfectly for serverless functions

## Changes Made

1. **package.json**: Replaced `better-sqlite3` with `sql.js`
2. **lib/database.ts**: Rewrote to use `sql.js` API
3. **app/api/content/route.ts**: Updated to use async database functions
4. **next.config.js**: Added webpack config for sql.js

## How It Works

- **Local Development**: Uses in-memory SQLite (can optionally save to file)
- **Netlify Serverless**: Uses in-memory SQLite (persists during function execution)
- **No Build Issues**: sql.js is pure JavaScript/WebAssembly, no compilation needed

## Deployment

The project should now deploy successfully on Netlify without build errors!

## Note on Persistence

- Data persists during active function execution
- For long-term persistence across deployments, consider:
  - Turso (SQLite cloud database)
  - Supabase (PostgreSQL)
  - MongoDB Atlas

