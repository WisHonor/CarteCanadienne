# Document Access Methods - Comparison & Recommendations

## Two Approaches for Making Documents Viewable

### 🔓 Option 1: Public URLs (Current Implementation)

**How it works:**

- Files uploaded with `ACL: 'public-read'`
- URLs work forever: `https://bucket.s3.region.amazonaws.com/documents/file.jpg`
- Anyone with the URL can view the document

**Pros:**
✅ Simple implementation
✅ URLs never expire
✅ Easy to share and embed
✅ No additional API calls needed

**Cons:**
❌ Anyone with URL can access (security concern)
❌ Requires making S3 bucket public
❌ URLs can be shared/leaked
❌ No access control

**Best for:**

- Public documents
- Marketing materials
- Non-sensitive content

**AWS Configuration Required:**
See `AWS_S3_CONFIGURATION.md`

---

### 🔐 Option 2: Presigned URLs (Recommended for Sensitive Data)

**How it works:**

- Files stay private in S3
- Generate temporary signed URLs when needed
- URLs expire after set time (1 hour, 1 day, etc.)
- Each view request gets a fresh URL

**Pros:**
✅ Much more secure
✅ URLs expire automatically
✅ No need to make bucket public
✅ Better audit trail
✅ Can revoke access anytime

**Cons:**
❌ URLs expire and need regeneration
❌ Requires API call to view document
❌ Slightly more complex

**Best for:**

- Identity documents (IDs, passports)
- Medical records
- Sensitive personal information
- **Your use case!** ⭐

**AWS Configuration:**
No special configuration needed! Works with default private bucket.

---

## 🎯 Recommendation for Your Application

### **Use Presigned URLs** because:

1. **Identity documents are sensitive** (passports, IDs, driver's licenses)
2. **Medical records are protected** (privacy laws like HIPAA, PIPEDA)
3. **Security best practice** for healthcare/government applications
4. **Compliance ready** for regulatory requirements

---

## 📋 Implementation Comparison

### Current (Public URLs):

```typescript
// Upload returns permanent public URL
const url = `https://bucket.s3.region.amazonaws.com/${key}`;
// URL works forever, anyone can access
```

### Presigned URLs:

```typescript
// Upload stores S3 key in database
const s3Key = `documents/identity-123.jpg`;

// Generate temporary URL when viewing
const presignedUrl = await getSignedUrl(command, { expiresIn: 3600 });
// URL expires in 1 hour
```

---

## 🔄 Migration Path

### To switch to Presigned URLs:

1. **Update upload route** (use `route-presigned.ts.example`)
2. **Add document viewer API** (already created: `/api/get-document-url`)
3. **Update database** to store S3 keys instead of URLs
4. **Update frontend** to fetch presigned URLs before viewing

---

## 💡 Hybrid Approach (Best of Both)

You could use **both**:

- **Presigned URLs** for viewing in-app (secure)
- **Public URLs** for admin/verification dashboard (convenient)

### Implementation:

```typescript
// Store both in database
{
  s3Key: "documents/identity-123.jpg",
  publicUrl: "https://...", // optional
  uploadedAt: "2025-10-15T..."
}

// Generate presigned URL on demand
async function viewDocument(s3Key: string) {
  const url = await fetch(`/api/get-document-url?key=${s3Key}`)
  window.open(url)
}
```

---

## 🚀 Quick Decision Guide

**Choose Public URLs if:**

- Documents are not sensitive
- You need permanent shareable links
- Simplicity is priority

**Choose Presigned URLs if:** ⭐ RECOMMENDED

- Documents contain personal/medical info
- Security and privacy matter
- Regulatory compliance needed
- You want control over access

---

## 📊 Current Status

✅ **Public URL implementation** is active
⚠️ Requires AWS bucket configuration

📦 **Presigned URL implementation** is ready to use:

- Example code: `route-presigned.ts.example`
- Viewer API: `/api/get-document-url` (ready)

---

## 🔧 Want to Switch?

Let me know and I can:

1. Replace the upload route with presigned version
2. Update the save-application API
3. Add document viewer component
4. Update the schema to store S3 keys

**Your choice!** Which approach do you prefer? 🤔
