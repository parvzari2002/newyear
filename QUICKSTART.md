# Quick Start Guide

## First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Using the Application

### For Users

1. **Landing Page**: Choose between "For Couples" or "For Friends"
2. **Fill Form**: Complete the multi-step form with your information
3. **View Wishes**: Enjoy personalized New Year wishes with animations and effects

### For Admins

1. **Access Admin Panel**: Click "Admin Panel" link on the homepage
2. **Login**: 
   - Username: `parvzari2002`
   - Password: `Parvej2026#`
3. **Manage Content**: 
   - Add new content items (quotes, shayri, images, etc.)
   - Edit existing content
   - Enable/disable content
   - Delete content

## Content Placeholders

When creating content in the admin panel, you can use these placeholders:
- `{name1}` - First person's name
- `{name2}` - Second person's name
- `{relationship}` - Relationship duration
- `{memory}` - Favorite memory
- `{message}` - Personal message

Example:
```
Dear {name1} and {name2}, 
wishing you a wonderful New Year after {relationship} together!
```

## Customization

### Change Admin Credentials

1. Create a `.env.local` file in the root directory
2. Add:
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   ```

### Add Custom Content

1. Login to admin panel
2. Click "Add Content"
3. Fill in the form:
   - Select content type
   - Add title and content
   - Choose categories (couple/friends)
   - Add tags
   - Enable/disable

### Customize Colors

Edit `tailwind.config.js` to change color schemes and gradients.

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

- Add more content through the admin panel
- Customize the design in `app/globals.css`
- Add your own images/videos to the `public/` folder
- Deploy to Netlify (see DEPLOYMENT.md)

