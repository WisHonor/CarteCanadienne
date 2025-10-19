# Email Notification System

## Overview

Automated email notifications are sent to users when their Canadian Accessibility Card application is approved or rejected by an admin.

## 📧 Email Service

**Provider**: [Resend](https://resend.com)

- API Key stored in `.env` as `RESEND_API_KEY`
- SDK: `resend` package (installed via npm)

## 🔔 Notification Triggers

### 1. Application Approved

**Trigger**: Admin clicks "Approve" button
**Sent To**: Applicant's email address
**Subject**:

- FR: "✅ Votre demande de Carte Canadienne du Handicap a été approuvée"
- EN: "✅ Your Canadian Accessibility Card Application Has Been Approved"

**Content Includes**:

- ✅ Success message with green checkmark
- Personalized greeting with applicant's name
- Congratulations and approval confirmation
- Next steps (card production, shipping timeline)
- Link to view application status
- Contact information

### 2. Application Rejected

**Trigger**: Admin clicks "Reject" button
**Sent To**: Applicant's email address
**Subject**:

- FR: "Mise à jour de votre demande de Carte Canadienne du Handicap"
- EN: "Update on Your Canadian Accessibility Card Application"

**Content Includes**:

- ❌ Update notification with red X icon
- Personalized greeting with applicant's name
- Rejection notice
- Admin notes/reason (if provided)
- What to do next (resubmit, contact support)
- Link to submit new application
- Contact information

## 📁 File Structure

```
src/
├── lib/
│   └── email.ts                    # Email service and templates
└── app/
    └── api/
        └── admin/
            └── verify/
                └── route.ts        # Sends email on approve/reject
```

## 🎨 Email Templates

### Design Features

- **Government of Canada branding**
  - Blue gradient header
  - Official colors and styling
  - Government of Canada logo/text

- **Responsive design**
  - Mobile-friendly
  - Max-width: 600px
  - Clean, professional layout

- **Status-specific styling**
  - **Approved**: Green theme (#10b981)
  - **Rejected**: Red theme (#ef4444)

- **Interactive elements**
  - Call-to-action buttons
  - Clickable links
  - Proper spacing and padding

### Email Components

**Approval Email**:

```html
┌─────────────────────────────────┐ │ Gov of Canada (Blue Header) │
├─────────────────────────────────┤ │ ✓ Green Circle Icon │ │ Congratulations! │
│ │ │ Hello [Name], │ │ Your application approved... │ │ │ │
┌─────────────────────────┐ │ │ │ Next Steps (Green Box) │ │ │ │ • Card
production │ │ │ │ • Shipping timeline │ │ │ └─────────────────────────┘ │ │ │ │
[View My Application Button] │ │ │ │ Contact: 1-800-123-4567 │ │ © 2025
Government of Canada │ └─────────────────────────────────┘
```

**Rejection Email**:

```html
┌─────────────────────────────────┐ │ Gov of Canada (Blue Header) │
├─────────────────────────────────┤ │ ✕ Red Circle Icon │ │ Application Update │
│ │ │ Hello [Name], │ │ Unable to approve... │ │ │ │ ┌─────────────────────────┐
│ │ │ Reason (Red Box) │ │ │ │ [Admin Notes] │ │ │ └─────────────────────────┘ │
│ │ │ ┌─────────────────────────┐ │ │ │ What to do next (Blue) │ │ │ │ • Submit
new application│ │ │ │ • Contact support │ │ │ └─────────────────────────┘ │ │ │
│ [New Application Button] │ │ │ │ Contact: 1-800-123-4567 │ │ © 2025
Government of Canada │ └─────────────────────────────────┘
```

## 🔧 Implementation

### Email Service (`src/lib/email.ts`)

**Main Functions**:

1. **`sendEmail(params)`**
   - Sends email via Resend API
   - Parameters: to, subject, html
   - Returns: success status and data/error

2. **`getApprovalEmailTemplate(params)`**
   - Generates approval email HTML
   - Parameters: firstName, lastName, lang ('fr' | 'en')
   - Returns: { subject, html }

3. **`getRejectionEmailTemplate(params)`**
   - Generates rejection email HTML
   - Parameters: firstName, lastName, adminNotes, lang
   - Returns: { subject, html }

### API Integration (`src/app/api/admin/verify/route.ts`)

**Flow**:

```
1. Admin approves/rejects application
2. Update application status in database
3. Fetch user details (name, email)
4. Generate appropriate email template
5. Send email via Resend
6. Log success/error
7. Return response (don't fail if email fails)
```

**Code Example**:

```typescript
// After updating application status
if (status === "APPROVED") {
  const emailTemplate = getApprovalEmailTemplate({
    firstName: user.firstName,
    lastName: user.lastName,
    lang: "fr", // or 'en'
  });

  await sendEmail({
    to: user.email,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
  });
}
```

## 🌐 Bilingual Support

Emails support both French and English:

- Default: French (`lang: 'fr'`)
- Can be changed per user based on their preference
- Full translations for all content
- Language-specific formatting

## ⚙️ Configuration

### Environment Variables

```env
RESEND_API_KEY="re_WMHuX6AZ_8unEr2GjfpHjHeTBnjZNLy2Q"
NEXT_PUBLIC_BASE_URL="http://localhost:3001"  # Optional, for email links
```

### Resend Configuration

**Sender Email**: `onboarding@resend.dev` (default)

⚠️ **For Production**:

1. Verify your own domain in Resend dashboard
2. Update sender email in `src/lib/email.ts`:
   ```typescript
   from: "Carte Canadienne <noreply@yourdomain.ca>";
   ```

## 🧪 Testing

### Test Email Notifications

1. **Login as Admin**:

   ```
   Email: admin@example.com
   Password: admin123
   ```

2. **Create Test Application**:
   - Go to `/demande`
   - Fill out all 3 steps
   - Submit application

3. **Test Approval Email**:
   - Admin dashboard → Click "Examiner"
   - Click "Approuver"
   - Check applicant's email inbox

4. **Test Rejection Email**:
   - Create another application
   - Admin → Reject with notes
   - Check applicant's email inbox

### Check Email Logs

```typescript
// Console logs in verify route:
console.log("Approval email sent to:", user.email);
console.log("Rejection email sent to:", user.email);
console.error("Error sending email:", emailError);
```

### Resend Dashboard

- View sent emails: https://resend.com/emails
- Check delivery status
- View email content
- Track opens/clicks (if enabled)

## 🚨 Error Handling

### Email Send Failures

- **Error is caught and logged**
- **Request still succeeds** (application status updated)
- **User sees success message** (they don't know email failed)
- **Admin can check logs** to see email errors

**Rationale**:
Application status update is critical, email is secondary. If email fails, admin can manually contact user.

### Common Issues

1. **Invalid Resend API Key**:

   ```
   Error: Invalid API key
   ```

   Solution: Check `.env` file

2. **Rate Limiting**:

   ```
   Error: Rate limit exceeded
   ```

   Solution: Upgrade Resend plan or wait

3. **Invalid Email Address**:

   ```
   Error: Invalid recipient email
   ```

   Solution: Validate email on form submission

4. **Network Issues**:
   ```
   Error: Failed to fetch
   ```
   Solution: Check internet connection, retry

## 📊 Email Analytics

### Resend Dashboard Metrics

- Total emails sent
- Delivery rate
- Open rate (if tracking enabled)
- Click rate (if tracking enabled)
- Bounce rate
- Spam complaints

### Custom Tracking

Can add tracking parameters to links:

```typescript
href =
  "${baseUrl}/application/check-status?utm_source=email&utm_campaign=approved";
```

## 🔐 Security & Privacy

### Best Practices

✅ No sensitive data in email subject  
✅ Application ID not included (use email link)  
✅ Admin notes sanitized (HTML escaped)  
✅ Secure HTTPS links only  
✅ "Do not reply" notice included  
✅ Unsubscribe link (optional, can add)

### GDPR/Privacy Compliance

- ✅ Only send to applicant's email
- ✅ Don't CC or BCC anyone
- ✅ Include government privacy notice
- ✅ Allow users to manage preferences (future)

## 🚀 Future Enhancements

### Phase 2

- [ ] User language preference storage
- [ ] Email notification preferences (opt-in/out)
- [ ] SMS notifications (via Twilio)
- [ ] Real-time push notifications
- [ ] Email templates in database (editable)

### Phase 3

- [ ] Scheduled reminder emails
- [ ] Status update notifications (when admin views)
- [ ] Document expiry reminders
- [ ] Batch email sending
- [ ] Email scheduling/delays

### Phase 4

- [ ] Rich email analytics dashboard
- [ ] A/B testing for email templates
- [ ] Personalized email content
- [ ] Attachment support (PDF card)
- [ ] Branded email domain

## 📝 Maintenance

### Update Email Templates

1. Edit `src/lib/email.ts`
2. Modify HTML in `getApprovalEmailTemplate` or `getRejectionEmailTemplate`
3. Test with development email
4. Deploy to production

### Change Sender Email

1. Verify domain in Resend
2. Update `from` field in `sendEmail` function
3. Test delivery

### Add New Email Types

```typescript
export function getNewEmailTemplate(params) {
  return {
    subject: "Subject line",
    html: `<html>...</html>`,
  };
}
```

## ✅ Testing Checklist

- [ ] Approval email sends successfully
- [ ] Rejection email sends successfully
- [ ] User receives email in inbox (not spam)
- [ ] Links in email work correctly
- [ ] Email displays properly on desktop
- [ ] Email displays properly on mobile
- [ ] French version correct
- [ ] English version correct (if used)
- [ ] Admin notes display in rejection email
- [ ] No email failure blocks application update
- [ ] Email logs appear in console
- [ ] Resend dashboard shows delivery

## 🎉 Summary

Email notifications are now fully implemented! When admins approve or reject applications:

1. ✅ Application status updates in database
2. ✅ Professional email sent to applicant
3. ✅ Email includes relevant information and next steps
4. ✅ Links to application portal included
5. ✅ Bilingual support (FR/EN)
6. ✅ Government-themed design
7. ✅ Error handling (doesn't break application flow)

Users will receive timely notifications about their application status via email! 📧✨
