# MG Solar - Login Credentials Quick Reference

## Admin Login
- **URL**: `/admin-login`
- **Email**: `admin@mgsolar.com`
- **Password**: `mgsolar2024`
- **Access**: Full admin panel with all features

## Employee Login (`/employee-login`)
- **Method**: Enter Employee ID and Password
- **Authentication**: Predefined credentials (completely offline)

### Employee Test Accounts
| Employee ID | Name | Role | Password | Status |
|-------------|------|------|----------|--------|
| EMP001 | John Doe | Employee | password123 | ✅ Active |
| EMP003 | Bob Johnson | Employee | password123 | ✅ Active |
| EMP005 | Charlie Brown | Employee | password123 | ❌ Blocked |

## Engineer Login (`/installer-login`)
- **Method**: Enter Engineer ID and Password
- **Authentication**: Predefined credentials (completely offline)

### Engineer Test Accounts
| Employee ID | Name | Role | Password | Status |
|-------------|------|------|----------|--------|
| EMP002 | Jane Smith | Engineer | password123 | ✅ Active |
| EMP004 | Alice Wilson | Engineer | password123 | ✅ Active |
| EMP006 | Diana Prince | Engineer | password123 | ✅ Active |
| INS001 | Mike Johnson | Engineer | installer123 | ✅ Active |
| INS002 | Sarah Davis | Engineer | installer123 | ✅ Active |

## Quick Test Steps

1. **Admin Login**: Go to `/admin-login` → Click "Auto-fill Admin Credentials" → Login
2. **Employee Login**: Go to `/employee-login` → Click any employee test button → Login
3. **Engineer Login**: Go to `/installer-login` → Click any engineer test button → Login
4. **Check Permissions**:
   - Employees see: Customers, Payments
   - Engineers see: Installations
   - Admin sees: All features

## Features

- ✅ **Completely Offline**: No Firebase required
- ✅ **Session Storage**: Login persists during browser session
- ✅ **Role-Based Access**: Different permissions for employees vs installers
- ✅ **Quick Login Buttons**: One-click credential filling
- ✅ **Blocked Account Handling**: EMP005 shows blocked error
- ✅ **Cross-Page Navigation**: Easy switching between login types

## Troubleshooting

If login fails:
1. Check browser console for errors
2. Verify credentials match exactly (case-sensitive)
3. Try refreshing the page
4. Clear browser session storage if needed
5. All login works completely offline - no internet required