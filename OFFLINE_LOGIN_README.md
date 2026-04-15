# Offline Login System - MG Solar

## Overview
The application uses completely offline login capabilities with predefined credentials. No Firebase connectivity is required for any login functionality.

## Login Pages

### 1. Admin Login (`/admin-login`)
- **Credentials**: admin@mgsolar.com / mgsolar2024
- **Access**: Full admin panel
- **Method**: Session storage (no Firebase required)

### 2. Employee Login (`/employee-login`)
- **URL**: `/employee-login`
- **Credentials**: Predefined employee accounts
- **Access**: Customer management, payments
- **Method**: Offline credential lookup

### 3. Installer Login (`/installer-login`)
- **URL**: `/installer-login`
- **Credentials**: Predefined installer accounts
- **Access**: Installation management
- **Method**: Offline credential lookup

## Sample Login Credentials

### Employee Accounts
| ID | Name | Role | Password | Status |
|----|------|------|----------|--------|
| EMP001 | John Doe | Employee | password123 | Active |
| EMP003 | Bob Johnson | Employee | password123 | Active |
| EMP005 | Charlie Brown | Employee | password123 | Blocked |

### Installer Accounts
| ID | Name | Role | Password | Status |
|----|------|------|----------|--------|
| EMP002 | Jane Smith | Installer | password123 | Active |
| EMP004 | Alice Wilson | Installer | password123 | Active |
| EMP006 | Diana Prince | Installer | password123 | Active |
| INS001 | Mike Johnson | Installer | installer123 | Active |
| INS002 | Sarah Davis | Installer | installer123 | Active |

## How Login Works

1. **Authentication**: Uses predefined credentials hardcoded in the application
2. **Storage**: Session storage maintains login state during browser session
3. **Permissions**: Role-based access control works completely offline
4. **No External Dependencies**: Completely independent of Firebase or internet connectivity

## Authentication Method

- **Type**: Simple credential matching against predefined data
- **Storage**: Browser session storage only
- **Security**: Basic password verification
- **Persistence**: Lost when browser is closed or session ends

## Testing

1. **Start the app**: `npm run dev`
2. **Use login pages** - all work completely offline
3. **Test credentials** - use the quick-fill buttons or manual entry
4. **Check permissions** - Employees vs Installers see different menus
5. **Test blocked account** - EMP005 should show error

## System Architecture

- **No Firebase**: Completely removed Firebase dependencies from login pages
- **Session-based**: Authentication state stored in browser session
- **Predefined users**: All credentials hardcoded in the application
- **Role enforcement**: Automatic role-based menu access

## Security Notes

- **Development only**: Predefined credentials are for testing/development
- **Session only**: No persistent authentication data
- **Browser dependent**: Login lost on browser restart
- **No encryption**: Basic credential matching (not secure for production)

## Quick Test URLs

- Admin: http://localhost:3000/admin-login
- Employee: http://localhost:3000/employee-login
- Installer: http://localhost:3000/installer-login

## Troubleshooting

If login fails:
1. Check browser console for errors
2. Verify credentials match exactly (case-sensitive)
3. Try refreshing the page
4. Clear browser session storage
5. All functionality works completely offline