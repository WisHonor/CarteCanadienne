# Manual Pass Class Creation Guide

## Why Create Manually?

If your service account doesn't have issuer access yet, you can create the pass class manually through the Google Pay Console, then use JWT mode to create individual passes.

## Steps

### 1. Go to Google Pay Console

https://pay.google.com/business/console

### 2. Navigate to Generic Passes

1. In the left sidebar, find **"Google Wallet API"**
2. Click **"Generic passes"**
3. Or go directly to: https://pay.google.com/business/console/passes/generic

### 3. Create New Class

Click **"Create class"** button

### 4. Fill in Class Details

**Basic Information:**

- **Class ID**: `accessibility_card_class`
  - Full ID will be: `3388000000023028646.accessibility_card_class`
- **Issuer name**: `Canadian Accessibility Program` (or your organization name)
- **Program name**: `Canadian Accessibility Card`

**Card Layout:**

- **Title**: `Canadian Accessibility Card`
- **Header**: `ACCESSIBILITY CARD`

**Images** (optional but recommended):

- **Logo**: Upload or use URL: `https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-logo.png`
- **Hero image**: Use URL: `https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-hero.png`
- **Wide logo**: Use URL: `https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-wide-logo.png`

**Card Template:**

- Add text fields for:
  - Name
  - Expiration Date
  - Services
- Enable **Barcode**: QR Code type

**Styling:**

- **Background color**: `#1e40af` (blue)

### 5. Save the Class

Click **"Create"** or **"Save"**

### 6. Verify in Code

Your `.env` should already have:

```env
GOOGLE_WALLET_ISSUER_ID="3388000000023028646"
GOOGLE_WALLET_CLASS_ID="accessibility_card_class"
```

### 7. Test

After creating the class manually:

1. Restart dev server: `npm run dev`
2. Approve a test application
3. Try adding card to wallet

## What This Does

- **Manual class creation**: You create the card template once in the console
- **JWT mode**: Your app creates individual card instances referencing this class
- **No API permissions needed**: JWT mode works without special API access

## Benefits

✅ Works immediately (no waiting for API approval)
✅ You control the card design in the console
✅ Can preview and test cards easily
✅ Easy to update card template later

## After Manual Creation

Once the class exists, JWT mode will:

1. Reference the class by ID
2. Create individual passes with user data
3. Generate "Add to Wallet" links
4. No API calls needed!

## Troubleshooting

### "Class not found" error

- Double-check the class ID matches exactly
- Make sure issuer ID is correct
- Class might take 1-2 minutes to be available

### "Invalid JWT" error

- Check service account email in `.env`
- Verify private key is correctly formatted
- Make sure class is published (not draft)

### Still getting permission errors

- You might need to add service account to the class specifically
- In class settings, look for "Access" or "Permissions"
- Add: `carte-47@carte-475700.iam.gserviceaccount.com`
