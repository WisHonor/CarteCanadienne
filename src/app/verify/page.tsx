'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyContent() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get('name');
  const cardId = searchParams.get('id');
  const expires = searchParams.get('expires');
  const hasMobility = searchParams.get('mobility') === '1';
  const hasSupport = searchParams.get('support') === '1';
  const hasAnimal = searchParams.get('animal') === '1';

  if (!name || !cardId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid QR Code</h1>
          <p className="text-gray-600">This QR code does not contain valid card information.</p>
        </div>
      </div>
    );
  }

  const services = [];
  if (hasMobility) services.push('Mobility Aid Access');
  if (hasSupport) services.push('Support Person Access');
  if (hasAnimal) services.push('Service Animal Access');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">✅</div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Valid Card</h1>
          <p className="text-gray-600">Canadian Accessibility Card</p>
        </div>

        {/* Card Information */}
        <div className="space-y-4 border-t border-b border-gray-200 py-6">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Cardholder Name</p>
            <p className="text-xl font-semibold text-gray-900">{name}</p>
          </div>

          {/* Card ID */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Card ID</p>
            <p className="text-lg font-mono text-gray-900">{cardId?.substring(0, 8).toUpperCase()}</p>
          </div>

          {/* Expiration */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Valid Until</p>
            <p className="text-lg font-semibold text-gray-900">{expires}</p>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Authorized Services</p>
            <div className="space-y-2">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-900">{service}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No services authorized</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This is an official Canadian Accessibility Card</p>
          <p className="mt-2">Scanned on {new Date().toLocaleDateString('en-CA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
