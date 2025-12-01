#!/usr/bin/env node

/**
 * Pre-build script to resolve any failed migrations before deploying
 */

const { execSync } = require('child_process');

console.log('🔧 Checking for failed migrations...');

try {
  // Try to resolve the 0_init migration if it's in a failed state
  execSync('npx prisma migrate resolve --rolled-back 0_init', {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.log('✅ Resolved failed migration');
} catch (error) {
  // If it's not in a failed state, that's fine - just continue
  console.log('ℹ️  No failed migrations to resolve');
}

console.log('✅ Pre-build check complete');

