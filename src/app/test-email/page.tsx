'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Email Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test if your Resend email configuration is working
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Test Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={sendTestEmail}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>

          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">
                  {result.success ? '✅' : '❌'}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-2 ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.success ? 'Success!' : 'Error'}
                  </h3>
                  <p
                    className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.message || result.error}
                  </p>
                  {result.details && (
                    <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                  {result.success && (
                    <div className="mt-3 text-sm text-green-700">
                      <p>✅ Check your inbox (and spam folder)</p>
                      <p>✅ If you received it, emails are working!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Troubleshooting</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check if RESEND_API_KEY is set in .env</li>
              <li>• Verify your Resend account is active</li>
              <li>• Check Resend dashboard for logs</li>
              <li>• Look for emails in spam folder</li>
              <li>• Default sender is onboarding@resend.dev (test only)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
