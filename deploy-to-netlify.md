# 🚀 Deploy to Netlify - Complete Guide

## Prerequisites Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] Git installed
- [ ] GitHub account
- [ ] Netlify account (sign up at https://netlify.com)

## Step-by-Step Deployment

### Step 1: Initialize Git Repository

Open your terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: New Year Wishes App"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon → **"New repository"**
3. Name your repository (e.g., `newyear-wishes`)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (you already have files)
6. Click **"Create repository"**

### Step 3: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### Step 4: Deploy to Netlify

1. **Go to Netlify**
   - Visit https://app.netlify.com
   - Sign up or log in (you can use GitHub to sign in)

2. **Import Your Project**
   - Click **"Add new site"** → **"Import an existing project"**
   - Click **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub account
   - Select your repository (`newyear-wishes` or whatever you named it)

3. **Configure Build Settings**
   Netlify should auto-detect Next.js, but verify:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

4. **Deploy**
   - Click **"Deploy site"**
   - Wait 2-5 minutes for the build to complete
   - You'll see a URL like: `https://random-name-123.netlify.app`

### Step 5: Set Environment Variables (Optional)

If you want to customize admin credentials:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add variable"**
3. Add:
   - Key: `ADMIN_USERNAME`, Value: `parvzari2002`
   - Key: `ADMIN_PASSWORD`, Value: `Parvej2026#`
4. Click **"Save"**
5. Go to **Deploys** → **Trigger deploy** → **Deploy site** (to apply changes)

### Step 6: Test Your Deployment

1. Visit your Netlify URL
2. Test the landing page
3. Test couple/friends forms
4. Test admin login at `/admin`

## ✅ Data Storage with SQLite

**Current Status**: The app now uses **SQLite** for data storage!

**How It Works:**
- **Local Development**: Uses file-based SQLite database (`data/content.db`) - data persists
- **Netlify Serverless**: Uses in-memory SQLite database - data persists during function execution

**What Works:**
- ✅ Landing page
- ✅ Forms (couple/friends)
- ✅ Display pages with content
- ✅ Admin login
- ✅ Admin content creation/editing (works!)
- ✅ Content updates and deletion

**Note on Netlify:**
- In-memory database works for admin operations
- Data persists during active function execution
- For long-term persistence, consider a cloud database (see SQLITE_SETUP.md)

**For Production with Full Persistence:**
- Use Turso (SQLite-compatible cloud database) - Free tier available
- Or Supabase/MongoDB Atlas for full database features

## Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

## Updating Your Site

After making changes:

```bash
git add .
git commit -m "Update description"
git push
```

Netlify will automatically rebuild and deploy your site!

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Make sure all dependencies are in `package.json`
- Run `npm run build` locally first to catch errors

### Site Shows 404
- Check that `netlify.toml` is correct
- Verify Next.js plugin is installed (auto-installed)

### Admin Panel Not Working
- Check environment variables are set correctly
- Verify API routes are accessible

## Need Help?

- Netlify Support: https://www.netlify.com/support/
- Next.js Docs: https://nextjs.org/docs
- Check build logs in Netlify dashboard for specific errors

---

**Your site will be live at:** `https://your-site-name.netlify.app` 🎉

