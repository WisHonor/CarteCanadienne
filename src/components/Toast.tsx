'use client'

import { useEffect } from 'react'

interface ToastProps {
    isOpen: boolean
    onClose: () => void
    message: string
    type?: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

export default function Toast({
    isOpen,
    onClose,
    message,
    type = 'info',
    duration = 4000,
}: ToastProps) {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [isOpen, duration, onClose])

    if (!isOpen) return null

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            icon: 'text-green-600',
            text: 'text-green-900',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            icon: 'text-red-600',
            text: 'text-red-900',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            icon: 'text-yellow-600',
            text: 'text-yellow-900',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            icon: 'text-blue-600',
            text: 'text-blue-900',
        },
    }

    const style = styles[type]

    const icons = {
        success: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        error: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    }

    return (
        <div
            className="fixed top-6 right-6 z-50 animate-slideIn"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className={`${style.bg} ${style.border} border-l-4 rounded-lg shadow-2xl max-w-md`}>
                <div className="p-4 flex items-start gap-3">
                    <div className={`${style.icon} flex-shrink-0 mt-0.5`}>
                        {icons[type]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`${style.text} text-sm font-medium leading-relaxed`}>
                            {message}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`${style.icon} flex-shrink-0 hover:opacity-70 transition-opacity`}
                        aria-label="Close notification"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .animate-slideIn {
                    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    )
}
