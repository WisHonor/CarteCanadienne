# 🔐 Fixing Google Wallet API Permissions

## ❌ Current Issue

You're getting a "Permission denied" error because your service account needs proper permissions to create Google Wallet passes.

## ✅ Solution: Grant Service Account Permissions

### Option 1: Use Google Pay Business Console (Recommended)

1. Go to: https://pay.google.com/business/console

2. Sign in with your Google account

3. Click on **"Google Wallet API"**

4. Click on **"Service accounts"** in the left menu

5. Click **"Add service account"**

6. Enter your service account email:

   ```
   carte-47@carte-475700.iam.gserviceaccount.com
   ```

7. Click **"Add"** and then **"Done"**

### Option 2: Use Google Cloud Console

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=carte-475700

2. Click **"+ GRANT ACCESS"**

3. In "New principals", enter:

   ```
   carte-47@carte-475700.iam.gserviceaccount.com
   ```

4. In "Select a role", search for and select:
   - **"Google Wallet API Admin"**

   OR if that's not available, use:
   - **"Owner"** (gives full access)

5. Click **"Save"**

### Option 3: Add to Issuer Account

1. Go to: https://pay.google.com/business/console

2. Navigate to **Settings** → **Users**

3. Add your service account email as a user with **Editor** or **Owner** permissions

## 🧪 Test After Granting Permissions

Wait 2-3 minutes for permissions to propagate, then run:

```powershell
npx tsx scripts/init-google-wallet.ts
```

You should see:

```
🚀 Initializing Google Wallet Pass Class...
✅ Google Wallet Pass Class created/updated successfully!
📋 Class ID: 3388000000023028646.3388000000023028646.accessibility_card_class
```

## 🔍 Verify Service Account

To verify your service account exists and has proper credentials:

```powershell
# Check if service account is configured
npx tsx -e "console.log('Service Account:', process.env.GOOGLE_CLIENT_EMAIL)"
```

Should output:

```
Service Account: carte-47@carte-475700.iam.gserviceaccount.com
```

## 🐛 Still Having Issues?

### Check Service Account in Cloud Console

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=carte-475700

2. Look for: `carte-47@carte-475700.iam.gserviceaccount.com`

3. Click on it

4. Go to **"Permissions"** tab

5. Verify it has Google Wallet API access

### Regenerate Service Account Key

If the private key is invalid:

1. Go to the service account page
2. Click **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **JSON** format
5. Download the file
6. Update your `.env` file with the new `private_key` and `client_email`

## 📋 Required Permissions

Your service account needs ONE of these:

- ✅ **Google Wallet API Admin** (recommended)
- ✅ **Google Wallet Objects Admin**
- ✅ **Owner** (gives all permissions)

## 🚀 Once Fixed

After permissions are granted and the initialization succeeds:

1. The pass class will be created in Google Wallet
2. When admin approves applications, passes will be created automatically
3. Users will receive email with "Add to Google Wallet" button
4. Cards will be valid for **5 years** from approval

## 💡 Alternative: Manual Pass Class Creation

If you can't grant service account permissions, you can create the pass class manually:

1. Go to: https://pay.google.com/business/console
2. Navigate to **"Google Wallet API"**
3. Click **"Create Class"**
4. Choose **"Generic"** class
5. Use Class ID: `3388000000023028646.accessibility_card_class`
6. Configure the layout as needed
7. Save

Then skip the initialization script and passes will be created automatically on approval.

---

**Next step:** Grant your service account permissions using Option 1 above! 🎯
