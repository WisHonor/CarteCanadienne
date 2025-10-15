# 📋 Quick Reference - Presigned URLs

## 🚀 Quick Start

### View a Document

```tsx
import DocumentViewer from "@/components/DocumentViewer";

<DocumentViewer s3Key="documents/identity-123.jpg" label="View Document" />;
```

### Open Document Programmatically

```typescript
import { viewDocument } from "@/lib/s3-helpers";

await viewDocument("documents/identity-123.jpg");
```

### Get Presigned URL

```typescript
import { getDocumentViewUrl } from "@/lib/s3-helpers";

const url = await getDocumentViewUrl("documents/medical-456.pdf");
// Use in <img>, <iframe>, or window.open()
```

---

## 📡 API Endpoints

### Upload Document

```bash
POST /api/upload-documents
Content-Type: multipart/form-data

file: [File]
type: "identity" | "medical"

Response:
{
  "success": true,
  "url": "https://...?X-Amz-Signature=...",  // 7 days
  "s3Key": "documents/identity-123.jpg",
  "fileName": "identity-123.jpg"
}
```

### Get Document URL

```bash
GET /api/get-document-url?key=documents/identity-123.jpg

Response:
{
  "url": "https://...?X-Amz-Signature=...",  // 1 hour
  "expiresIn": 3600
}
```

---

## 🎯 Common Patterns

### Admin Dashboard

```tsx
function ApplicationCard({ app }) {
  return (
    <div>
      <DocumentViewer s3Key={app.identityDocUrl} label="View ID" />
      <DocumentViewer s3Key={app.medicalDocUrl} label="View Medical" />
    </div>
  );
}
```

### Download Document

```typescript
import { downloadDocument } from "@/lib/s3-helpers";

await downloadDocument("documents/identity-123.jpg", "document.jpg");
```

### Custom Viewer

```tsx
function MyViewer({ s3Key }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    getDocumentViewUrl(s3Key).then(setUrl);
  }, [s3Key]);

  return <img src={url} alt="Document" />;
}
```

---

## 🔐 Security

- ✅ Files private in S3
- ✅ URLs expire (1 hour)
- ✅ No bucket config needed
- ✅ S3 keys in database

---

## 📝 S3 Key Format

```
documents/[type]-[timestamp]-[random].[ext]

Examples:
documents/identity-1729012345-abc123.jpg
documents/medical-1729012345-xyz789.pdf
```

---

## 🧪 Testing

### Demo Page

http://localhost:3002/demo/document-viewer

### Test Upload

http://localhost:3002/demande/etape-3

---

## 🆘 Troubleshooting

**URL doesn't work**
→ URLs expire after 1 hour - generate new one

**"Failed to generate URL"**
→ Check AWS credentials in `.env`

**"Access Denied"**
→ AWS key needs `s3:GetObject` permission

---

## 📚 Full Documentation

- `PRESIGNED_URLS_COMPLETE.md` - Complete guide
- `MIGRATION_SUMMARY.md` - Implementation summary
- `DOCUMENT_ACCESS_COMPARISON.md` - Security comparison

---

**Quick Test:**

```typescript
// In browser console
import { viewDocument } from "@/lib/s3-helpers";
await viewDocument("documents/test-123.jpg");
```

✅ **Done!** You're ready to use presigned URLs!
