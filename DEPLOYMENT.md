# Deployment Guide

## Deploying to Netlify

### Prerequisites
1. A GitHub account
2. A Netlify account (sign up at [netlify.com](https://netlify.com))

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select your repository
   - Netlify will auto-detect Next.js settings
   - Click "Deploy site"

3. **Environment Variables (Optional)**
   - Go to Site settings → Environment variables
   - Add `ADMIN_USERNAME` and `ADMIN_PASSWORD` if you want to customize admin credentials

### Important Notes

- **Data Storage**: The current implementation uses file system storage (`data/content.json`). For production, consider using:
  - A database (PostgreSQL, MongoDB)
  - A cloud storage service (AWS S3, Cloudinary)
  - A headless CMS (Contentful, Strapi)
  
- **File System Limitations**: Netlify Functions are serverless and have read-only file system access. For production, you'll need to use a database or external storage.

- **Build Settings**: Netlify will automatically detect Next.js and use the correct build settings from `netlify.toml`.

## Alternative: Deploy to Vercel

Vercel is the recommended platform for Next.js applications:

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Production Build

```bash
npm run build
npm start
```

