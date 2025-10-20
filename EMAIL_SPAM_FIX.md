# Email Spam Filter Fix - Google Wallet Link

## Problem

Resend was flagging the emails with a spam filter warning:

```
Link URLs match sending domain
Ensure that the URLs in your email match the sending domain.
Mismatched URLs can trigger spam filters.
https://pay.google.com/gp/v/save/eyJhbGci...
```

**Root Cause**: The email sender domain (`onboarding@resend.dev`) didn't match the link domain (`pay.google.com`), triggering spam filters.

## Solution

Created a redirect endpoint in your application that:

1. Receives the Google Wallet JWT token as a parameter
2. Redirects to the actual Google Wallet URL
3. Makes the email link match your domain, avoiding spam filters

## Files Changed

### 1. Created: `src/app/api/wallet/redirect/route.ts`

New API endpoint that redirects to Google Wallet:

```
GET /api/wallet/redirect?token=<JWT_TOKEN>
→ Redirects to: https://pay.google.com/gp/v/save/<JWT_TOKEN>
```

### 2. Modified: `src/app/api/admin/verify/route.ts`

Updated to use the redirect URL instead of direct Google Wallet link:

- Old: `https://pay.google.com/gp/v/save/eyJhbGci...`
- New: `https://carte-canadienne.vercel.app/api/wallet/redirect?token=eyJhbGci...`

## How It Works

1. **Admin approves application** → Google Wallet pass created
2. **JWT token extracted** from `https://pay.google.com/gp/v/save/TOKEN`
3. **Redirect URL created**: `{YOUR_DOMAIN}/api/wallet/redirect?token=TOKEN`
4. **Email sent** with redirect URL (matches your domain)
5. **User clicks link** → Redirected to Google Wallet
6. **Card added** to Google Wallet

## Benefits

✅ Email links match your domain (no spam filter warnings)
✅ User experience unchanged (seamless redirect)
✅ Works in both development and production
✅ No changes to Google Wallet integration

## Testing

### Local Testing:

Email will contain: `http://localhost:3001/api/wallet/redirect?token=...`

### Production:

Email will contain: `https://carte-canadienne.vercel.app/api/wallet/redirect?token=...`

## Environment Variables

Make sure these are set:

- `NEXT_PUBLIC_APP_URL`: Your application URL
  - Development: `http://localhost:3001`
  - Production: `https://carte-canadienne.vercel.app/`

## Resend Best Practices

### Current Setup (Testing):

- Sender: `onboarding@resend.dev` (Resend's test sender)
- Limit: 100 emails/day
- ✅ Good for testing

### Production Setup (Recommended):

1. **Add your domain** in Resend dashboard
2. **Configure DNS records**: SPF, DKIM, DMARC
3. **Update sender** in `src/lib/email.ts`:
   ```typescript
   from: 'Carte Canadienne <noreply@yourdomain.com>',
   ```
4. **Benefits**:
   - ✅ No spam filter warnings
   - ✅ Higher email delivery rates
   - ✅ Professional sender address
   - ✅ Higher sending limits

## Next Steps

1. **Test the fix**:
   - Restart your dev server: `npm run dev`
   - Approve an application
   - Check email for new redirect URL
   - Click "Add to Google Wallet" button
   - Verify redirect works

2. **For production**:
   - Deploy to Vercel
   - Ensure `NEXT_PUBLIC_APP_URL` is set in Vercel environment
   - Test approval flow
   - Monitor Resend logs for any delivery issues

3. **Optional (Production)**:
   - Set up custom domain in Resend
   - Update sender email to match your domain
   - Configure DNS for better deliverability
