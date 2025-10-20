# Google Wallet Card - Complete Setup Guide

## 🎨 What's Been Updated

### 1. **Full Card Layout with All Information**

The card now includes a proper class template that tells Google Wallet how to display all fields:

- ✅ Cardholder Name (row 1, left side)
- ✅ Expiration Date (row 1, right side)
- ✅ Authorized Services (row 2, full width)
- ✅ Card ID (row 3, full width)
- ✅ QR Code at the bottom

### 2. **Logo Added**

- Logo URL: `https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-logo.png`
- Make sure you upload your logo to S3 at this path!
- Logo appears at the top of the card

### 3. **Color Changed to Teal/Turquoise**

- Changed from blue (`#1e40af`) to teal (`#0f766e`)
- More distinctive and accessible
- You can change this in the code to any hex color you want

### 4. **QR Code Fixed for Production**

- ✅ Now uses production URL from environment variable
- ✅ Works on mobile phones (not localhost)
- ✅ Falls back to Vercel URL if not set

## 📋 Important: Upload Your Logo

You need to upload a logo image to S3:

1. **Go to AWS S3 Console**: https://s3.console.aws.amazon.com/s3/buckets/cartecanadiennebucket
2. **Upload a logo image**:
   - Name it: `card-logo.png`
   - Recommended size: 660x660 pixels (square)
   - Format: PNG with transparent background
   - Make it **public** (set permissions)

3. **Verify URL works**: Open this in browser:
   ```
   https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-logo.png
   ```

### Alternative: Use a Different Image URL

If you already have a logo hosted elsewhere, update line 272 in `src/lib/googleWallet.ts`:

```typescript
logo: {
  sourceUri: {
    uri: 'YOUR_LOGO_URL_HERE',
  },
```

## 🌐 Update Production URL

When you deploy to Vercel, update the `.env` file:

```env
NEXT_PUBLIC_APP_URL="https://your-actual-domain.vercel.app"
```

Or on Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_APP_URL` = `https://your-actual-domain.vercel.app`

## 🎨 Customize Colors

Want a different color? Edit line 325 in `src/lib/googleWallet.ts`:

```typescript
hexBackgroundColor: '#0f766e', // Current: Teal
```

Color suggestions:

- Blue: `#1e40af`
- Purple: `#7c3aed`
- Red: `#dc2626`
- Green: `#059669`
- Orange: `#ea580c`
- Custom: Use any hex code

## 📱 Card Display Structure

```
┌─────────────────────────────────────┐
│  [LOGO]  Canadian Accessibility     │  ← Logo + Title
│          Card                        │
│  ─────────────────────────────────  │
│  ACCESSIBILITY CARD                  │  ← Header
│  ─────────────────────────────────  │
│  Cardholder Name    Valid Until      │  ← Row 1
│  JOHN DOE           Jan 15, 2030     │
│  ─────────────────────────────────  │
│  Authorized Services                 │  ← Row 2
│  Mobility Aid Access,                │
│  Support Person Access               │
│  ─────────────────────────────────  │
│  Card ID                             │  ← Row 3
│  12ABC34D                            │
│  ─────────────────────────────────  │
│  [QR CODE]                           │  ← Scannable QR
│  12ABC34D                            │
└─────────────────────────────────────┘
```

## 🔧 How the Class Template Works

The `cardTemplateOverride` defines the layout:

```typescript
cardRowTemplateInfos: [
  {
    twoItems: {
      // Row 1: Two columns
      startItem: { fieldPath: "object.textModulesData['name']" },
      endItem: { fieldPath: "object.textModulesData['expires']" },
    },
  },
  {
    oneItem: {
      // Row 2: Full width
      item: { fieldPath: "object.textModulesData['services']" },
    },
  },
  {
    oneItem: {
      // Row 3: Full width
      item: { fieldPath: "object.textModulesData['card_id']" },
    },
  },
];
```

## ✅ Testing Checklist

### Local Testing

1. ✅ Restart dev server
2. ✅ Approve a test application
3. ✅ Check email for wallet button
4. ✅ Add card to Google Wallet
5. ✅ Verify all fields show correctly
6. ✅ Check logo appears
7. ✅ Verify teal color

### QR Code Testing

Since you can't scan localhost on your phone:

**Option 1: Deploy First**

1. Deploy to Vercel
2. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
3. Approve an application in production
4. Scan QR code with phone

**Option 2: Use ngrok (for local testing)**

```powershell
# Install ngrok: https://ngrok.com/download
ngrok http 3001

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update .env:
NEXT_PUBLIC_APP_URL="https://abc123.ngrok.io"

# Restart server and test
```

## 🚀 Deployment Steps

1. **Upload logo to S3** (if not done)
2. **Commit changes**:

   ```powershell
   git add .
   git commit -m "Add logo, update colors, fix QR code for production"
   git push
   ```

3. **Deploy to Vercel**
4. **Add environment variable in Vercel**:
   - Variable: `NEXT_PUBLIC_APP_URL`
   - Value: Your Vercel URL (e.g., `https://carte-canadienne.vercel.app`)

5. **Test in production**:
   - Approve an application
   - Add card to wallet
   - Verify all fields display
   - Scan QR code with phone

## 🐛 Troubleshooting

### Fields Not Showing on Card

**Issue**: Card shows title but not name/expiration/services
**Solution**: The class template tells Google Wallet how to display fields. Make sure you created a new card AFTER the code changes. Old cards won't update automatically.

**Fix**: Delete the old card from Google Wallet and add it again.

### Logo Not Showing

**Checklist**:

- [ ] Logo uploaded to S3?
- [ ] Logo is public (permissions)?
- [ ] URL works in browser?
- [ ] Image is square (660x660)?
- [ ] Format is PNG?

### QR Code Still Points to Localhost

**Issue**: QR shows localhost URL even after setting `NEXT_PUBLIC_APP_URL`
**Solution**:

1. Restart dev server (or redeploy)
2. Create a NEW card (old cards have old QR codes)
3. Environment variables starting with `NEXT_PUBLIC_` must be set at BUILD time

### Color Not Updating

**Issue**: Card still shows blue color
**Solution**: Delete old card and add new one. Color is set when card is created.

## 📝 Key Files Modified

1. **src/lib/googleWallet.ts** (Lines 238-370)
   - Added `passClass` with full card template
   - Added logo configuration
   - Changed color to teal
   - Uses production URL from env

2. **.env**
   - Added `NEXT_PUBLIC_APP_URL`

## 🎯 Next Steps

1. **Upload your logo** to S3 at the path specified
2. **Restart server**: `npm run dev`
3. **Test locally**: Approve an application and add card
4. **Deploy to Vercel**
5. **Set production URL** in Vercel environment variables
6. **Test QR code** on your phone in production

## 💡 Pro Tips

- The `NEXT_PUBLIC_` prefix makes the variable available in the browser
- Logo should be square for best results
- Teal color (`#0f766e`) is highly visible and accessible
- Card templates are defined once per class
- Each card instance references the class
- QR code data is unique per card (includes user info)
