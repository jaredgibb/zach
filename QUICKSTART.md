# Diversified Psychological Services - Quick Start

## 🚀 Getting Started

### 1. Clone the Repository
```bash
cd /workspaces/zach
npm install
```

### 2. Set Up Supabase
Follow the complete guide in `SUPABASE_SETUP.md`:
- Create a Supabase account
- Get project credentials  
- Run the database schema
- Create your first admin account

### 3. Configure Environment
Copy and update `.env.local`:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Start Development Server
```bash
npm run dev
```
Visit http://localhost:3000

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `PROJECT_STATUS.md` | Complete overview of what's built |
| `SUPABASE_SETUP.md` | Step-by-step Supabase configuration |
| `DEPLOYMENT_GUIDE.md` | Deploy to production (Vercel, AWS, Docker, etc.) |
| `supabase-setup.sql` | Database schema and initial data |

---

## 🌐 Public Pages

- **Home** → `/` 
  - Features therapist count and service showcase
  - Fetches live data from Supabase

- **About Us** → `/about`
  - Company mission and values

- **Services** → `/services`
  - Dynamic service listings with detail modals
  - Shows all active services from database

- **Therapists** → `/therapists`
  - Dynamic therapist profiles with clickable modals
  - Shows all active therapists from database

- **Contact** → `/contact`
  - Contact form with emergency resources

---

## 🔐 Admin Panel

- **Login** → `/admin/login`
  - Email/password authentication

- **Signup** → `/admin/signup`  
  - Create new admin account

- **Dashboard** → `/admin/dashboard`
  - Central hub for admin operations

- **Manage Therapists** → `/admin/therapists`
  - Add, edit, delete therapist profiles
  - Fields: name, credentials, title, bios, specialties, photo

- **Manage Services** → `/admin/services`
  - Add, edit, delete service listings
  - Fields: title, descriptions, features, photo

---

## ⚡ Key Features

✨ **Responsive Design** - Works on desktop, tablet, mobile  
🎨 **Modern Styling** - Tailwind CSS with primary teal theme  
🔐 **Secure Auth** - Supabase email/password authentication  
📊 **Database** - PostgreSQL with RLS security policies  
🚀 **Fast Loading** - Next.js optimizations built-in  
📱 **Mobile Friendly** - Full responsive experience  
♿ **Accessible** - WCAG compliant components  
🔄 **Live Updates** - Admin changes appear instantly on public site  

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home page
│   ├── services/page.tsx    # Services listing
│   ├── therapists/page.tsx  # Therapist profiles
│   ├── contact/page.tsx     # Contact form
│   ├── about/page.tsx       # About Us
│   └── admin/               # Admin panel
├── components/             # React components
│   ├── TherapistCard.tsx    # Therapist card with modal
│   ├── ServiceCard.tsx      # Service card with modal
│   ├── Modal.tsx            # Modal wrapper
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── admin/               # Admin components
├── lib/
│   ├── hooks/               # React hooks (useAuth, useDatabase)
│   ├── supabase/            # Supabase clients
│   └── data.ts              # Fallback static data
└── public/                  # Static assets
```

---

## 🔧 Common Tasks

### Add a New Therapist
1. Go to `/admin/login` and log in
2. Click "Manage Therapists"
3. Click "+ Add Therapist"
4. Fill in name, credentials, bio, etc.
5. Click "Add Therapist"
6. Instantly appears on public `/therapists` page

### Add a New Service
1. Go to `/admin/login` and log in
2. Click "Manage Services"
3. Click "+ Add Service"
4. Fill in title, description, features
5. Click "Add Service"
6. Instantly appears on public `/services` page

### Deactivate a Therapist
1. In admin panel, find therapist
2. Click "Edit"
3. Change "Status" to "Inactive"
4. Save changes
5. Therapist hidden from public site

### Edit Service Details
1. In admin panel, find service
2. Click "Edit"
3. Update any fields
4. Click "Save Changes"
5. Public site updates immediately

---

## 🚀 Deploy to Production

See `DEPLOYMENT_GUIDE.md` for full instructions.

**Quick Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```
Follow prompts and your site will be live in minutes.

---

## 🆘 Troubleshooting

### Site not loading?
- Check `.env.local` has Supabase credentials
- Verify Supabase project is active
- Run `npm install` again
- Restart dev server: `npm run dev`

### Admin login not working?
- Verify you created an account at `/admin/signup`
- Check Supabase Authentication has your user
- Try resetting password

### Not seeing database changes?
- Refresh the page (Ctrl+R or Cmd+R)
- Check browser DevTools for errors
- Verify Supabase RLS policies allow your operations

### Images not showing?
- Image upload feature coming soon
- Currently using placeholder graphics
- See IMAGE_UPLOAD.md when ready

---

## 📞 Support

- **Documentation**: See files in project root
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 📋 Checklist for Going Live

- [ ] Supabase project created and tested
- [ ] Database schema executed
- [ ] Admin accounts created
- [ ] All therapist profiles added
- [ ] All services properly described
- [ ] Contact form tested
- [ ] All pages reviewed on mobile
- [ ] Admin panel fully tested
- [ ] Environment variables configured
- [ ] Deployment platform selected
- [ ] DNS configured (if custom domain)
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Email notifications working
- [ ] Backup system enabled

---

**Status**: ✅ Ready for Supabase connection and deployment

Last Updated: 2024
