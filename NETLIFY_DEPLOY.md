# Deploy to Netlify - Step by Step Guide

## Quick Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: New Year Wishes App"
   git branch -M main
   ```

2. **Push to GitHub**
   - Go to [GitHub](https://github.com) and create a new repository
   - Copy the repository URL
   - Run:
     ```bash
     git remote add origin <your-github-repo-url>
     git push -u origin main
     ```

3. **Deploy on Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Sign up or log in
   - Click **"Add new site"** → **"Import an existing project"**
   - Click **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub
   - Select your repository
   - Netlify will auto-detect Next.js settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click **"Deploy site"**

4. **Wait for Deployment**
   - Netlify will build and deploy your site
   - This usually takes 2-5 minutes
   - You'll get a URL like: `https://your-site-name.netlify.app`

5. **Set Environment Variables (Optional)**
   - Go to **Site settings** → **Environment variables**
   - Add if you want to customize:
     - `ADMIN_USERNAME` = `parvzari2002`
     - `ADMIN_PASSWORD` = `Parvej2026#`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   ```
   - Follow the prompts
   - Choose "Create & configure a new site"
   - Select your team
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Important Notes for Netlify

### ⚠️ Data Storage Limitation

**Current Implementation**: The app uses file system storage which is **read-only** on Netlify Functions.

**What Works:**
- ✅ Reading content (uses default content if file not available)
- ✅ Viewing wishes
- ✅ User forms and sessions

**What Doesn't Work:**
- ❌ Admin panel content creation/editing (writes won't persist)

**Solutions for Production:**

1. **Use a Database** (Recommended):
   - MongoDB Atlas (free tier available)
   - Supabase (free tier available)
   - Firebase Firestore

2. **Use Netlify Forms** for simple data collection

3. **Use a Headless CMS**:
   - Contentful
   - Strapi
   - Sanity

### Build Settings

Netlify will automatically detect:
- ✅ Framework: Next.js
- ✅ Build command: `npm run build`
- ✅ Publish directory: `.next`
- ✅ Node version: 18

All configured in `netlify.toml`

## After Deployment

1. **Test Your Site**
   - Visit your Netlify URL
   - Test the landing page
   - Test couple/friends forms
   - Test admin login (credentials: `parvzari2002` / `Parvej2026#`)

2. **Custom Domain (Optional)**
   - Go to **Site settings** → **Domain management**
   - Add your custom domain

3. **Enable HTTPS**
   - Automatically enabled by Netlify
   - Free SSL certificate

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Common issues:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Run `npm run build` locally first
   - Environment variables → Set in Netlify dashboard

### Site Not Working

1. Check function logs in Netlify dashboard
2. Verify API routes are working
3. Check browser console for errors

### Need Help?

- Netlify Docs: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/integrations/frameworks/next-js/

## Next Steps

After successful deployment:
1. ✅ Test all features
2. ✅ Add more content via admin panel (note: won't persist without database)
3. ✅ Share your site URL
4. ✅ Consider adding a database for persistent storage

