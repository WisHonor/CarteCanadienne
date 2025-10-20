import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

/**
 * Google Wallet Configuration Checker
 * Run this to verify your setup before testing
 * 
 * Usage: npx tsx scripts/check-wallet-config.ts
 */

function checkConfig() {
  console.log('🔍 Checking Google Wallet Configuration...\n');

  const checks = [
    {
      name: 'GOOGLE_WALLET_PRIVATE_KEY',
      value: process.env.GOOGLE_WALLET_PRIVATE_KEY,
      required: true,
    },
    {
      name: 'GOOGLE_CLIENT_EMAIL',
      value: process.env.GOOGLE_CLIENT_EMAIL,
      required: true,
    },
    {
      name: 'GOOGLE_PROJECT_ID',
      value: process.env.GOOGLE_PROJECT_ID,
      required: true,
    },
    {
      name: 'GOOGLE_WALLET_ISSUER_ID',
      value: process.env.GOOGLE_WALLET_ISSUER_ID,
      required: true,
    },
    {
      name: 'GOOGLE_WALLET_CLASS_ID',
      value: process.env.GOOGLE_WALLET_CLASS_ID,
      required: true,
    },
  ];

  let allPassed = true;

  checks.forEach(check => {
    const exists = !!check.value;
    const icon = exists ? '✅' : '❌';
    const status = exists ? 'SET' : 'MISSING';
    
    console.log(`${icon} ${check.name}: ${status}`);
    
    if (exists && check.name === 'GOOGLE_CLIENT_EMAIL') {
      console.log(`   📧 ${check.value}`);
    }
    if (exists && check.name === 'GOOGLE_PROJECT_ID') {
      console.log(`   📁 ${check.value}`);
    }
    if (exists && check.name === 'GOOGLE_WALLET_ISSUER_ID') {
      console.log(`   🆔 ${check.value}`);
    }
    
    if (!exists && check.required) {
      allPassed = false;
    }
  });

  console.log('\n' + '='.repeat(50));

  if (allPassed) {
    console.log('✅ All environment variables are configured!\n');
    console.log('📋 Next Steps:');
    console.log('   1. Grant service account permissions');
    console.log('      See: FIX_PERMISSIONS.md');
    console.log('   2. Run: npx tsx scripts/init-google-wallet.ts');
    console.log('   3. Test by approving an application\n');
  } else {
    console.log('❌ Some required environment variables are missing!\n');
    console.log('📝 Check your .env file and add the missing variables.\n');
  }

  // Test if private key is properly formatted
  if (process.env.GOOGLE_WALLET_PRIVATE_KEY) {
    const key = process.env.GOOGLE_WALLET_PRIVATE_KEY.replace(/\\n/g, '\n');
    if (key.includes('BEGIN PRIVATE KEY') && key.includes('END PRIVATE KEY')) {
      console.log('✅ Private key format looks correct\n');
    } else {
      console.log('⚠️  Private key might not be properly formatted');
      console.log('   It should contain "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----"\n');
    }
  }

  console.log('🔗 Useful Links:');
  console.log('   • Google Cloud Console: https://console.cloud.google.com/iam-admin/iam?project=' + process.env.GOOGLE_PROJECT_ID);
  console.log('   • Google Pay Console: https://pay.google.com/business/console');
  console.log('   • Service Account: ' + process.env.GOOGLE_CLIENT_EMAIL);
  console.log('');
}

checkConfig();
