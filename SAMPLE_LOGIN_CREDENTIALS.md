# MG Solar - Sample Login Credentials

## Admin Login
- **URL**: `/admin-login`
- **Email**: `admin@mgsolar.com`
- **Password**: `mgsolar2024`

## Employee Login Credentials

### Active Employees (Can Login)
| Employee ID | Name | Role | Email | Password | Mobile | Status |
|-------------|------|------|-------|----------|--------|--------|
| EMP001 | John Doe | Employee | john.doe@mgsolar.com | password123 | 9876543210 | Active |
| EMP002 | Jane Smith | Installer | jane.smith@mgsolar.com | password123 | 9876543211 | Active |
| EMP003 | Bob Johnson | Employee | bob.johnson@mgsolar.com | password123 | 9876543212 | Active |
| EMP004 | Alice Wilson | Installer | alice.wilson@mgsolar.com | password123 | 9876543213 | Active |
| EMP006 | Diana Prince | Installer | diana.prince@mgsolar.com | password123 | 9876543215 | Active |

### Blocked Employee (Cannot Login)
| Employee ID | Name | Role | Email | Password | Mobile | Status |
|-------------|------|------|-------|----------|--------|--------|
| EMP005 | Charlie Brown | Employee | (none) | password123 | 9876543214 | Blocked |

## How to Manually Create These Users

### Step 1: Create Firebase Auth Users (for users with email)
For each employee with an email address:

1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Fill:
   - **Email**: `employee.email` (e.g., john.doe@mgsolar.com)
   - **Password**: `password123`
   - **Display name**: `employee.name` (e.g., John Doe)
4. Click "Add user"
5. **Copy the User UID** (you'll need this for Firestore)

### Step 2: Create Firestore Documents
For each employee:

1. Go to Firebase Console → Firestore Database → employees collection
2. Click "Add document"
3. Use auto-generated Document ID
4. Add these fields:

```json
{
  "mobileNumber": "9876543210",
  "name": "John Doe",
  "email": "john.doe@mgsolar.com",  // optional
  "password": "password123",
  "empId": "EMP001",
  "role": "employee",  // or "installer"
  "isBlocked": false,
  "firebaseUid": "paste_uid_here",  // only if email provided
  "createdAt": // Click "Server timestamp"
}
```

## Testing Login Scenarios

### 1. Employee with Firebase Auth (EMP001, EMP002, EMP003, EMP004, EMP006)
- Can login with Employee ID + Password
- Firebase Auth handles authentication
- Can reset password via email

### 2. Employee without Firebase Auth (EMP005)
- Uses manual password verification
- Cannot reset password (no email)
- Currently blocked for testing

### 3. Blocked User (EMP005)
- Login attempt should show "Account blocked" error

## Employee Login URLs
- **Employee Login**: `/employee-login`
- **Installer Login**: Uses same `/employee-login` page (role determined automatically)

## Troubleshooting

If login fails:
1. Check Firebase configuration in `.env.local`
2. Ensure Firestore rules allow read operations
3. Verify employee data exists in Firestore
4. Check browser console for specific errors
5. Use the "Test Firebase Connection" button on login page

## Sample Data Creation

Run the populate script:
```bash
node populate-sample-data.js
```
(Requires `serviceAccountKey.json` in project root)

Or manually import JSON files from `sample-data/` folder.