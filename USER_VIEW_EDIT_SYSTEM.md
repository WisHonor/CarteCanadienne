# User Application View & Edit System

## Overview

Users can now view and edit their submitted applications. The system includes:

1. **Check Status Page** (`/application/check-status`)

   - Users enter their email address
   - System validates and looks up their application
   - Redirects to view page

2. **View Application Page** (`/application/view`)

   - Shows complete application details
   - Displays current status (PENDING/APPROVED/REJECTED)
   - Shows all personal info, disabilities, services, documents
   - Allows editing ONLY if status is PENDING

3. **Edit Flow**
   - When user clicks "Edit My Application":
     - Loads existing data into sessionStorage
     - Sets `editing-application-id` flag
     - Redirects to Step 3 (document upload)
   - User can re-upload documents or keep existing ones
   - On submit, updates the existing application
   - Redirects back to view page

## Routes

### /application/check-status

Entry point for users to find their application by email.

**Features:**

- Email input form with validation
- Calls `/api/application/status?email=...`
- Redirects to `/application/view?email=...`
- Government theme with bilingual support

### /application/view?email=...

Full application view with edit capability.

**Features:**

- Fetches application by email from URL
- Displays status badge (pending/approved/rejected)
- Shows all application details in sections:
  - Status banner with color-coded icons
  - Application ID and submission date
  - Personal information
  - Disabilities and services (as tags)
  - Documents with view buttons (presigned URLs)
  - Admin notes (if rejected)
- Edit button (only for PENDING applications)
- Cannot edit APPROVED or REJECTED applications
- New application button for rejected applications

**Edit Flow:**

1. Loads existing data into sessionStorage (step1, step2)
2. Sets `editing-application-id` flag
3. Redirects to `/demande/etape-3`
4. User uploads new documents (or keeps existing)
5. On submit, includes `applicationId` in request
6. API updates existing application (via upsert)
7. Redirects back to view page

## API Integration

### Existing APIs Used:

- `GET /api/application/status?email=...` - Fetch application
- `GET /api/get-document-url?key=...` - Get presigned URLs
- `POST /api/save-application` - Save/update application

### Save Application Updates:

The existing `/api/save-application` already uses `upsert`, so it automatically handles both new and updated applications:

```typescript
// Existing code in /api/save-application
const application = await prisma.application.upsert({
  where: { userId: user.id },
  update: {
    disabilities: JSON.stringify(disabilities),
    services: JSON.stringify(services),
    otherText: otherText || null,
    details: details || null,
    identityDocUrl,
    medicalDocUrl,
    updatedAt: new Date(),
  },
  create: {
    userId: user.id,
    disabilities: JSON.stringify(disabilities),
    services: JSON.stringify(services),
    otherText: otherText || null,
    details: details || null,
    identityDocUrl,
    medicalDocUrl,
    status: "PENDING",
  },
});
```

**Note:** When updating an application, the status remains unchanged unless admin has already approved/rejected. User edits to PENDING applications keep them as PENDING.

## Business Rules

### Editing Permissions:

- ✅ **PENDING**: User can edit freely
- ❌ **APPROVED**: Cannot edit (shows message)
- ❌ **REJECTED**: Cannot edit (shows "New Application" button)

### Status Changes:

- User edits do NOT change status
- Only admin can change status (PENDING → APPROVED/REJECTED)
- If user edits a PENDING application, it stays PENDING
- Admin must re-review edited applications

### Admin Dashboard Impact:

- User edits update `updatedAt` timestamp
- Admin dashboard can sort by `updatedAt` to see recently modified applications
- Admin can see the updated information immediately on refresh
- No real-time updates (refresh needed to see changes)

## User Experience

### Happy Path:

1. User submits application → Status is PENDING
2. User checks status via email → Sees application
3. User realizes they made a mistake → Clicks "Edit"
4. User re-uploads correct documents → Submits
5. Application updates, status remains PENDING
6. Admin reviews updated application → Approves/Rejects

### Edge Cases:

1. **Application already approved**: User cannot edit, sees success message
2. **Application rejected**: User sees rejection reason, can start new application
3. **User edits while admin is reviewing**: Last update wins (race condition)
4. **Invalid email**: Check status shows error
5. **Application not found**: Shows error message

## Technical Details

### SessionStorage Keys:

- `demande-step1`: Step 1 form data (personal info)
- `demande-step2`: Step 2 form data (disabilities/services)
- `editing-application-id`: Flag indicating edit mode (set when clicking "Edit")

### Flow Detection:

```typescript
// In Step 3 (etape-3/page.tsx)
const editingApplicationId = sessionStorage.getItem("editing-application-id");

if (editingApplicationId) {
  // Edit mode: update existing application
  // Redirect to view page after submit
} else {
  // New application: create new
  // Redirect to verification-status after submit
}
```

### Data Pre-population:

When user clicks "Edit", the view page pre-populates sessionStorage:

```typescript
const step1Data = {
  prenom: application.user.firstName,
  nom: application.user.lastName,
  courriel: application.user.email,
  // ... all step 1 fields
};

const step2Data = {
  disabilities: application.disabilities,
  services: application.services,
  otherText: application.otherText,
  details: application.details,
};

sessionStorage.setItem("demande-step1", JSON.stringify(step1Data));
sessionStorage.setItem("demande-step2", JSON.stringify(step2Data));
sessionStorage.setItem("editing-application-id", application.id);
```

## Future Enhancements

### Potential Improvements:

1. **Email Notifications**: Notify user when status changes
2. **Edit History**: Track application revisions
3. **Partial Edits**: Allow editing specific sections instead of only documents
4. **Real-time Updates**: WebSocket for admin dashboard to see changes instantly
5. **Admin Alerts**: Notify admin when user edits a PENDING application
6. **Status Reset Option**: Allow admin to reset APPROVED/REJECTED to PENDING if user needs to update

### Security Considerations:

- Add authentication (currently TODO)
- Rate limit status checks
- Validate email ownership before showing application
- Add CAPTCHA to prevent automated lookups
- Audit log for all application changes

## Testing Checklist

- [ ] User can check status by email
- [ ] User sees correct status badge (PENDING/APPROVED/REJECTED)
- [ ] User can view documents (presigned URLs work)
- [ ] User can edit PENDING application
- [ ] User cannot edit APPROVED application
- [ ] User cannot edit REJECTED application
- [ ] Edit flow pre-populates existing data
- [ ] Edit flow updates application (not creates new)
- [ ] Edit flow redirects back to view page
- [ ] Admin dashboard shows updated applications
- [ ] Invalid email shows error
- [ ] Application not found shows error

## Files Created/Modified

### Created:

1. `src/app/application/check-status/page.tsx` - Email lookup form
2. `src/app/application/view/page.tsx` - Full application view with edit

### Modified:

1. `src/app/(application)/demande/etape-3/page.tsx` - Added edit mode support

### Existing (No Changes Needed):

- `/api/application/status` - Already supports email query
- `/api/save-application` - Already uses upsert
- Admin dashboard - Already shows all applications
- Admin review page - Already shows full details
