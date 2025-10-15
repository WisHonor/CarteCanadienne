/**
 * Helper functions for working with S3 documents using presigned URLs
 */

/**
 * Generate a presigned URL for viewing a document
 * @param s3Key - The S3 key (e.g., "documents/identity-123.jpg")
 * @returns Promise with the presigned URL
 */
export async function getDocumentViewUrl(s3Key: string): Promise<string> {
    const response = await fetch(`/api/get-document-url?key=${encodeURIComponent(s3Key)}`)
    
    if (!response.ok) {
        throw new Error('Failed to generate document URL')
    }
    
    const data = await response.json()
    return data.url
}

/**
 * Open a document in a new tab using a presigned URL
 * @param s3Key - The S3 key (e.g., "documents/identity-123.jpg")
 */
export async function viewDocument(s3Key: string): Promise<void> {
    try {
        const url = await getDocumentViewUrl(s3Key)
        window.open(url, '_blank')
    } catch (error) {
        console.error('Failed to view document:', error)
        alert('Failed to load document. Please try again.')
    }
}

/**
 * Download a document using a presigned URL
 * @param s3Key - The S3 key (e.g., "documents/identity-123.jpg")
 * @param filename - Optional custom filename for download
 */
export async function downloadDocument(s3Key: string, filename?: string): Promise<void> {
    try {
        const url = await getDocumentViewUrl(s3Key)
        
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = url
        link.download = filename || s3Key.split('/').pop() || 'document'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Failed to download document:', error)
        alert('Failed to download document. Please try again.')
    }
}
