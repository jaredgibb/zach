# Admin Panel - Feature Overview

## 🔐 Authentication

### Sign Up (`/admin/signup`)
- Email validation
- Password requirements (6+ characters)
- Password confirmation
- Auto-redirect to login after signup
- Email becomes your username for login

### Login (`/admin/login`)
- Email/password form
- Remember session across page reloads
- Auto-redirect to dashboard if already logged in
- Sign out option on dashboard

---

## 📊 Therapist Management

### List View (`/admin/therapists`)
**Table Columns:**
- Name (display name)
- Credentials (degrees, licenses)
- Title (e.g., LMSW, LMFT)
- Status (Active/Inactive toggle)
- Actions (Edit, Delete)

**Features:**
- Sort by name or order
- Search functionality (coming soon)
- Bulk operations (coming soon)
- Export data (coming soon)

### Add Therapist
1. Click "+ Add Therapist" button
2. Fill in all required fields:
   - **Name** - Full name (required)
   - **Credentials** - Degrees/licenses (required)
   - **Title** - Professional title (optional)
   - **Short Bio** - 2-line bio for card view (2 rows)
   - **Full Bio** - Detailed biography (6 rows)
   - **Fun Fact** - Personal trivia (optional)
   - **Specialties** - Comma-separated list (optional)
   - **Order Index** - Display order (1, 2, 3...)
   - **Status** - Active/Inactive
3. Click "Add Therapist"
4. Therapist appears instantly on public `/therapists` page

### Edit Therapist
1. Click "Edit" button next to therapist
2. Form opens with all current values
3. Update any fields
4. Click "Save Changes"
5. Changes reflected immediately on public site

### Delete Therapist
1. Click "Delete" button next to therapist
2. Confirm deletion dialog appears
3. Click "Confirm" to delete
4. Therapist marked as inactive (soft delete)
5. Still in database but hidden from public

---

## 📋 Service Management

### List View (`/admin/services`)
**Table Columns:**
- Title (service name)
- Slug (URL-friendly identifier)
- Status (Active/Inactive)
- Actions (Edit, Delete)

**Features:**
- Organized by order index
- Bulk deactivation (coming soon)
- Duplicate service (coming soon)
- Version history (coming soon)

### Add Service
1. Click "+ Add Service" button
2. Fill in all required fields:
   - **Title** - Service name (required)
   - **Slug** - URL identifier like "cbt-therapy" (required)
   - **Short Description** - Brief overview (2 rows)
   - **Full Description** - Detailed service info (6 rows)
   - **Features** - Line-separated list of benefits
     ```
     One-on-one personalized sessions
     Evidence-based therapeutic techniques
     Flexible scheduling options
     ```
   - **Order Index** - Display position
   - **Status** - Active/Inactive
3. Click "Add Service"
4. Service appears on public `/services` page

### Edit Service
1. Click "Edit" next to service
2. Update any fields
3. Modify features list as needed
4. Click "Save Changes"
5. Public site updates in real-time

### Delete Service
1. Click "Delete" next to service
2. Confirm deletion
3. Service becomes inactive (hidden from public)
4. Remains in database for future reference

---

## 💾 Data Format Reference

### Therapist Fields

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| Name | Text | ✅ | Sarah Johnson | Full professional name |
| Credentials | Text | ✅ | LMSW, MSW | Licenses and degrees |
| Title | Text | ❌ | Clinical Social Worker | Professional title |
| Short Bio | Text | ❌ | Sarah specializes in anxiety... | 2-3 sentence summary |
| Full Bio | Text | ❌ | Sarah has 10 years of experience... | Detailed biography |
| Fun Fact | Text | ❌ | Loves hiking and photography | Personal detail |
| Specialties | Array | ❌ | Anxiety,Depression,PTSD | Comma-separated list |
| Order Index | Number | ✅ | 1 | Sort order on public site |
| Status | Boolean | ✅ | Active | Visible on public site if Active |

### Service Fields

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| Title | Text | ✅ | Individual Therapy | Service name |
| Slug | Text | ✅ | individual-therapy | URL-friendly (no spaces) |
| Short Description | Text | ❌ | One-on-one professional support | Card preview |
| Full Description | Text | ❌ | In individual therapy sessions... | Full details |
| Features | Array | ❌ | Personalized care,Flexible hours | Line-separated |
| Order Index | Number | ✅ | 1 | Sort order on public site |
| Status | Boolean | ✅ | Active | Visible on public site if Active |

---

## 🎯 Common Admin Tasks

### Daily
- [ ] Check for new contact form submissions
- [ ] Respond to inquiries from interested clients
- [ ] Verify website is loading correctly

### Weekly
- [ ] Review therapist schedules
- [ ] Update any therapist availability
- [ ] Check for any feedback or bugs

### Monthly
- [ ] Add or update therapist profiles
- [ ] Review and refresh service descriptions
- [ ] Check website analytics
- [ ] Backup database

### Quarterly
- [ ] Update therapist photos
- [ ] Add new services offerings
- [ ] Review and improve content
- [ ] Check competitive landscape

---

## 🔐 Security Notes

### Best Practices
- ✅ Use strong admin passwords (12+ characters)
- ✅ Use unique email per admin account
- ✅ Never share admin credentials
- ✅ Log out when finished on shared computers
- ✅ Enable browser security settings

### Data Protection
- All admin data encrypted in transit (HTTPS)
- RLS policies prevent unauthorized database access
- Admin sessions expire after inactivity
- Passwords never stored in plain text

---

## 📲 Mobile Admin Access

The admin panel is fully responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets (iPad, Android tablets)
- ✅ Mobile phones (requires portrait mode for best experience)

**Recommended:** iPhone/Android phones for quick edits on the go

---

## 🖼️ Image Upload (Coming Soon)

The following features are planned:

### Therapist Photos
- Upload profile pictures
- Auto-resize to optimized dimensions
- Replace placeholder graphics
- Appear on therapist cards and profiles

### Service Images
- Upload service preview images
- Auto-compress for web
- Display on service cards
- Show in modal details

### Instructions When Ready
1. In therapist/service edit form
2. Click "Upload Image" button
3. Select file from computer
4. Preview and confirm
5. Image processed and saved automatically

---

## 🚨 Troubleshooting Admin Issues

### Can't Log In
✅ Solutions:
- Check email spelling
- Verify password (case-sensitive)
- Try sign up for new account
- Check browser cookies enabled
- Clear browser cache

### Edit Changes Not Saving
✅ Solutions:
- Check all required fields filled
- Look for error messages in red
- Check internet connection
- Refresh page and try again
- Try different browser

### Therapist Not Appearing on Public Site
✅ Solutions:
- Check Status is set to "Active"
- Verify Order Index has a number
- Check you clicked "Add Therapist" (not just filled form)
- Refresh public page
- Check browser cache

### Service Descriptions Displaying Wrong
✅ Solutions:
- Check for special characters that need escaping
- Verify line breaks preserved in full description
- Review featured list format
- Check slug doesn't have spaces (use hyphens)

---

## 📞 Support

### Technical Issues
- Check browser console for errors (F12)
- Verify Supabase is online
- Try different browser
- Contact hosting support

### Content Questions
- Refer to PROJECT_STATUS.md for field descriptions
- Review SUPABASE_SETUP.md for database info
- Check QUICKSTART.md for common tasks

---

## ✨ Tips & Tricks

**Pro Tip 1**: Use Order Index to arrange therapists
- Set to 1, 2, 3... to control display order

**Pro Tip 2**: Create therapist specialties checklist
- Anxiety, Depression, PTSD, OCD, etc.
- Consistent terminology helps clients find therapist

**Pro Tip 3**: Keep service descriptions concise
- Short Bio: 2-3 sentences
- Full Bio: 2-3 paragraphs max
- Features: 4-6 key points

**Pro Tip 4**: Test before publishing
- Log out and view public pages
- Verify changes appear correctly
- Check on mobile devices

**Pro Tip 5**: Plan content updates
- Batch updates for efficiency
- Update photos seasonally
- Refresh bios annually

---

**Admin Panel Status**: ✅ Fully Operational

Start managing content at: [http://localhost:3000/admin](http://localhost:3000/admin)
