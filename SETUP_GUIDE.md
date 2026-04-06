# Solar Company Website - Setup Guide

## Overview
This is a comprehensive solar energy company website built with Next.js, React, TypeScript, and Firebase. It includes a public-facing website with bilingual support (English/Hindi) and a protected admin dashboard.

## Prerequisites
- Node.js 18+ installed
- Firebase project created
- Environment variables configured

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore Database (test mode for development)
   - Enable Cloud Storage
   - Set up Authentication (Email/Password)

2. **Get Firebase Configuration**
   - In Project Settings, find your Web App credentials
   - Copy the following to your `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

## Firestore Setup

Create the following Firestore collections:

### 1. `projects` Collection
```
{
  title: string,
  description: string,
  location: string,
  capacity: string,
  image: string,
  createdAt: timestamp
}
```

### 2. `brands` Collection
```
{
  name: string,
  logo: string,
  createdAt: timestamp
}
```

### 3. `contactMessages` Collection
```
{
  name: string,
  email: string,
  phone: string,
  message: string,
  read: boolean,
  createdAt: timestamp
}
```

### 4. `careerApplications` Collection
```
{
  name: string,
  email: string,
  phone: string,
  position: string,
  message: string,
  resumeUrl: string,
  createdAt: timestamp
}
```

## Project Structure

```
├── app/
│   ├── admin/                 # Protected admin dashboard
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── projects/         # Project management
│   │   ├── brands/           # Brand management
│   │   ├── messages/         # Contact messages
│   │   ├── careers/          # Career applications
│   │   └── content/          # Content editor
│   ├── projects/             # Projects listing page
│   ├── careers/              # Careers page
│   ├── api/                  # API routes
│   │   ├── contact/          # Contact form submission
│   │   └── careers/          # Career application submission
│   └── layout.tsx            # Root layout
├── components/
│   ├── sections/             # Homepage sections
│   ├── admin/                # Admin components
│   └── header.tsx            # Navigation header
├── lib/
│   ├── firebase.ts           # Firebase config
│   ├── firebase-service.ts   # Firebase operations
│   ├── language.ts           # Translation strings
│   ├── language-context.tsx  # Language provider
│   ├── types.ts              # TypeScript types
│   └── hooks.ts              # Custom hooks
└── public/                   # Static assets
```

## Key Features

### 1. Bilingual Support (English/Hindi)
- Language toggle in header
- Context-based language switching
- All content supports both languages

### 2. Homepage Sections
- Hero banner with CTA
- Services overview
- Recent installations showcase
- Brand partners
- Google reviews/testimonials
- About company
- Contact form

### 3. Additional Pages
- **Projects Page**: Detailed project showcase
- **Careers Page**: Job listings and application form
- **Admin Dashboard**: Protected area for managing content

### 4. Admin Features
- Project management (CRUD)
- Brand management
- Contact message viewer
- Career application viewer
- Bilingual content editor

## Styling

### Color Scheme
- **Primary**: Dark Blue (#0B3D91)
- **Secondary**: Solar Yellow (#FDB813)
- **Neutral**: White, Gray variations

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Sticky WhatsApp button for mobile engagement

## Development

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production
```bash
pnpm build
pnpm start
```

## API Routes

### Contact Form
- **POST** `/api/contact`
- Saves message to Firestore
- Triggers email notification (if configured)

### Career Application
- **POST** `/api/careers`
- Saves application with resume to Firestore
- Handles file upload to Cloud Storage

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables on Vercel
Add all `NEXT_PUBLIC_FIREBASE_*` variables in:
Settings → Environment Variables

## Security Notes

### Firestore Rules (Development)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Firestore Rules (Production)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /brands/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /contactMessages/{document=**} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
    match /careerApplications/{document=**} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Firebase Connection Issues
- Check environment variables are set correctly
- Ensure Firebase project is active
- Verify Firestore is initialized

### Data Not Saving
- Check Firestore rules allow writes
- Verify Firebase authentication is enabled
- Check browser console for errors

### WhatsApp Button
- Update `WHATSAPP_NUMBER` in `components/whatsapp-button.tsx`
- Format: `+[country_code][number]`

## Support
For issues or questions, refer to:
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
