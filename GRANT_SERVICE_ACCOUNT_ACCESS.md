# Grant Service Account Access to Issuer

## Error Message

```
Service account email address did not have edit access on the issuer.
```

## What This Means

Your service account (`carte-47@carte-475700.iam.gserviceaccount.com`) needs to be added as a user with edit permissions on your Google Wallet Issuer ID.

## Steps to Fix

### 1. Go to Google Pay & Wallet Console

Visit: https://pay.google.com/business/console

### 2. Navigate to Issuer Settings

1. Click on your issuer name in the top left
2. Or go directly to: https://pay.google.com/business/console/issuer/settings

### 3. Add Service Account

1. Look for **"Users"** or **"Team Members"** section
2. Click **"Add User"** or **"Invite"**
3. Enter your service account email: `carte-47@carte-475700.iam.gserviceaccount.com`
4. Grant **"Edit"** or **"Admin"** permissions
5. Click **"Save"** or **"Invite"**

### 4. Alternative: API Settings

If you don't see a Users section:

1. Go to **Google Cloud Console**: https://console.cloud.google.com/
2. Select your project: `carte-475700`
3. Go to **IAM & Admin** > **IAM**
4. Find your service account: `carte-47@carte-475700.iam.gserviceaccount.com`
5. Make sure it has these roles:
   - **Service Account Token Creator**
   - **Service Usage Consumer**

### 5. Google Wallet API Settings

1. In Google Pay Console, go to **API Settings** or **Developer Settings**
2. Look for **"Authorized service accounts"**
3. Add: `carte-47@carte-475700.iam.gserviceaccount.com`
4. Grant **"Edit"** permissions

## Verification

After adding the service account:

1. Wait 1-2 minutes for permissions to propagate
2. Restart your dev server: `npm run dev`
3. Approve a test application
4. Try adding the card to Google Wallet again

## If Still Not Working

### Option 1: Check Service Account Key

Make sure your `.env` file has the correct private key:

```env
GOOGLE_WALLET_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Option 2: Verify Issuer ID

Check that your issuer ID in `.env` matches the console:

```env
GOOGLE_WALLET_ISSUER_ID="3388000000023028646"
```

### Option 3: Create Class First

You might need to create the pass class manually before using JWT mode:

1. In Google Pay Console, go to **Generic Passes**
2. Click **"Create Class"**
3. Use these details:
   - **Class ID**: `accessibility_card_class`
   - **Issuer name**: Your company name
   - **Class name**: `Canadian Accessibility Card`
4. Save the class
5. Then try the JWT mode again

## Success Indicators

When it works, you should see:

- No error message
- Google Wallet opens with card preview
- Card shows: name, expiration, services, QR code

## Still Need Help?

If you're still getting errors:

1. Share the exact error message
2. Confirm which steps you completed
3. Check browser console for additional errors
