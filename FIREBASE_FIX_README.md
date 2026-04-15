## Firebase Configuration Issues

The "Database not found" error suggests your Firebase configuration is incorrect. Please check:

1. **Firebase Project ID**: Make sure `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in your `.env.local` matches your actual Firebase project ID
2. **Firestore Database**: Ensure you have created a Firestore database in your Firebase project
3. **Firebase Config**: Verify all environment variables are set correctly in `.env.local`

Your `.env.local` should look like:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Authentication Setup Required

Since we're now using Firebase Auth for employees, you need to:

1. **Enable Authentication** in Firebase Console:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider

2. **Update Firestore Rules** (if needed):
   - The current rules allow all operations for development
   - For production, implement proper authentication checks

## Employee Creation with Auth

I've updated the employee creation to:
- Add an optional email field
- Create Firebase Auth users when email is provided
- Send password reset emails automatically
- Allow login with Firebase Auth or fallback to manual password check

## Testing

After fixing the Firebase config:
1. Try creating an employee with an email address
2. The system will create both Firestore record and Firebase Auth user
3. Employee can login using their empId + password
4. If they forget password, they can reset via email (if provided)

Let me know if you need help with the Firebase Console setup!