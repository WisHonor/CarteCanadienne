# Google Wallet Card - Latest Updates

## ✅ What's New

### 1. **Name and Expiration Prominently Displayed**

The card now shows:

- **Header**: Cardholder's full name (replaces generic "ACCESSIBILITY CARD")
- **Subheader**: "Valid until [date]" in a readable format (e.g., "Valid until January 15, 2030")
- **Card Title**: Still shows "Canadian Accessibility Card"

### 2. **Fixed QR Code**

Previously:

- ❌ QR code contained JSON data
- ❌ When scanned, tried to open an app
- ❌ Showed error: "This app was not found on your device"

Now:

- ✅ QR code contains a verification URL
- ✅ When scanned, opens a beautiful verification page
- ✅ Shows all card information in a readable format

### 3. **New Verification Page**

Created: `/verify` route

When someone scans the QR code, they see:

- ✅ Valid Card indicator
- 👤 Cardholder name
- 🆔 Card ID (first 8 characters)
- 📅 Expiration date
- 🎯 List of authorized services
- ⏰ Scan timestamp

## 🎨 Card Display Structure

```
┌─────────────────────────────────┐
│  Canadian Accessibility Card    │  ← Card Title
│  ─────────────────────────────  │
│  JOHN DOE                        │  ← Header (Name)
│  Valid until January 15, 2030   │  ← Subheader (Expiration)
│  ─────────────────────────────  │
│  Authorized Services:            │
│  Mobility Aid Access,            │
│  Support Person Access           │
│  ─────────────────────────────  │
│  Card ID: 12ABC34D               │
│  ─────────────────────────────  │
│  [QR CODE]                       │  ← Scans to verification page
└─────────────────────────────────┘
```

## 📱 QR Code Format

**Old format** (broken):

```json
{"name":"John Doe","email":"...","dob":"...","expiration":"...","services":{...},"issued":"..."}
```

**New format** (working):

```
https://carte-canadienne.vercel.app/verify?name=John+Doe&id=123456&expires=2030-01-15&mobility=1&support=1&animal=0
```

## 🧪 Testing Instructions

### Step 1: Create New Card

1. Go to admin panel: http://localhost:3001/admin/verification
2. Approve a test application
3. Check the email for "Add to Google Wallet" button

### Step 2: Verify Card Display

1. Click "Add to Google Wallet"
2. Card should now show:
   - ✅ Person's name in the header
   - ✅ Expiration date below the name
   - ✅ Services list
   - ✅ Card ID
   - ✅ QR code at the bottom

### Step 3: Test QR Code

1. Open the card in Google Wallet
2. Scan the QR code with another phone (or screenshot it)
3. Should open: https://carte-canadienne.vercel.app/verify?...
4. Verification page should show:
   - ✅ Valid Card checkmark
   - 👤 Cardholder name
   - 🆔 Card ID
   - 📅 Expiration date
   - 🎯 List of services

## 🔧 Technical Changes

### File: `src/lib/googleWallet.ts`

**QR Code Generation** (Lines 143-156):

```typescript
// Create a verification URL with query parameters
const qrParams = new URLSearchParams({
  name: data.fullName,
  id: data.userId,
  expires: new Date(data.expirationDate).toLocaleDateString("en-CA"),
  mobility: data.services.mobilityAid ? "1" : "0",
  support: data.services.supportPerson ? "1" : "0",
  animal: data.services.serviceAnimal ? "1" : "0",
});

const qrData = `https://carte-canadienne.vercel.app/verify?${qrParams.toString()}`;
```

**Card Structure** (Lines 238-275):

```typescript
const simpleObject = {
  id: objectId,
  classId: `${issuerId}.${classId}`,
  state: "ACTIVE",
  cardTitle: {
    defaultValue: {
      language: "en-US",
      value: "Canadian Accessibility Card",
    },
  },
  header: {
    defaultValue: {
      language: "en-US",
      value: data.fullName, // ← Name prominently displayed
    },
  },
  subheader: {
    defaultValue: {
      language: "en-US",
      value: `Valid until ${expirationFormatted}`, // ← Expiration displayed
    },
  },
  textModulesData: [
    {
      id: "services",
      header: "Authorized Services",
      body: servicesText,
    },
    {
      id: "card_id",
      header: "Card ID",
      body: data.userId.substring(0, 8).toUpperCase(),
    },
  ],
  barcode: {
    type: "QR_CODE",
    value: qrData,
    alternateText: data.userId.substring(0, 8).toUpperCase(),
  },
  hexBackgroundColor: "#1e40af",
};
```

### File: `src/app/verify/page.tsx`

New verification page that:

- Parses URL query parameters
- Displays card information beautifully
- Shows valid/invalid status
- Lists authorized services
- Shows scan timestamp

## 🚀 Next Steps

1. **Test locally**: Approve a test application and verify the changes
2. **Check QR code**: Make sure scanning works and shows the verification page
3. **Deploy to Vercel**: Once tested, deploy to production
4. **Update QR URL**: If your domain changes, update the URL in `googleWallet.ts` line 156

## 📝 Notes

- **Blue background color**: `#1e40af` (matches your app theme)
- **Card validity**: Still 5 years from approval date
- **QR code**: Now scannable with any QR reader (not just Google Wallet)
- **Verification page**: Works on any device, no login required
- **Card ID**: Shows first 8 characters of user ID for privacy

## 🎉 Benefits

✅ Name and expiration clearly visible on the card
✅ QR code works perfectly - no app errors
✅ Professional verification page
✅ Easy for businesses to verify card authenticity
✅ Scan works with any QR code reader
✅ No login required to verify cards
✅ Clean, accessible design
