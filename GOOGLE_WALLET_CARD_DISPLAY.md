# 🎫 Google Wallet Card Display Guide

## What Users See When They Add the Card

When a user clicks "Add to Google Wallet" and the card is added to their phone, here's what they'll see:

---

## 📱 **Card Front View**

```
╔═══════════════════════════════════════════════╗
║  [Logo]          ACCESSIBILITY CARD           ║
║                                               ║
║  🎫 Canadian Accessibility Card               ║
║                                               ║
║  ┌─────────────────────────────────────────┐ ║
║  │  [Hero Image]                           │ ║
║  │  (Canadian Accessibility Card Banner)   │ ║
║  └─────────────────────────────────────────┘ ║
║                                               ║
║  Cardholder Name          Valid Until        ║
║  John Smith               December 31, 2030   ║
║                                               ║
║  Authorized Services                          ║
║  Mobility Aid Access, Support Person Access,  ║
║  Service Animal Access                        ║
║                                               ║
║  Card ID                                      ║
║  A1B2C3D4                                     ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

---

## 📋 **Card Details**

### **Background Color**

- **Teal** (#0f766e) - Professional, accessible, government-appropriate

### **Header**

- **Title**: "ACCESSIBILITY CARD"
- **Logo**: Canadian accessibility logo (top-left)
- **Card Title**: "Canadian Accessibility Card"

### **Hero Image**

- Full-width banner image
- URL: `https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-hero.png`

### **Information Displayed**

#### 1. **Cardholder Name** (Left Column)

- Header: "Cardholder Name"
- Value: Full name (e.g., "John Smith")

#### 2. **Valid Until** (Right Column)

- Header: "Valid Until"
- Value: Formatted expiration date (e.g., "December 31, 2030")
- Note: Card expires 5 years after approval

#### 3. **Authorized Services** (Full Width)

- Header: "Authorized Services"
- Value: Comma-separated list of approved services:
  - ✅ "Mobility Aid Access" (if wheelchair/walker needed)
  - ✅ "Support Person Access" (if support person needed)
  - ✅ "Service Animal Access" (if service animal needed)

#### 4. **Card ID** (Full Width)

- Header: "Card ID"
- Value: First 8 characters of user ID in uppercase (e.g., "A1B2C3D4")

---

## 🎨 **Visual Layout**

### **Top Section**

```
┌──────────────────────────────────────┐
│ [🏛️ Logo]  ACCESSIBILITY CARD       │
│                                      │
│ 🎫 Canadian Accessibility Card      │
└──────────────────────────────────────┘
```

### **Hero Image**

```
┌──────────────────────────────────────┐
│                                      │
│     [Hero Banner Image]              │
│                                      │
└──────────────────────────────────────┘
```

### **Information Grid**

```
┌─────────────────┬────────────────────┐
│ Cardholder Name │ Valid Until        │
│ John Smith      │ December 31, 2030  │
└─────────────────┴────────────────────┘

┌──────────────────────────────────────┐
│ Authorized Services                  │
│ Mobility Aid Access,                 │
│ Support Person Access,               │
│ Service Animal Access                │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Card ID                              │
│ A1B2C3D4                             │
└──────────────────────────────────────┘
```

---

## ✨ **Key Features**

### ✅ **What's Included**

- ✅ Full cardholder name
- ✅ Expiration date (human-readable format)
- ✅ List of authorized services
- ✅ Unique card ID for verification
- ✅ Professional teal background color
- ✅ Canadian government branding
- ✅ Hero image and logo

### ❌ **What's NOT Included**

- ❌ No QR code (removed per your request)
- ❌ No barcode
- ❌ No clickable links to view application
- ❌ No personal health information
- ❌ No photo (privacy consideration)

---

## 📲 **User Experience**

### **1. Email Received**

```
✅ Your application has been approved!

┌────────────────────────────────────┐
│  📱 Add Your Card to Google Wallet │
│                                    │
│  [🎫 Add to Google Wallet] Button  │
└────────────────────────────────────┘
```

### **2. Click Button**

- Redirects through your domain:
  `https://carte-canadienne.vercel.app/api/wallet/redirect?token=...`
- Then redirects to Google Wallet:
  `https://pay.google.com/gp/v/save/...`

### **3. Google Wallet Opens**

- Shows preview of the card
- "Add to Google Pay" button
- User confirms

### **4. Card Added**

- Appears in Google Wallet app
- Can be accessed offline
- Shows all information clearly
- No expiration notifications until near expiry date

---

## 🔍 **Example Card Data**

### **Example 1: Full Services**

```
Cardholder Name: Sarah Johnson
Valid Until: March 15, 2030
Authorized Services: Mobility Aid Access, Support Person Access, Service Animal Access
Card ID: B7F3C2A9
```

### **Example 2: Partial Services**

```
Cardholder Name: Michael Chen
Valid Until: June 22, 2029
Authorized Services: Support Person Access
Card ID: D4E8F1G2
```

### **Example 3: Single Service**

```
Cardholder Name: Emma Thompson
Valid Until: September 8, 2031
Authorized Services: Service Animal Access
Card ID: H3J5K7M9
```

---

## 🎯 **Design Philosophy**

### **Accessibility First**

- High contrast text
- Clear, readable fonts
- Simple, uncluttered layout
- Professional government appearance

### **Privacy Conscious**

- No sensitive health details
- No full ID numbers
- No personal photos
- Only essential access information

### **User Friendly**

- Works offline
- Easy to show to staff
- Clear service authorization
- Quick verification via Card ID

---

## 📝 **Technical Details**

### **Card Type**

- Generic Pass (Google Wallet)
- No barcode/QR code
- Text-based information display
- Static content (doesn't update after creation)

### **Expiration**

- Set to 5 years from approval date
- Google Wallet will notify user before expiration
- Formatted as: "Month Day, Year" (e.g., "December 31, 2030")

### **Card ID Format**

- First 8 characters of UUID
- Converted to uppercase
- Example: User ID `a1b2c3d4-e5f6-7890-abcd-ef1234567890` → Card ID `A1B2C3D4`

### **Services Format**

- Comma-separated list
- Full service names (not codes)
- Easy for staff to read and verify

---

## 💡 **Staff Verification**

When a cardholder shows their card, staff can verify:

1. ✅ **Name matches** government ID
2. ✅ **Card is not expired** (check Valid Until date)
3. ✅ **Services are authorized** (read list of services)
4. ✅ **Card ID** (can be checked against system if needed)

Simple, fast, and clear for everyone involved!

---

## 🚀 **Next Steps**

To see the card in action:

1. Restart your dev server: `npm run dev`
2. Approve a test application
3. Check the email for the wallet link
4. Click "Add to Google Wallet"
5. View the card in Google Wallet

The card should display exactly as described above!
