'use client'
import { useState } from 'react'
import DocumentViewer from '@/components/DocumentViewer'
import { viewDocument, getDocumentViewUrl } from '@/lib/s3-helpers'

/**
 * Demo page showing how to use presigned URLs to view documents
 * Access at: /demo/document-viewer
 */
export default function DocumentViewerDemo() {
    const [s3Key, setS3Key] = useState('documents/identity-1729012345-abc123.jpg')
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleGenerateUrl = async () => {
        setLoading(true)
        try {
            const url = await getDocumentViewUrl(s3Key)
            setGeneratedUrl(url)
        } catch (error) {
            alert('Failed to generate URL')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    📄 Document Viewer Demo
                </h1>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">1. Using the Component</h2>
                        <p className="text-gray-600 mb-4">
                            The easiest way to view documents - just pass the S3 key:
                        </p>
                        <div className="bg-gray-50 p-4 rounded border">
                            <DocumentViewer 
                                s3Key={s3Key}
                                label="View Document"
                            />
                        </div>
                        <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<DocumentViewer 
  s3Key="${s3Key}"
  label="View Document"
/>`}
                        </pre>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">2. Using the Helper Function</h2>
                        <p className="text-gray-600 mb-4">
                            Programmatically open documents:
                        </p>
                        <div className="bg-gray-50 p-4 rounded border">
                            <button
                                onClick={() => viewDocument(s3Key)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Open in New Tab
                            </button>
                        </div>
                        <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`await viewDocument('${s3Key}')`}
                        </pre>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">3. Generate Presigned URL</h2>
                        <p className="text-gray-600 mb-4">
                            Get the URL to use in img tags, iframes, etc:
                        </p>
                        <div className="bg-gray-50 p-4 rounded border space-y-4">
                            <input
                                type="text"
                                value={s3Key}
                                onChange={(e) => setS3Key(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Enter S3 key"
                            />
                            <button
                                onClick={handleGenerateUrl}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Generate URL'}
                            </button>
                            {generatedUrl && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-green-700">
                                        ✅ URL generated! Valid for 1 hour
                                    </p>
                                    <textarea
                                        readOnly
                                        value={generatedUrl}
                                        className="w-full h-24 px-3 py-2 border rounded text-xs font-mono"
                                    />
                                    <a
                                        href={generatedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Open URL
                                    </a>
                                </div>
                            )}
                        </div>
                        <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`const url = await getDocumentViewUrl('${s3Key}')
// url = "https://bucket.s3.region.amazonaws.com/...?X-Amz-Signature=..."`}
                        </pre>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">📚 Common S3 Key Patterns</h2>
                        <div className="space-y-2 text-sm">
                            <p className="font-mono bg-gray-50 p-2 rounded">
                                documents/identity-1729012345-abc123.jpg
                            </p>
                            <p className="font-mono bg-gray-50 p-2 rounded">
                                documents/medical-1729012345-xyz789.pdf
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">🔒 Security Notes</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>URLs expire after 1 hour automatically</li>
                            <li>Files are private in S3 (not publicly accessible)</li>
                            <li>Each view request generates a fresh URL</li>
                            <li>No bucket configuration needed</li>
                            <li>S3 keys stored in database, not URLs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
