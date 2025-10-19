'use client'

import { useEffect } from 'react'

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText: string
    cancelText: string
    type?: 'approve' | 'reject'
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    type = 'approve',
}: ConfirmModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const isApprove = type === 'approve'
    const iconColor = isApprove ? 'text-green-600' : 'text-red-600'
    const borderColor = isApprove ? 'border-green-600' : 'border-red-600'
    const buttonColor = isApprove 
        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            {/* Modal */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {/* Header with Icon */}
                <div className={`border-b-4 ${borderColor} p-6`}>
                    <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${isApprove ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                            {isApprove ? (
                                <svg className={`w-7 h-7 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className={`w-7 h-7 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>
                        <h2 id="modal-title" className="text-2xl font-bold text-slate-900">
                            {title}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p id="modal-description" className="text-base text-slate-700 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 bg-slate-50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all font-semibold"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                        className={`flex-1 px-6 py-3 ${buttonColor} text-white rounded-lg focus:outline-none focus:ring-4 transition-all font-semibold shadow-md`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}
