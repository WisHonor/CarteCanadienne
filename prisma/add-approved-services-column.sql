-- Add approvedServices column to Application table
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "approvedServices" TEXT;

