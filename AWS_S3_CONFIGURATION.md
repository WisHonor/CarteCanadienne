# AWS S3 Bucket Configuration for Public Document Access

## Current Status

✅ Code updated to set `ACL: 'public-read'` on uploaded files

## AWS Console Configuration Required

To make the documents viewable via direct URLs, you need to configure your S3 bucket:

### Step 1: Disable "Block Public Access"

1. Go to AWS Console: https://console.aws.amazon.com/s3/
2. Click on your bucket: `cartecanadiennebucket`
3. Go to the **Permissions** tab
4. Find **Block public access (bucket settings)**
5. Click **Edit**
6. **Uncheck** all 4 options:
   - ☐ Block all public access
   - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
   - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
7. Click **Save changes**
8. Type `confirm` and click **Confirm**

### Step 2: Add Bucket Policy (Recommended)

1. Still in the **Permissions** tab
2. Scroll down to **Bucket policy**
3. Click **Edit**
4. Paste this policy (replace `cartecanadiennebucket` with your bucket name if different):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cartecanadiennebucket/documents/*"
    }
  ]
}
```

5. Click **Save changes**

### Step 3: Enable ACLs (if needed)

1. In the **Permissions** tab
2. Find **Object Ownership**
3. Click **Edit**
4. Select **ACLs enabled**
5. Select **Bucket owner preferred**
6. Check the acknowledgment box
7. Click **Save changes**

## Testing

After configuration, your document URLs will work like this:

```
https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/documents/identity-1234567890-abc123.jpg
```

You can paste this URL directly in your browser and see the document!

## Security Considerations

### ⚠️ Important Notes:

1. **Public Access**: Documents will be publicly accessible by anyone with the URL
2. **Secure URLs**: Consider using **presigned URLs** for sensitive documents (see alternative below)
3. **Folder Structure**: Only `/documents/*` folder is public, not the entire bucket

## Alternative: Presigned URLs (More Secure)

If you want documents to be viewable but more secure, use presigned URLs instead:

### Benefits:

- URLs expire after a set time (e.g., 1 hour, 1 day)
- No need to make bucket public
- Better security for sensitive documents

### Implementation:

I can update the code to generate presigned URLs instead if you prefer this approach.

Would you like me to implement presigned URLs instead?

## Current Configuration

**Region**: us-east-2
**Bucket**: cartecanadiennebucket
**Path**: documents/[filename]
**Access**: Public Read (after AWS configuration)

---

**Next Steps**:

1. Configure AWS S3 bucket as described above
2. Test by uploading a document
3. Copy the URL and paste in browser
4. Document should be visible! 🎉
