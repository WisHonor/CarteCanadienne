# 🚀 Google Wallet Setup Guide

## ✅ Current Status

Your Google Wallet credentials are configured, but you need to enable the **Google Wallet API** in your Google Cloud project.

## 📋 Step-by-Step Setup

### Step 1: Enable Google Wallet API

1. Go to: [https://console.developers.google.com/apis/api/walletobjects.googleapis.com/overview?project=530392324815](https://console.developers.google.com/apis/api/walletobjects.googleapis.com/overview?project=530392324815)

2. Click the **"ENABLE"** button

3. Wait 2-3 minutes for the API to activate

### Step 2: Initialize the Pass Class

After enabling the API, run:

```powershell
npx tsx scripts/init-google-wallet.ts
```

You should see:

```
🚀 Initializing Google Wallet Pass Class...
✅ Google Wallet Pass Class created/updated successfully!
📋 Class ID: 3388000000023028646.3388000000023028646.accessibility_card_class
```

### Step 3: Test the Integration

1. Start your development server:

   ```powershell
   npm run dev
   ```

2. Go to admin panel and approve a test application

3. Check the email - it should contain an "Add to Google Wallet" button

4. Click the button to test adding the card to Google Wallet

## 🎯 What Happens Next

Once the API is enabled and the pass class is created:

1. **Automatic Pass Creation**: When admin approves an application, a Google Wallet pass is automatically created

2. **Email Notification**: User receives an approval email with:
   - "Add to Google Wallet" button
   - Direct link to add the card
   - QR code with service information

3. **User Experience**: User clicks button → Google Wallet opens → Card is added

## 📱 Card Contents

The digital card includes:

- **Name**: Full name of cardholder
- **Expiration Date**: 1 year from approval
- **Services**: List of authorized services
  - Mobility Aid Access
  - Support Person Access
  - Service Animal Access
- **QR Code**: Contains JSON with:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "dob": "1990-01-15",
    "expiration": "2026-10-19",
    "services": {
      "mobilityAid": true,
      "supportPerson": true,
      "serviceAnimal": false
    },
    "issued": "2025-10-19T12:00:00Z"
  }
  ```

## 🔧 Troubleshooting

### "API not enabled" error

- Enable the API at the link above
- Wait 2-3 minutes for propagation
- Try initialization script again

### "Pass class not found" error

- Run: `npx tsx scripts/init-google-wallet.ts`
- This creates the template for all passes

### Email doesn't show wallet button

- Check server logs for wallet creation errors
- Verify all environment variables are set
- Ensure API is enabled

## 📊 Environment Variables (Already Configured ✅)

```env
GOOGLE_WALLET_PRIVATE_KEY="..." ✅
GOOGLE_PROJECT_ID="carte-475700" ✅
GOOGLE_CLIENT_EMAIL="carte-47@carte-475700.iam.gserviceaccount.com" ✅
GOOGLE_WALLET_ISSUER_ID="3388000000023028646" ✅
GOOGLE_WALLET_CLASS_ID="3388000000023028646.accessibility_card_class" ✅
```

## 🎨 Customization (Optional)

### Add Card Images

Upload these images to your S3 bucket (`cartecanadiennebucket`):

1. **card-logo.png** (660x660px) - Square logo
2. **card-hero.png** (1032x336px) - Hero banner image
3. **card-wide-logo.png** (1860x444px) - Wide logo

The card will automatically use these images.

### Change Card Color

Edit `src/lib/googleWallet.ts` line 175:

```typescript
hexBackgroundColor: '#1e40af', // Blue - change to any hex color
```

## ✅ Checklist

- [ ] Enable Google Wallet API in Google Cloud Console
- [ ] Run initialization script: `npx tsx scripts/init-google-wallet.ts`
- [ ] Test by approving an application
- [ ] Check approval email for wallet button
- [ ] Click button to test adding card to wallet
- [ ] (Optional) Upload card images to S3
- [ ] (Optional) Customize card colors

## 🚀 You're Almost There!

Just enable the API and run the initialization script. Everything else is already configured! 🎉
