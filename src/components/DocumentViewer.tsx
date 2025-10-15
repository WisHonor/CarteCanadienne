'use client'
import { useState } from 'react'
import { viewDocument } from '@/lib/s3-helpers'

interface DocumentViewerProps {
    s3Key: string
    label: string
    className?: string
}

/**
 * Component to view documents stored in S3 using presigned URLs
 * Usage: <DocumentViewer s3Key="documents/identity-123.jpg" label="View ID" />
 */
export default function DocumentViewer({ s3Key, label, className = '' }: DocumentViewerProps) {
    const [loading, setLoading] = useState(false)

    const handleView = async () => {
        setLoading(true)
        try {
            await viewDocument(s3Key)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleView}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{label}</span>
                </>
            )}
        </button>
    )
}
