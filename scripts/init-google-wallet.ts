import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

import { createOrUpdatePassClass } from '@/lib/googleWallet';

/**
 * Initialize Google Wallet Pass Class
 * Run this once to create the pass class in Google Wallet
 * 
 * Usage: npx tsx scripts/init-google-wallet.ts
 */
async function main() {
  console.log('🚀 Initializing Google Wallet Pass Class...');
  
  try {
    await createOrUpdatePassClass();
    console.log('✅ Google Wallet Pass Class created/updated successfully!');
    console.log(`📋 Class ID: ${process.env.GOOGLE_WALLET_ISSUER_ID}.${process.env.GOOGLE_WALLET_CLASS_ID}`);
  } catch (error) {
    console.error('❌ Error creating pass class:', error);
    process.exit(1);
  }
}

main();
