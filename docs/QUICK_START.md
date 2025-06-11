# Admin Panel Quick Start Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env` file in root directory:
```env
VITE_SUPABASE_URL=https://qojlgridoruusocgwsdw.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Create Admin User
1. Open browser to `http://localhost:5173/admin/setup`
2. Follow the instructions to create admin user via Supabase Dashboard:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user"
   - Email: `admin@batikkenanga.com`
   - Password: `admin123`
   - **Important**: Check "Auto Confirm User"

### 5. Access Admin Panel
- Go to `http://localhost:5173/admin/login`
- Login with the credentials you created
- Start managing your content!

## 📋 Admin Panel Features

### Dashboard
- Overview statistics
- Quick action buttons
- Recent activity feed

### Content Management
- **Products**: Full product catalog management
- **Categories**: Product categorization
- **News**: Blog/news article management
- **Testimonials**: Customer review management

### User Management
- Create admin users
- Role assignment (Super Admin, Admin, Editor, Moderator)
- User status management

### Media Library
- File upload and management
- Image optimization
- Organized storage

### Settings
- System configuration
- Email settings
- Security preferences
- API management

### Company Info
- Company profile management
- Contact information
- Brand assets

## 🛠️ Technical Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI Library**: Tailwind CSS + Radix UI
- **State Management**: React Context
- **Routing**: React Router
- **Icons**: Lucide React

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔐 Security Features

- Secure authentication with Supabase Auth
- Role-based access control
- Protected routes
- Input validation and sanitization
- File upload security

## 📚 Documentation

For detailed documentation, see `docs/ADMIN_PANEL.md`

## 🆘 Troubleshooting

### Common Issues

**1. Login Error: "Email not confirmed"**
- Solution: Make sure to check "Auto Confirm User" when creating user in Supabase Dashboard

**2. Database Connection Error**
- Check environment variables
- Verify Supabase URL and keys

**3. File Upload Issues**
- Check Supabase storage bucket permissions
- Verify file size limits

**4. Missing UI Components**
- Run `npm install` to ensure all dependencies are installed
- Check for any import errors in console

### Getting Help

If you encounter issues:
1. Check browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase project is properly configured
4. Check network connectivity

---

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Ready to manage your Batik Kenanga content! 🎨
