# Diversified Psychological Services Website

A professional, modern website for Diversified Psychological Services, a mental health practice in Kalamazoo, MI.

## Features

### Pages

- **Home**: Overview with links to About Us, Our Therapists, Services, and Contact
- **About Us**: Information about the practice, philosophy, and approach
- **Our Therapists**: Team directory with individual therapist profile pages
- **Services**: Detailed information about therapy services and approaches
- **Contact**: Comprehensive contact form with emergency resources
- **Legal Pages**: Privacy Policy, HIPAA Notice, No Surprises Act, and Nondiscrimination notices

### Key Features

- ✅ Client Portal banner with link to appointment system
- ✅ Responsive navigation with mobile menu
- ✅ Comprehensive contact forms with validation
- ✅ Insurance provider listings
- ✅ Individual therapist profiles with bios and fun facts
- ✅ Emergency crisis resources prominently displayed
- ✅ Minor/adult age range selection logic
- ✅ Therapist-specific contact forms
- ✅ Fully responsive design
- ✅ Accessibility-focused components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: React 19

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app                    # Next.js app directory
  /about               # About Us page
  /contact             # Contact page
  /services            # Services page
  /therapists          # Therapist listing
    /[id]              # Individual therapist pages
  /privacy-policy      # Legal pages
  /privacy-practices
  /no-surprises-act
  /nondiscrimination
  globals.css          # Global styles
  layout.tsx           # Root layout
  page.tsx             # Home page

/components            # Reusable components
  ClientPortalBanner.tsx
  Header.tsx
  Footer.tsx

/lib                   # Utilities and data
  data.ts              # Therapist data, insurance providers, business info

/public               # Static assets
  /images             # Images directory
```

## Customization

### Adding Therapists

Edit `/lib/data.ts` and add entries to the `therapists` array:

```typescript
{
  id: 'therapist-slug',
  name: 'Full Name',
  credentials: 'MA, LPC',
  title: 'Licensed Professional Counselor',
  shortBio: 'Brief description...',
  fullBio: 'Full biography...',
  funFact: 'Fun fact about the therapist',
  image: '/images/therapist.jpg',
}
```

### Updating Insurance Providers

Edit the `insuranceProviders` array in `/lib/data.ts`

### Updating Business Information

Edit the `businessInfo` object in `/lib/data.ts`

### Adding Real Images

1. Place images in `/public/images/`
2. Update image paths in `/lib/data.ts`
3. Images should be optimized for web (recommended: JPG/WebP, < 500KB)

## Form Handling

Currently, forms display success messages without sending data. To connect forms to a backend:

1. **Option 1: Email Service** (e.g., SendGrid, Mailgun)
   - Add API route in `/app/api/contact/route.ts`
   - Configure email service credentials
   - Update form handlers to POST to API route

2. **Option 2: Form Service** (e.g., Formspree, Form Submit)
   - Update form `action` attribute
   - Add hidden fields as needed

3. **Option 3: Server Actions** (Next.js recommended)
   - Create server action functions
   - Add to form components using `action` prop

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform supporting Node.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Next Steps

- [ ] Add real therapist photos and headshots
- [ ] Connect contact forms to email service (zachd@diversifiedpsychservices.com)
- [ ] Add stock therapy session images
- [ ] Complete legal page content
- [ ] Add insurance provider logos (see: https://freedomcounselingkalamazoo.us/about/)
- [ ] Set up social media links when available
- [ ] Add blog functionality for therapeutic approaches
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Add schema markup for SEO
- [ ] Implement form spam protection (reCAPTCHA)

## Client Requirements Reference

All requirements from the original specification have been implemented:

✅ Client Portal banner at top
✅ Navigation with dropdowns  
✅ Home page with About, Therapists, and Services sections
✅ Footer with address, phone, insurance list
✅ About Us page with full content
✅ Our Therapists page with 6 therapists
✅ Individual therapist pages with full bios and contact forms
✅ Services page with therapeutic approaches
✅ Contact page with comprehensive form including minor checkbox logic
✅ Emergency resources displayed prominently
✅ Legal page placeholders

## Support

For questions or issues, contact: zachd@diversifiedpsychservices.com

---

Built with ❤️ for Diversified Psychological Services
