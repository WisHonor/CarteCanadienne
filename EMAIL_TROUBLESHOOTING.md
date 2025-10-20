# Email Troubleshooting Guide

## 🔍 Why Emails Might Not Be Sending

### Common Issues:

1. **Resend API Key Not Set**
   - Check `.env` file has: `RESEND_API_KEY="..."`
   - ✅ Your key is set: `re_WMHuX6AZ_8unEr2GjfpHjHeTBnjZNLy2Q`

2. **Email Address Not Verified in Resend**
   - Default sender: `onboarding@resend.dev` (only works in test mode)
   - ⚠️ For production, you need a verified domain

3. **Rate Limiting**
   - Resend free tier: 100 emails/day
   - Check if limit reached

4. **Email Going to Spam**
   - Check spam/junk folder
   - Default `onboarding@resend.dev` might be flagged

5. **Server Error Not Logged**
   - Errors are caught and logged to console
   - Check server terminal for errors

---

## 🔧 How to Debug

### Step 1: Check Server Logs

When you approve/reject an application, look for these messages in the terminal:

**Success:**

```
✅ Google Wallet pass created successfully: ...
Approval email sent to: user@example.com
Email sent successfully: { id: '...' }
```

**Failure:**

```
Error sending email: [error details]
```

### Step 2: Test Resend API Key

Run this test in your browser console or terminal:

```javascript
fetch("/api/test-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "your-email@example.com",
  }),
});
```

### Step 3: Check Resend Dashboard

1. Go to: https://resend.com/dashboard
2. Login with your account
3. Click **"Logs"** in the sidebar
4. Check if emails are being sent but failing

---

## ✅ Quick Fix: Verify Email in Resend

### For Testing (Quick):

1. Go to: https://resend.com/dashboard
2. Click **"Domains"** → **"Add Domain"**
3. Or use default `onboarding@resend.dev` for testing

### For Production (Recommended):

1. **Add Your Domain in Resend:**
   - Go to Resend Dashboard → Domains
   - Add your domain (e.g., `carte-canadienne.com`)
   - Add DNS records (SPF, DKIM, DMARC)

2. **Update Email Sender:**
   Edit `src/lib/email.ts` line 13:
   ```typescript
   from: 'Carte Canadienne <noreply@carte-canadienne.com>',
   ```

---

## 🧪 Test Email Function

I'll create a test API route to check if emails work:
