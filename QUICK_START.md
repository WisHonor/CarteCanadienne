# Quick Summary - What Changed & What to Do

## ✅ What I Fixed

### 1. **Fields Now Display on Card**

Added a proper class template that tells Google Wallet exactly where to show:

- Name (top left)
- Expiration (top right)
- Services (middle)
- Card ID (bottom)

### 2. **Logo Added**

Card now shows a logo at the top. You need to upload it!

### 3. **Color Changed**

Changed from blue to **teal** (`#0f766e`) - more distinctive and accessible

### 4. **QR Code Fixed**

Now uses your production URL instead of localhost, so it will work on phones!

---

## ⚠️ IMPORTANT: Why Fields Don't Show Yet

The card layout is defined by the **class template**. Since you manually created the class in Google Wallet Console WITHOUT this template, your cards won't show the fields properly.

### You Have 2 Options:

### **Option A: Recreate the Class (Recommended)**

1. Go to Google Wallet Console: https://pay.google.com/business/console
2. Delete the old class: `3388000000023028646.accessibility_card_class`
3. Let the code create a new one with the proper template
4. Approve a new test application
5. All fields will show!

### **Option B: Update Existing Class Manually**

1. Go to Google Wallet Console
2. Edit your class: `accessibility_card_class`
3. Go to **Card Template** section
4. Add these fields in this order:
   - Row 1, Column 1: `textModulesData['name']` (Cardholder Name)
   - Row 1, Column 2: `textModulesData['expires']` (Valid Until)
   - Row 2, Full Width: `textModulesData['services']` (Authorized Services)
   - Row 3, Full Width: `textModulesData['card_id']` (Card ID)
5. Set background color to: `#0f766e`
6. Add logo URL: `https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-logo.png`

---

## 🎨 Upload Your Logo

**Upload a logo to S3**:

1. Go to: https://s3.console.aws.amazon.com/s3/buckets/cartecanadiennebucket
2. Upload file named: `card-logo.png`
3. Make it **public**
4. Recommended size: 660x660 pixels (square)

**Or use a different URL**:
Edit line 272 in `src/lib/googleWallet.ts` with your logo URL

---

## 📱 Fix QR Code for Your Phone

The QR code now points to production, but you need to:

1. **Deploy to Vercel first**
2. **Add environment variable in Vercel**:
   - Go to: Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_APP_URL`
   - Value: `https://carte-canadienne.vercel.app` (or your domain)
3. **Redeploy** (or just rebuild)
4. **Create a new card** in production
5. **Scan QR code** - it will work on your phone now!

---

## 🧪 Quick Test (After Fixing Class)

1. Go to: http://localhost:3001/admin/verification
2. Approve a test application
3. Check email and click "Add to Google Wallet"
4. You should now see:
   - ✅ Logo at the top
   - ✅ Teal background color
   - ✅ Name and expiration displayed
   - ✅ Services list
   - ✅ Card ID
   - ✅ QR code

---

## 🚀 Deploy to Production

Once you're happy with local testing:

```powershell
# Commit changes
git add .
git commit -m "Add logo, colors, and full card template"
git push

# Vercel will auto-deploy
```

Then add the environment variable in Vercel dashboard.

---

## 🎨 Customize Colors

Want a different color? Edit line 325 in `src/lib/googleWallet.ts`:

```typescript
hexBackgroundColor: '#0f766e', // Change this to any hex color
```

Popular choices:

- Blue: `#1e40af`
- Purple: `#7c3aed`
- Green: `#059669`
- Red: `#dc2626`

---

## 📄 Full Documentation

See `WALLET_COMPLETE_SETUP.md` for complete details on everything!

---

## 💬 Still Having Issues?

Let me know:

- "Fields still don't show" → You need to recreate/update the class
- "Logo doesn't appear" → Need to upload to S3
- "QR code doesn't work" → Need to deploy and set production URL
- "Color wrong" → Delete old card and add new one
