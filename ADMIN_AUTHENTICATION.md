# Admin Authentication System

## Overview

The admin section is now protected with authentication. Only users with the "ADMIN" role can access the admin dashboard and verification pages.

## Admin Credentials

**Email:** admin@example.com  
**Password:** admin123

## How It Works

### 1. Admin Login

- Admin users must log in at `/admin/login`
- The system checks if the user exists and has the "ADMIN" role
- Upon successful login, a session token is stored in sessionStorage
- If not logged in, admins are redirected to the login page

### 2. Protected Routes

The following routes are protected:

- `/admin` - Admin dashboard
- `/admin/verification/[id]` - Application review page
- All `/api/admin/*` endpoints

### 3. Authentication Flow

```
1. Admin visits /admin
2. System checks for admin-token in sessionStorage
3. If no token → Redirect to /admin/login
4. If token exists → Show admin page
5. All API calls include Authorization header with token
6. If API returns 401 → Clear session and redirect to login
```

### 4. Session Management

- Session is stored in sessionStorage (cleared when tab closes)
- Token is included in Authorization header for all admin API calls
- Logout button clears session and redirects to login
- Automatic logout if API returns 401 Unauthorized

## Setup Instructions

### Step 1: Add Admin User to Database

Run the SQL script to add an admin user:

```bash
# Connect to your Neon database and run:
psql "postgresql://your-connection-string" -f prisma/add-admin-user.sql
```

Or manually insert using Prisma Studio:

```bash
npx prisma studio
```

Add a user with:

- Email: admin@example.com
- Role: ADMIN
- Other fields can be filled as needed

### Step 2: Test Admin Login

1. Start your development server
2. Navigate to `http://localhost:3001/admin`
3. You'll be redirected to `/admin/login`
4. Enter credentials:
   - Email: admin@example.com
   - Password: admin123
5. You should be logged in and see the admin dashboard

## Security Notes

### Current Implementation (Development)

- Password is hashed with SHA-256
- Password "admin123" is hardcoded in the login API
- Session token is a random 32-byte hex string
- Token is not validated against a database (just checks if exists)

### Production Recommendations

1. **Use bcrypt** for password hashing (not SHA-256)
2. **Store hashed passwords** in the database
3. **Use JWT** tokens with expiration
4. **Store session tokens** in database with expiration
5. **Add rate limiting** to prevent brute force attacks
6. **Use HTTPS** in production
7. **Add password reset** functionality
8. **Add multi-factor authentication** (MFA)
9. **Implement role-based access control** (RBAC)
10. **Add audit logging** for all admin actions

## API Endpoints

### POST /api/admin/login

Authenticates an admin user.

**Request:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (Success):**

```json
{
  "token": "abc123...",
  "user": {
    "id": "admin_user_001",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }
}
```

**Response (Error):**

```json
{
  "error": "Invalid credentials"
}
```

### Protected Admin Endpoints

All admin API endpoints now require an Authorization header:

```
Authorization: Bearer <token>
```

If token is missing or invalid, returns:

```json
{
  "error": "Unauthorized - Admin access required"
}
```

Status: 401

## Frontend Components

### Login Page (`/admin/login/page.tsx`)

- Simple email/password form
- Bilingual (French/English)
- Stores token in sessionStorage on success
- Redirects to /admin dashboard

### Protected Pages

Both admin pages check for authentication:

- `/admin/page.tsx` - Dashboard
- `/admin/verification/[id]/page.tsx` - Review page

They include:

- Authentication check on mount
- Automatic redirect to login if not authenticated
- Token included in all API calls
- Logout button in header

## Adding More Admin Users

To add more admin users, insert into the User table with role = "ADMIN":

```sql
INSERT INTO "User" (
    id,
    email,
    "firstName",
    "lastName",
    role,
    "createdAt",
    "updatedAt"
) VALUES (
    'unique_id_here',
    'new_admin@example.com',
    'First',
    'Last',
    'ADMIN',
    NOW(),
    NOW()
);
```

## Troubleshooting

### Can't log in

- Check if admin user exists in database with role = "ADMIN"
- Verify email is exactly: admin@example.com
- Verify password is exactly: admin123
- Check browser console for errors

### Redirected to login immediately

- Session token might be expired or invalid
- Clear sessionStorage and try again
- Check if sessionStorage is enabled in browser

### API returns 401

- Token is missing from sessionStorage
- Token is not being sent in Authorization header
- Backend is not receiving the token
- Check network tab in browser dev tools

## Future Enhancements

- [ ] Proper JWT implementation
- [ ] Password reset via email
- [ ] Multi-factor authentication (MFA)
- [ ] Admin user management page
- [ ] Audit log for admin actions
- [ ] Role-based permissions (super admin, moderator, etc.)
- [ ] Session timeout with automatic logout
- [ ] Remember me functionality
- [ ] Admin activity dashboard
