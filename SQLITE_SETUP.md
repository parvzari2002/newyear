# SQLite Database Setup

## Overview

The application now uses **SQLite** for persistent data storage. The implementation is designed to work in both local development and serverless environments (Netlify).

## How It Works

### Local Development
- Uses a **file-based SQLite database** at `data/content.db`
- Data persists between server restarts
- Full read/write capabilities

### Serverless (Netlify)
- Automatically falls back to **in-memory SQLite database**
- Data persists during the function execution
- Note: In-memory data resets between function invocations

## Installation

After pulling the latest code, install dependencies:

```bash
npm install
```

This will install `better-sqlite3` which is the SQLite library used.

## Database Structure

The `content` table stores all wish content items:

```sql
CREATE TABLE content (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  imageUrl TEXT,
  videoUrl TEXT,
  category TEXT NOT NULL,  -- JSON array
  tags TEXT NOT NULL,       -- JSON array
  enabled INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL
)
```

## Usage

The database is automatically initialized when the API routes are accessed. Default content is loaded if the database is empty.

### API Endpoints

All content operations now use SQLite:

- `GET /api/content` - Fetch all content
- `POST /api/content` - Create new content
- `PUT /api/content` - Update existing content
- `DELETE /api/content` - Delete content

## For Production/Netlify

### Current Behavior

On Netlify, the database uses **in-memory storage** which means:
- ✅ Content can be created, updated, and deleted
- ✅ Changes persist during the function execution
- ⚠️ Data resets when the function instance is recycled (typically after inactivity)

### For Persistent Storage on Netlify

To have truly persistent storage on Netlify, consider:

1. **Use a Cloud Database** (Recommended):
   - **Turso** (SQLite-compatible cloud database) - Free tier available
   - **Supabase** (PostgreSQL) - Free tier available
   - **MongoDB Atlas** - Free tier available
   - **PlanetScale** (MySQL) - Free tier available

2. **Use Netlify's Built-in Storage**:
   - Netlify Blobs (key-value storage)
   - Netlify Forms (for simple data)

3. **External File Storage**:
   - Store database file in S3/Cloudinary
   - Download on function start, upload on changes

## Migration from JSON

If you had existing JSON data, it will be automatically migrated to SQLite on first API call. The default content from `lib/data.ts` is used to initialize the database.

## Troubleshooting

### Build Errors on Netlify

If you encounter build errors related to `better-sqlite3`:

1. Ensure Node.js version is 18+ (configured in `netlify.toml`)
2. The in-memory database should work even if native modules fail
3. Check Netlify build logs for specific errors

### Database Not Persisting

- **Local**: Check that `data/content.db` file exists and has write permissions
- **Netlify**: This is expected - use a cloud database for persistence

### Reset Database

To reset the database:

1. Delete `data/content.db` (local only)
2. Restart the server
3. Database will be recreated with default content

## Next Steps

For production deployment with persistent storage, consider integrating:
- Turso (easiest SQLite cloud option)
- Supabase (full-featured database)
- Or another cloud database service

See `DEPLOYMENT.md` for deployment instructions.

