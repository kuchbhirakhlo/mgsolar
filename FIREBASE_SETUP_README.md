# Firebase Setup Guide

## Firestore Rules

1. Go to Firebase Console > Firestore Database > Rules
2. Replace the existing rules with the content from `firestore.rules`

## Sample Data Import

The `sample-data/` folder contains JSON files with sample data for each collection. You can import this data manually through the Firebase Console or use the Node.js script.

### Manual Import (Firebase Console)

1. Go to Firebase Console > Firestore Database
2. For each collection (projects, brands, employees, contactMessages, careerApplications):
   - Click "Add document"
   - Copy the JSON data from the corresponding `.json` file
   - Paste the data and save

### Using Node.js Script

1. Download your Firebase service account key from Firebase Console > Project Settings > Service accounts
2. Save it as `serviceAccountKey.json` in the project root
3. Install dependencies: `npm install firebase-admin`
4. Run: `node populate-sample-data.js`

## Admin Login Credentials

- Email: admin@mgsolar.com
- Password: mgsolar2024

## Sample Employee Logins

- Employee ID: EMP001, Password: password123 (Employee role)
- Employee ID: EMP002, Password: password123 (Installer role)
- Employee ID: EMP003, Password: password123 (Employee role)

## Collections Overview

- **projects**: Solar installation projects with details
- **brands**: Solar panel brands and logos
- **employees**: Staff accounts with roles
- **contactMessages**: Customer inquiries
- **careerApplications**: Job applications

## Security Note

The current Firestore rules allow all operations for development. For production, implement proper authentication and authorization rules.