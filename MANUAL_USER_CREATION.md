# Firebase Console - Manual User Creation Steps

## Step 1: Enable Authentication
1. Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password" provider

## Step 2: Create Firebase Auth Users

### EMP001 - John Doe (Employee)
```
Email: john.doe@mgsolar.com
Password: password123
Display Name: John Doe
```

### EMP002 - Jane Smith (Installer)
```
Email: jane.smith@mgsolar.com
Password: password123
Display Name: Jane Smith
```

### EMP003 - Bob Johnson (Employee)
```
Email: bob.johnson@mgsolar.com
Password: password123
Display Name: Bob Johnson
```

### EMP004 - Alice Wilson (Installer)
```
Email: alice.wilson@mgsolar.com
Password: password123
Display Name: Alice Wilson
```

### EMP006 - Diana Prince (Installer)
```
Email: diana.prince@mgsolar.com
Password: password123
Display Name: Diana Prince
```

## Step 3: Create Firestore Documents

After creating each Auth user, copy the **User UID** and create corresponding Firestore document:

### EMP001 Firestore Document
```json
{
  "mobileNumber": "9876543210",
  "name": "John Doe",
  "email": "john.doe@mgsolar.com",
  "password": "password123",
  "empId": "EMP001",
  "role": "employee",
  "isBlocked": false,
  "firebaseUid": "PASTE_UID_HERE",
  "createdAt": "SERVER_TIMESTAMP"
}
```

### EMP002 Firestore Document
```json
{
  "mobileNumber": "9876543211",
  "name": "Jane Smith",
  "email": "jane.smith@mgsolar.com",
  "password": "password123",
  "empId": "EMP002",
  "role": "installer",
  "isBlocked": false,
  "firebaseUid": "PASTE_UID_HERE",
  "createdAt": "SERVER_TIMESTAMP"
}
```

### EMP003 Firestore Document
```json
{
  "mobileNumber": "9876543212",
  "name": "Bob Johnson",
  "email": "bob.johnson@mgsolar.com",
  "password": "password123",
  "empId": "EMP003",
  "role": "employee",
  "isBlocked": false,
  "firebaseUid": "PASTE_UID_HERE",
  "createdAt": "SERVER_TIMESTAMP"
}
```

### EMP004 Firestore Document
```json
{
  "mobileNumber": "9876543213",
  "name": "Alice Wilson",
  "email": "alice.wilson@mgsolar.com",
  "password": "password123",
  "empId": "EMP004",
  "role": "installer",
  "isBlocked": false,
  "firebaseUid": "PASTE_UID_HERE",
  "createdAt": "SERVER_TIMESTAMP"
}
```

### EMP005 Firestore Document (No Auth - Manual Login)
```json
{
  "mobileNumber": "9876543214",
  "name": "Charlie Brown",
  "password": "password123",
  "empId": "EMP005",
  "role": "employee",
  "isBlocked": true,
  "createdAt": "SERVER_TIMESTAMP"
}
```

### EMP006 Firestore Document
```json
{
  "mobileNumber": "9876543215",
  "name": "Diana Prince",
  "email": "diana.prince@mgsolar.com",
  "password": "password123",
  "empId": "EMP006",
  "role": "installer",
  "isBlocked": false,
  "firebaseUid": "PASTE_UID_HERE",
  "createdAt": "SERVER_TIMESTAMP"
}
```

## Step 4: Test Login

1. **Employee Login**: Go to `/employee-login`
2. **Test Credentials**:
   - Employee ID: `EMP001`
   - Password: `password123`
3. Should login successfully and redirect to admin panel

## Step 5: Verify User Permissions

- **EMP001, EMP003**: Should see full employee menu
- **EMP002, EMP004, EMP006**: Should see installer menu (limited options)
- **EMP005**: Should show "Account blocked" error