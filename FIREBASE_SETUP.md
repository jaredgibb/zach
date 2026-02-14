# Firebase Setup Guide

## Quick Start

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `diversified-psychological-services`
4. Accept defaults and create

### 2. Get Firebase Configuration
1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Scroll to **Your apps** section
3. Click **Web** to create a web app (or select existing)
4. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 3. Update .env.local

Replace placeholders in `/workspaces/zach/.env.local`:

```enviroment
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Enable Authentication
1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Click **Email/Password** provider
4. Toggle **Enable**
5. Click **Save**

### 5. Create Firestore Database
1. Go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Select **Start in production mode**
4. Choose location (us-central1 is default)
5. Click **Create**

### 6. Create Collections

#### therapists Collection
1. In Firestore, click **+ Create collection**
2. Collection ID: `therapists`
3. Click **Next**
4. Add first document (auto-ID):

```json
{
  "id": "therapist_1",
  "name": "Dr. Jane Doe",
  "credentials": "Ph.D. in Psychology",
  "title": "Licensed Clinical Psychologist",
  "short_bio": "Expert in anxiety and depression",
  "full_bio": "Dr. Jane Doe is a licensed clinical psychologist with 10+ years of experience...",
  "fun_fact": "I love hiking and photography",
  "specialties": ["anxiety", "depression", "trauma"],
  "image_url": "https://...",
  "slug": "dr-jane-doe",
  "order_index": 0,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

5. Click **Save**

#### services Collection
1. Click **+ Create collection**
2. Collection ID: `services`
3. Click **Next**
4. Add first document (auto-ID):

```json
{
  "id": "service_1",
  "title": "Individual Therapy",
  "slug": "individual-therapy",
  "short_description": "One-on-one therapy sessions",
  "full_description": "Our individual therapy sessions are tailored to your specific needs...",
  "image_url": "https://...",
  "features": ["Personalized treatment", "Flexible scheduling", "Online & in-person"],
  "order_index": 0,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

5. Click **Save**

### 7. Enable Cloud Storage (Optional)
1. Go to **Storage** (left sidebar)
2. Click **Get started**
3. Accept rules and create

### 8. Test the Application
1. Run development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/admin/signup`
3. Create a test account
4. Should redirect to `/admin/dashboard`
5. Test CRUD operations at `/admin/therapists` and `/admin/services`

## Firestore Security Rules

### Basic Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Rules (Secure)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public therapists and services
    match /therapists/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /services/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Deny access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Authentication Security Rules

### Email/Password Configuration
1. Go to **Authentication** → **Providers**
2. Click **Email/Password**
3. Configure:
   - ✅ Enable Email/Password signin
   - ✅ Enable Email link (optional)
   - ⚠️ No email verification needed for first login
   - ⚠️ Password policy: Minimum 6 characters

## Troubleshooting

### "Firebase config is missing"
- Verify all environment variables are in `.env.local`
- Restart development server:
  ```bash
  npm run dev
  ```

### "User creation failed"
- Check Authentication is enabled in Firebase Console
- Verify Email/Password provider is turned on

### "Cannot read from Firestore"
- Verify Firestore Database is created
- Check Security Rules allow reads
- Verify collections exist: `therapists`, `services`

### "CORS Error"
- This is normal for development
- Firebase handles CORS automatically
- No additional configuration needed

## Useful Firebase Console Links

- [Authentication](https://console.firebase.google.com/project/_/authentication)
- [Firestore Database](https://console.firebase.google.com/project/_/firestore)
- [Cloud Storage](https://console.firebase.google.com/project/_/storage)
- [Project Settings](https://console.firebase.google.com/project/_/settings/general)
- [Pricing & Plans](https://console.firebase.google.com/project/_/settings/billing)

## Cost Considerations

### Firebase Free Tier Includes
- 50,000 reads/day
- 20,000 writes/day  
- 20,000 deletes/day
- 1 GB storage
- 5 GB downloads/month

### When You'll Need to Upgrade
- Website exceeding free tier limits
- More than ~5-10 active daily users editing content
- Large file downloads

### Estimated Costs (if over free tier)
- Firestore: ~$0.06 per 100K read operations
- Storage: ~$0.18 per GB/month
- Bandwidth: ~$0.12 per GB egress

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Quick Start](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firebase Console Help](https://firebase.google.com/support)

---

**Status**: Ready for Firebase Setup  
**Next Step**: Create Firebase Project and configure
