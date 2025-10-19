# Quick Test Guide - Email Notifications

## 🧪 How to Test Email Notifications

### Prerequisites

- ✅ Admin account created (admin@example.com / admin123)
- ✅ Resend API key in .env
- ✅ Dev server running on port 3001

### Test Flow

#### 1. Create a Test Application

```
1. Navigate to: http://localhost:3001
2. Click "Commencer la demande"
3. Fill out Step 1 (Personal Info):
   - Use YOUR REAL EMAIL to receive test emails
   - Fill all required fields
4. Fill out Step 2 (Disabilities/Services)
5. Fill out Step 3 (Upload Documents)
6. Submit application
```

#### 2. Test Approval Email

```
1. Go to: http://localhost:3001/admin/login
2. Login as admin:
   Email: admin@example.com
   Password: admin123
3. Click on the pending application
4. Click "Approuver" (Approve)
5. Check your email inbox
   ✅ You should receive: "Votre demande...a été approuvée"
```

#### 3. Test Rejection Email

```
1. Create another test application (use your email again)
2. Login as admin
3. Click on the new application
4. Add admin notes (optional): "Documents incomplets"
5. Click "Rejeter" (Reject)
6. Check your email inbox
   ✅ You should receive: "Mise à jour de votre demande"
   ✅ Admin notes should appear in the email
```

### What to Check

**Approval Email** ✅

- [ ] Email arrives in inbox (not spam)
- [ ] Subject: "✅ Votre demande...a été approuvée"
- [ ] Shows your name correctly
- [ ] Green success icon displays
- [ ] "Next Steps" section with info
- [ ] "View My Application" button works
- [ ] Mobile-friendly layout
- [ ] Government branding present

**Rejection Email** ✅

- [ ] Email arrives in inbox (not spam)
- [ ] Subject: "Mise à jour de votre demande"
- [ ] Shows your name correctly
- [ ] Red icon displays
- [ ] Admin notes appear (if provided)
- [ ] "What to do next" section present
- [ ] "New Application" button works
- [ ] Mobile-friendly layout
- [ ] Government branding present

### Check Server Logs

After approving/rejecting, check terminal for:

```
Application verified: { id: '...', status: 'APPROVED' }
Email sent successfully: { id: '...' }
Approval email sent to: user@example.com
```

Or for rejection:

```
Application verified: { id: '...', status: 'REJECTED' }
Email sent successfully: { id: '...' }
Rejection email sent to: user@example.com
```

### Troubleshooting

**Email not received?**

1. Check spam folder
2. Check Resend dashboard: https://resend.com/emails
3. Check console logs for errors
4. Verify RESEND_API_KEY in .env

**Error in console?**

```typescript
// Common errors:
Error: Invalid API key
→ Check .env file

Error: Rate limit exceeded
→ Wait a few minutes or upgrade plan

Error: Invalid recipient email
→ Check email format in application
```

**Email looks broken?**

- Some email clients strip styles
- Test in multiple clients:
  - Gmail ✅
  - Outlook ✅
  - Apple Mail ✅
  - Mobile apps ✅

### Advanced Testing

**Test with Different Email Clients**:

1. Send to Gmail: your.email@gmail.com
2. Send to Outlook: your.email@outlook.com
3. Send to Yahoo: your.email@yahoo.com
4. Check mobile view on phone

**Test Bilingual Support**:
Currently defaults to French. To test English:

1. Edit `src/app/api/admin/verify/route.ts`
2. Change: `const lang: 'fr' | 'en' = 'en'`
3. Restart server
4. Approve/reject application
5. Check English email

**Stress Test**:

1. Create 5+ applications
2. Approve them all quickly
3. Check if all emails arrive
4. Verify rate limits

### Production Testing

Before going live:

1. ✅ Update sender email to verified domain
2. ✅ Test with real user emails
3. ✅ Check spam score (mail-tester.com)
4. ✅ Verify all links work on production URL
5. ✅ Test unsubscribe (if implemented)
6. ✅ Monitor Resend dashboard for delivery rate

## 📧 Expected Results

### Approval Email Preview

```
From: Carte Canadienne <onboarding@resend.dev>
To: user@example.com
Subject: ✅ Votre demande de Carte Canadienne du Handicap a été approuvée

[Blue Header with Gov of Canada]
[Green Checkmark Icon]
Félicitations!

Bonjour John Doe,

Nous avons le plaisir de vous informer que votre demande
de Carte Canadienne du Handicap a été approuvée.

[Green Box]
Prochaines étapes:
• Votre carte sera produite et expédiée dans 10-15 jours
• Vous recevrez un courriel avec le numéro de suivi
• Consultez le statut de votre demande en ligne

[Button: Voir ma demande]

Si vous avez des questions: 1-800-123-4567
```

### Rejection Email Preview

```
From: Carte Canadienne <onboarding@resend.dev>
To: user@example.com
Subject: Mise à jour de votre demande de Carte Canadienne du Handicap

[Blue Header with Gov of Canada]
[Red X Icon]
Mise à jour de votre demande

Bonjour John Doe,

Malheureusement, après examen de votre dossier, nous ne
sommes pas en mesure d'approuver votre demande à ce stade.

[Red Box]
Raison du refus:
Documents incomplets

[Blue Box]
Que faire maintenant?
• Soumettez une nouvelle demande avec les documents requis
• Contactez-nous pour plus d'informations
• Notre équipe: 1-800-123-4567

[Button: Nouvelle demande]
```

## ✅ Success Criteria

Email system is working correctly if:

- ✅ Emails arrive within 1 minute
- ✅ No errors in console
- ✅ All links work
- ✅ Email looks good on desktop and mobile
- ✅ Correct template used (approval vs rejection)
- ✅ User name personalized correctly
- ✅ Admin notes included when provided
- ✅ Resend dashboard shows delivery

## 🎉 You're Done!

If all tests pass, the email notification system is ready for production! 🚀

Need help? Check:

- Terminal logs for errors
- Resend dashboard for delivery status
- EMAIL_NOTIFICATION_SYSTEM.md for detailed docs
