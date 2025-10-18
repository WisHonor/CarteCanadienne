-- Add Admin User
-- This script adds a demo admin user to the database
-- Email: admin@example.com
-- Password: admin123 (hashed)

-- Insert admin user
INSERT INTO "User" (
    id, 
    email, 
    "firstName", 
    "lastName", 
    role,
    "createdAt",
    "updatedAt"
) VALUES (
    'admin_user_001',
    'admin@example.com',
    'Admin',
    'User',
    'ADMIN',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = 'ADMIN';

-- Note: The password is not stored in the database for this demo
-- The login API checks for the password "admin123" (SHA-256 hashed)
-- In production, you should use bcrypt and store hashed passwords in the database
