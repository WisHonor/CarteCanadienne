# 🎫 JWT Mode - Quick Start Guide

## ✅ JWT Mode is Now Enabled!

You can now test Google Wallet passes **immediately** without waiting for Google's approval!

## 🚀 How to Test

### Step 1: Restart Your Dev Server

```powershell
# Stop current server (Ctrl+C if running)
npm run dev
```

### Step 2: Approve a Test Application

1. Go to: http://localhost:3000/admin
2. Select an application
3. Click "Approve"

### Step 3: Check the Email

The approval email will now include the **"Add to Google Wallet"** button! 🎉

### Step 4: Click the Button

- If on Android: Opens Google Wallet app
- If on desktop: Opens Google Wallet web interface
- Card will be added to your wallet!

## 📊 What Changed

### Before (API Mode - Blocked):

```
Admin approves → API call to create pass → ❌ Permission denied → Email sent without wallet link
```

### Now (JWT Mode - Working):

```
Admin approves → JWT token generated → ✅ Works immediately → Email sent with wallet link
```

## 🔍 Check the Logs

When you approve an application, you'll see:

```
🎫 JWT Mode: Skipping pass class creation (embedded in token)
🎫 JWT Mode: Creating pass with embedded class definition
✅ JWT pass created successfully (no API calls)
✅ Google Wallet pass created successfully
Approval email sent to: user@email.com ✅
```

## 📱 What Users See

### Email:

```
┌─────────────────────────────────────┐
│ ✓ Congratulations!                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📱 Add to Google Wallet        │ │
│ │  [🎫 Add to Google Wallet] ←WORKS│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Google Wallet Card:

```
┌──────────────────────────────────────┐
│ CANADIAN ACCESSIBILITY CARD          │
│ Government of Canada                 │
├──────────────────────────────────────┤
│ Cardholder Name: John Doe            │
│ Expires: 2030-10-19                  │
│                                      │
│ Authorized Services:                 │
│ Mobility Aid Access,                 │
│ Support Person Access                │
│                                      │
│ [QR CODE with their info]            │
└──────────────────────────────────────┘
```

## ⚙️ Switch Between Modes

Edit `.env`:

```env
# JWT Mode (works now, can't update passes)
GOOGLE_WALLET_MODE="jwt"

# API Mode (requires approval, can update passes)
GOOGLE_WALLET_MODE="api"
```

## 📋 JWT Mode Features

### ✅ What Works:

- Creating passes
- Adding to Google Wallet
- QR codes with user data
- Personalized cards
- 5-year expiration
- All user information

### ❌ What Doesn't Work:

- Remote pass updates
- Revoking passes
- Push notifications
- Tracking pass status

## 🎯 Production Plan

1. **Now**: Use JWT mode for testing and demo
2. **Apply**: Request production access from Google
3. **Wait**: 1-3 business days for approval
4. **Switch**: Change `GOOGLE_WALLET_MODE="api"` in `.env`
5. **Deploy**: Full functionality enabled!

## 🔧 Troubleshooting

### Email still doesn't have wallet button?

1. Make sure `.env` has: `GOOGLE_WALLET_MODE="jwt"`
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Try approving a new application

### Button opens but card doesn't appear?

- Make sure you're signed in to Google account
- Check that you're listed as a tester in Google Pay console
- Try on Android device with Google Wallet app

### Want to see the JWT token?

Check server logs - you'll see the full wallet link generated!

---

## 🎉 Ready to Test!

Just approve an application and check the email - it should now have the working Google Wallet button! 🚀
