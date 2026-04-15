# Firebase Setup Guide for MG Solar Admin Panel

## Prerequisites
1. Google Cloud Console access
2. Firebase project created
3. Firestore API enabled (from previous step)

## Step 1: Deploy Security Rules

### Firestore Rules
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your "mgsolar" project
3. Go to Firestore Database → Rules
4. Replace the existing rules with the content from `firestore.rules` file
5. **Important**: Update the admin email addresses in the rules:
   ```javascript
   request.auth.token.email in [
     'your-admin-email@example.com', // Replace with actual admin email
     'another-admin@example.com'     // Add more admin emails as needed
   ]
   ```
6. Click "Publish"

### Storage Rules
1. In Firebase Console, go to Storage → Rules
2. Replace the existing rules with the content from `storage.rules` file
3. Update admin email addresses same as above
4. Click "Publish"

## Step 2: Environment Variables

Make sure your `.env.local` file has the correct Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mgsolar-934cc.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mgsolar-934cc
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mgsolar-934cc.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 3: Authentication Setup

### Enable Authentication Methods
1. In Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password" for employee login
3. Optionally enable Google sign-in for admin access

### Create Admin User
1. Go to Authentication → Users
2. Add your admin email
3. Set a secure password

## Step 4: Initialize Collections (Optional)

If you need to pre-populate data, you can use the Firebase Console or create initialization scripts.

## Security Features Implemented

### Firestore Rules:
- **Public Collections**: Projects and Brands (for website display)
- **Admin-Only**: Contact messages and career applications
- **Employee Access**: Customer and installation data
- **Restricted**: Employee data with role-based permissions

### Storage Rules:
- **Public Access**: Project and brand images
- **Authenticated**: General uploads and documents
- **Role-Based**: Employee and installation files

## Testing the Setup

1. Try logging into the admin panel
2. Verify that Firebase operations work without permission errors
3. Test file uploads
4. Check that public data loads on the website

## Troubleshooting

If you still get permission errors:
1. Wait 5-10 minutes for rules to propagate
2. Check that admin emails are correctly listed in rules
3. Verify Firebase config environment variables
4. Ensure user authentication is working

## Updating Admin Emails

When you need to add new admin users:
1. Update the email list in both `firestore.rules` and `storage.rules`
2. Add the user to Firebase Authentication
3. Redeploy the rules