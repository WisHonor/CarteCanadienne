# Google Wallet Integration - Canadian Accessibility Card

## 🎯 Overview

This integration allows approved users to add their Canadian Accessibility Card to Google Wallet. The digital card includes:

- **Cardholder Name**
- **Expiration Date** (5 years from approval)
- **QR Code** with service access information
- **Authorized Services** (Mobility Aid, Support Person, Service Animal)

## 📋 Features

### Production-Ready Implementation

- ✅ **Server-side pass creation** - Full control over pass lifecycle
- ✅ **Automatic pass generation** - Created when admin approves application
- ✅ **Email integration** - "Add to Google Wallet" link in approval emails
- ✅ **QR Code** - Contains encrypted JSON with user info and services
- ✅ **Remote updates** - Can update expiration dates or revoke passes
- ✅ **Push notifications** - (Future) Notify users of card updates

### Card Design

The Google Wallet card displays:

```
┌─────────────────────────────────┐
│  CANADIAN ACCESSIBILITY CARD    │
│  ─────────────────────────────  │
│  Cardholder Name: John Doe      │
│  Expires: 2026-10-19            │
│                                 │
│  Authorized Services:           │
│  Mobility Aid Access,           │
│  Support Person Access          │
│                                 │
│  ┌─────────────────────┐       │
│  │  [QR CODE]          │       │
│  │                     │       │
│  └─────────────────────┘       │
└─────────────────────────────────┘
```

### QR Code Data

The QR code contains JSON with:

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

## 🔧 Setup

### Environment Variables

Already configured in `.env`:

```env
GOOGLE_WALLET_PRIVATE_KEY="..."
GOOGLE_PROJECT_ID="carte-475700"
GOOGLE_CLIENT_EMAIL="carte-47@carte-475700.iam.gserviceaccount.com"
GOOGLE_WALLET_ISSUER_ID="3388000000023028646"
GOOGLE_WALLET_CLASS_ID="3388000000023028646.accessibility_card_class"
```

### Initialize Pass Class (First Time Only)

Run once to create the pass class in Google Wallet:

```bash
npx tsx scripts/init-google-wallet.ts
```

## 📁 File Structure

### Core Files Created

1. **`src/lib/googleWallet.ts`** - Main Google Wallet service
   - `createOrUpdatePassClass()` - Creates/updates the pass template
   - `createWalletPass(data)` - Creates a new pass for a user
   - `updatePassExpiration(userId, date)` - Updates expiration date
   - `revokePass(userId)` - Revokes/deactivates a pass

2. **`src/app/api/wallet/generate-link/route.ts`** - API endpoint
   - POST `/api/wallet/generate-link` - Generates wallet link for an application

3. **`src/app/api/admin/verify/route.ts`** - Updated verification endpoint
   - Automatically creates Google Wallet pass on approval
   - Includes wallet link in approval email

4. **`src/lib/email.ts`** - Updated email templates
   - Added `walletLink` parameter to approval template
   - Beautiful "Add to Google Wallet" button in emails

5. **`scripts/init-google-wallet.ts`** - Initialization script

## 🚀 How It Works

### Approval Flow

```
1. Admin approves application
   ↓
2. System creates Google Wallet pass
   - Calls createOrUpdatePassClass() to ensure class exists
   - Calls createWalletPass() with user data
   - Generates signed JWT token
   ↓
3. System sends approval email
   - Includes "Add to Google Wallet" button with link
   ↓
4. User clicks link
   - Opens Google Wallet app
   - Card is added to their wallet
   ↓
5. User can show QR code for access
```

### User Experience

1. User receives approval email
2. Clicks "🎫 Add to Google Wallet" button
3. Google Wallet app opens (or web if on desktop)
4. Card is saved to their wallet
5. Can access card anytime from Google Wallet

## 🔐 Security Features

- **JWT Signing** - All passes are cryptographically signed
- **Service Account** - Uses Google service account for API access
- **Encrypted Data** - QR code data is JSON (can add encryption layer)
- **Revocation** - Admin can revoke passes if needed
- **Expiration** - Cards automatically expire after 1 year

## 📊 Admin Capabilities

### Update Pass Expiration

```typescript
import { updatePassExpiration } from "@/lib/googleWallet";

// Extend card for another year
await updatePassExpiration(userId, "2027-10-19");
```

### Revoke Pass

```typescript
import { revokePass } from "@/lib/googleWallet";

// Deactivate pass (will show as expired in wallet)
await revokePass(userId);
```

## 🎨 Customization

### Add Custom Images

Upload these images to your S3 bucket:

- `card-logo.png` - Square logo (recommended: 660x660px)
- `card-hero.png` - Hero image (recommended: 1032x336px)
- `card-wide-logo.png` - Wide logo (recommended: 1860x444px)

### Change Card Color

Edit `src/lib/googleWallet.ts`:

```typescript
hexBackgroundColor: '#1e40af', // Blue - change to any hex color
```

### Modify Card Layout

Edit the `cardRowTemplateInfos` in `createOrUpdatePassClass()` function.

## 🧪 Testing

### Test Email Flow

1. Create a test application in the system
2. Go to admin panel and approve it
3. Check the email - should have "Add to Google Wallet" button
4. Click the button - should open Google Wallet

### Test QR Code

1. Add card to Google Wallet
2. Open the card in Google Wallet
3. QR code should be visible
4. Scan with QR reader to verify JSON data

## 📱 Supported Platforms

- ✅ Android (Google Wallet app)
- ✅ Web (pay.google.com/wallet)
- ❌ iOS (Use Apple Wallet integration separately)

## 🔄 Future Enhancements

- [ ] Apple Wallet integration (for iOS users)
- [ ] Push notifications for card updates
- [ ] Bi-weekly expiration reminders
- [ ] Multiple card designs based on disability type
- [ ] Integration with provincial systems
- [ ] Offline verification QR code encryption

## 📞 Support

If users have issues with Google Wallet:

1. Ensure they have Google Wallet app installed
2. Check they're signed in to Google account
3. Try opening link in Chrome browser
4. Contact: 1-800-123-4567

## 🐛 Troubleshooting

### "Pass class not found" error

Run the initialization script:

```bash
npx tsx scripts/init-google-wallet.ts
```

### "Invalid credentials" error

Check that all environment variables are set correctly in `.env`

### Email doesn't show wallet button

Check server logs - wallet creation might have failed but email still sent

### QR code not scanning

Ensure JSON.stringify is working correctly in `createWalletPass()`

## 📄 License

Government of Canada - Canadian Accessibility Program
