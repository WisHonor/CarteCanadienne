'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ConfirmModal from '@/components/ConfirmModal'
import Toast from '@/components/Toast'

type Lang = 'fr' | 'en'

const translations = {
    fr: {
        gc: 'Gouvernement du Canada',
        svc: "Service de la Carte d'accessibilité",
        langToggle: 'English',
        title: 'Examen de la demande',
        loading: 'Chargement...',
        error: 'Erreur lors du chargement de la demande.',
        backToDashboard: 'Retour au tableau de bord',
        
        // Applicant Info
        applicantInfo: 'Informations du demandeur',
        name: 'Nom',
        email: 'Courriel',
        phone: 'Téléphone',
        dateOfBirth: 'Date de naissance',
        address: 'Adresse',
        
        // Application Details
        applicationDetails: 'Détails de la demande',
        submittedOn: 'Soumis le',
        applicationId: 'ID de la demande',
        currentStatus: 'Statut actuel',
        disabilities: 'Handicaps',
        services: 'Services requis',
        otherInfo: 'Autres informations',
        additionalDetails: 'Détails supplémentaires',
        
        // Documents
        documents: 'Documents',
        identityDoc: 'Preuve d\'identité',
        medicalDoc: 'Preuve médicale',
        viewDoc: 'Voir',
        downloading: 'Chargement...',
        
        // Actions
        adminActions: 'Actions administratives',
        adminNotes: 'Notes administratives (optionnel)',
        adminNotesPlaceholder: 'Ajouter des notes concernant cette décision...',
        approve: 'Approuver',
        reject: 'Rejeter',
        confirmApprove: 'Êtes-vous sûr de vouloir approuver cette demande?',
        confirmReject: 'Êtes-vous sûr de vouloir rejeter cette demande?',
        confirmApproveTitle: 'Confirmer l\'approbation',
        confirmRejectTitle: 'Confirmer le rejet',
        confirmApproveMessage: 'Cette action approuvera la demande et enverra un courriel de confirmation au demandeur. Voulez-vous continuer?',
        confirmRejectMessage: 'Cette action rejettera la demande et enverra un courriel de notification au demandeur. Voulez-vous continuer?',
        confirmButton: 'Confirmer',
        cancelButton: 'Annuler',
        
        // Status
        statusPending: 'En attente',
        statusApproved: 'Approuvé',
        statusRejected: 'Rejeté',
        
        // Success/Error
        successApproved: 'Demande approuvée avec succès',
        successRejected: 'Demande rejetée avec succès',
        errorVerify: 'Erreur lors de la vérification de la demande',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        title: 'Application Review',
        loading: 'Loading...',
        error: 'Error loading application.',
        backToDashboard: 'Back to Dashboard',
        
        // Applicant Info
        applicantInfo: 'Applicant Information',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        dateOfBirth: 'Date of Birth',
        address: 'Address',
        
        // Application Details
        applicationDetails: 'Application Details',
        submittedOn: 'Submitted On',
        applicationId: 'Application ID',
        currentStatus: 'Current Status',
        disabilities: 'Disabilities',
        services: 'Services Required',
        otherInfo: 'Other Information',
        additionalDetails: 'Additional Details',
        
        // Documents
        documents: 'Documents',
        identityDoc: 'Proof of Identity',
        medicalDoc: 'Medical Proof',
        viewDoc: 'View',
        downloading: 'Loading...',
        
        // Actions
        adminActions: 'Admin Actions',
        adminNotes: 'Admin Notes (optional)',
        adminNotesPlaceholder: 'Add notes regarding this decision...',
        approve: 'Approve',
        reject: 'Reject',
        confirmApprove: 'Are you sure you want to approve this application?',
        confirmReject: 'Are you sure you want to reject this application?',
        confirmApproveTitle: 'Confirm Approval',
        confirmRejectTitle: 'Confirm Rejection',
        confirmApproveMessage: 'This action will approve the application and send a confirmation email to the applicant. Do you want to continue?',
        confirmRejectMessage: 'This action will reject the application and send a notification email to the applicant. Do you want to continue?',
        confirmButton: 'Confirm',
        cancelButton: 'Cancel',
        
        // Status
        statusPending: 'Pending',
        statusApproved: 'Approved',
        statusRejected: 'Rejected',
        
        // Success/Error
        successApproved: 'Application approved successfully',
        successRejected: 'Application rejected successfully',
        errorVerify: 'Error verifying application',
    },
}

interface ApplicationData {
    id: string
    status: string
    createdAt: string
    disabilities: string[]
    services: string[]
    otherText: string
    details: string
    identityDocUrl: string
    medicalDocUrl: string
    adminNotes: string | null
    user: {
        firstName: string
        lastName: string
        email: string
        phone: string
        dateOfBirth: string
        address: {
            line1: string
            line2: string | null
            city: string
            province: string
            postalCode: string
        }
    }
}

export default function AdminVerificationPage() {
    const router = useRouter()
    const params = useParams()
    const applicationId = params.id as string

    const [lang, setLang] = useState<Lang>('fr')
    const [mounted, setMounted] = useState(false)
    const [application, setApplication] = useState<ApplicationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [adminNotes, setAdminNotes] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [viewingDoc, setViewingDoc] = useState<{ identity: boolean; medical: boolean }>({
        identity: false,
        medical: false,
    })
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        type: 'APPROVED' | 'REJECTED' | null
    }>({
        isOpen: false,
        type: null,
    })
    const [toast, setToast] = useState<{
        isOpen: boolean
        message: string
        type: 'success' | 'error' | 'info' | 'warning'
    }>({
        isOpen: false,
        message: '',
        type: 'info',
    })

    const t = (key: keyof typeof translations.fr) => translations[lang][key]

    // Check authentication
    useEffect(() => {
        const adminToken = sessionStorage.getItem('admin-token')
        if (!adminToken) {
            router.push('/admin/login')
            return
        }
        setIsAuthenticated(true)
    }, [router])

    useEffect(() => {
        const saved = (localStorage.getItem('lang') as Lang) || 'fr'
        setLang(saved)
        document.documentElement.lang = saved
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && applicationId && isAuthenticated) {
            fetchApplication()
        }
    }, [mounted, applicationId, isAuthenticated])

    const fetchApplication = async () => {
        try {
            const token = sessionStorage.getItem('admin-token')
            const response = await fetch(`/api/admin/applications/${applicationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            
            if (response.status === 401) {
                sessionStorage.removeItem('admin-token')
                sessionStorage.removeItem('admin-user')
                router.push('/admin/login')
                return
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch application')
            }

            const data = await response.json()
            setApplication(data)
            setAdminNotes(data.adminNotes || '')
        } catch (err) {
            console.error('Error fetching application:', err)
            setError(t('error'))
        } finally {
            setLoading(false)
        }
    }

    const viewDocument = async (s3Key: string, type: 'identity' | 'medical') => {
        setViewingDoc(prev => ({ ...prev, [type]: true }))
        try {
            const response = await fetch(`/api/get-document-url?key=${encodeURIComponent(s3Key)}`)
            if (!response.ok) {
                throw new Error('Failed to get document URL')
            }

            const data = await response.json()
            window.open(data.url, '_blank')
        } catch (err) {
            console.error('Error viewing document:', err)
            setToast({
                isOpen: true,
                message: lang === 'fr' ? 'Échec de l\'ouverture du document. Veuillez réessayer.' : 'Failed to open document. Please try again.',
                type: 'error',
            })
        } finally {
            setViewingDoc(prev => ({ ...prev, [type]: false }))
        }
    }

    const handleVerify = async (status: 'APPROVED' | 'REJECTED') => {
        setSubmitting(true)
        try {
            console.log('Sending verification request:', {
                applicationId,
                status,
                adminNotes: adminNotes.trim() || null,
            })

            const token = sessionStorage.getItem('admin-token')
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    applicationId,
                    status,
                    adminNotes: adminNotes.trim() || null,
                }),
            })

            console.log('Response status:', response.status)
            const responseData = await response.json()
            console.log('Response data:', responseData)

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to verify application')
            }

            setToast({
                isOpen: true,
                message: status === 'APPROVED' ? t('successApproved') : t('successRejected'),
                type: 'success',
            })
            
            // Redirect after showing success message
            setTimeout(() => {
                router.push('/admin')
            }, 1500)
        } catch (err) {
            console.error('Error verifying application:', err)
            setToast({
                isOpen: true,
                message: t('errorVerify') + ': ' + (err instanceof Error ? err.message : 'Unknown error'),
                type: 'error',
            })
        } finally {
            setSubmitting(false)
        }
    }

    const openConfirmModal = (type: 'APPROVED' | 'REJECTED') => {
        setConfirmModal({ isOpen: true, type })
    }

    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, type: null })
    }

    const confirmVerify = () => {
        if (confirmModal.type) {
            handleVerify(confirmModal.type)
        }
    }

    const toggleLang = () => {
        setLang(prev => {
            const next = prev === 'fr' ? 'en' : 'fr'
            localStorage.setItem('lang', next)
            document.documentElement.lang = next
            return next
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-900 border border-yellow-200">
                        {t('statusPending')}
                    </span>
                )
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-900 border border-green-200">
                        {t('statusApproved')}
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-900 border border-red-200">
                        {t('statusRejected')}
                    </span>
                )
            default:
                return null
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header role="banner" className="bg-white shadow-sm border-b-4 border-blue-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center" aria-hidden="true">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">{t('gc')}</p>
                                <p className="text-sm text-slate-800 font-semibold">{t('svc')}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={toggleLang}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                        >
                            <span className="text-lg" aria-hidden="true">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
                            {translations[lang].langToggle}
                        </button>
                    </div>

                    <div className="py-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
                        <button
                            onClick={() => router.push('/admin')}
                            className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
                        >
                            ← {t('backToDashboard')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main role="main" className="flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    {loading ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700 mx-auto"></div>
                            <p className="mt-6 text-lg text-slate-700 font-medium">{t('loading')}</p>
                        </div>
                    ) : error || !application ? (
                        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-red-600">
                            <p className="text-red-800">{error || t('error')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Application Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Applicant Info */}
                                <section className="bg-white rounded-xl shadow-md p-8 border-l-4 border-blue-700">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6">{t('applicantInfo')}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('name')}</p>
                                            <p className="text-base font-semibold text-slate-900">
                                                {application.user.firstName} {application.user.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('email')}</p>
                                            <p className="text-base text-slate-900">{application.user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('phone')}</p>
                                            <p className="text-base text-slate-900">{application.user.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('dateOfBirth')}</p>
                                            <p className="text-base text-slate-900">
                                                {new Date(application.user.dateOfBirth).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA')}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('address')}</p>
                                            <p className="text-base text-slate-900">
                                                {application.user.address.line1}
                                                {application.user.address.line2 && `, ${application.user.address.line2}`}
                                                <br />
                                                {application.user.address.city}, {application.user.address.province} {application.user.address.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Application Details */}
                                <section className="bg-white rounded-xl shadow-md p-8 border-l-4 border-indigo-600">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6">{t('applicationDetails')}</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('applicationId')}</p>
                                                <p className="text-sm font-mono text-slate-900 break-all">{application.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('submittedOn')}</p>
                                                <p className="text-base text-slate-900">
                                                    {new Date(application.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {application.disabilities.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-2">{t('disabilities')}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {application.disabilities.map((disability, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-medium"
                                                        >
                                                            {disability}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {application.services.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-2">{t('services')}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {application.services.map((service, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-sm font-medium"
                                                        >
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {application.otherText && (
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('otherInfo')}</p>
                                                <p className="text-base text-slate-900">{application.otherText}</p>
                                            </div>
                                        )}

                                        {application.details && (
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-1">{t('additionalDetails')}</p>
                                                <p className="text-base text-slate-900 whitespace-pre-wrap">{application.details}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Documents */}
                                <section className="bg-white rounded-xl shadow-md p-8 border-l-4 border-purple-600">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6">{t('documents')}</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-slate-900 text-lg">{t('identityDoc')}</span>
                                            </div>
                                            <button
                                                onClick={() => viewDocument(application.identityDocUrl, 'identity')}
                                                disabled={viewingDoc.identity}
                                                className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors text-sm font-semibold"
                                            >
                                                {viewingDoc.identity ? t('downloading') : t('viewDoc')}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-slate-900 text-lg">{t('medicalDoc')}</span>
                                            </div>
                                            <button
                                                onClick={() => viewDocument(application.medicalDocUrl, 'medical')}
                                                disabled={viewingDoc.medical}
                                                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-semibold"
                                            >
                                                {viewingDoc.medical ? t('downloading') : t('viewDoc')}
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column - Admin Actions */}
                            <div className="space-y-6">
                                {/* Current Status */}
                                <section className="bg-white rounded-xl shadow-md p-6 border-l-4 border-slate-700">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('currentStatus')}</h3>
                                    <div className="flex justify-center">
                                        {getStatusBadge(application.status)}
                                    </div>
                                </section>

                                {/* Admin Actions - Only show if pending */}
                                {application.status === 'PENDING' && (
                                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('adminActions')}</h3>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="adminNotes" className="block text-sm font-medium text-slate-900 mb-2">
                                                    {t('adminNotes')}
                                                </label>
                                                <textarea
                                                    id="adminNotes"
                                                    value={adminNotes}
                                                    onChange={(e) => setAdminNotes(e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={t('adminNotesPlaceholder')}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => openConfirmModal('APPROVED')}
                                                    disabled={submitting}
                                                    className="w-full px-6 py-3.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold text-lg shadow-sm flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {t('approve')}
                                                </button>

                                                <button
                                                    onClick={() => openConfirmModal('REJECTED')}
                                                    disabled={submitting}
                                                    className="w-full px-6 py-3.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold text-lg shadow-sm flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    {t('reject')}
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmVerify}
                title={confirmModal.type === 'APPROVED' ? t('confirmApproveTitle') : t('confirmRejectTitle')}
                message={confirmModal.type === 'APPROVED' ? t('confirmApproveMessage') : t('confirmRejectMessage')}
                confirmText={t('confirmButton')}
                cancelText={t('cancelButton')}
                type={confirmModal.type === 'APPROVED' ? 'approve' : 'reject'}
            />

            {/* Toast Notification */}
            <Toast
                isOpen={toast.isOpen}
                onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    )
}
