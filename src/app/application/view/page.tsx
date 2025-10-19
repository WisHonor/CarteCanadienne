'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Lang = 'fr' | 'en'

const translations = {
    fr: {
        gc: 'Gouvernement du Canada',
        svc: "Service de la Carte d'accessibilité",
        langToggle: 'English',
        langToggleSr: "— Basculer vers l'anglais",
        title: 'Ma demande',
        loading: 'Chargement...',
        error: 'Erreur lors du chargement de votre demande',
        
        // Status
        statusTitle: 'Statut de votre demande',
        statusPending: 'En attente de vérification',
        statusApproved: '✓ Approuvée',
        statusRejected: '✗ Rejetée',
        statusPendingDesc: 'Votre demande est en cours d\'examen par notre équipe',
        statusApprovedDesc: 'Félicitations! Votre demande a été approuvée',
        statusRejectedDesc: 'Votre demande a été rejetée',
        
        // Info
        submittedOn: 'Soumise le',
        applicationId: 'Numéro de demande',
        
        // Personal Info
        personalInfo: 'Informations personnelles',
        name: 'Nom',
        email: 'Courriel',
        phone: 'Téléphone',
        dateOfBirth: 'Date de naissance',
        address: 'Adresse',
        
        // Application Details
        applicationDetails: 'Détails de la demande',
        disabilities: 'Handicaps déclarés',
        services: 'Services requis',
        otherInfo: 'Autres informations',
        additionalDetails: 'Détails supplémentaires',
        adminNotes: 'Notes de l\'administrateur',
        
        // Documents
        documents: 'Documents soumis',
        identityDoc: 'Preuve d\'identité',
        medicalDoc: 'Preuve médicale',
        viewDoc: 'Voir le document',
        downloading: 'Chargement...',
        
        // Actions
        editApplication: 'Modifier ma demande',
        cannotEdit: 'Modification non disponible',
        cannotEditApproved: 'Votre demande a été approuvée et ne peut plus être modifiée',
        cannotEditRejected: 'Votre demande a été rejetée. Vous pouvez soumettre une nouvelle demande',
        backHome: 'Retour à l\'accueil',
        newApplication: 'Nouvelle demande',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        langToggleSr: '— Switch to French',
        title: 'My Application',
        loading: 'Loading...',
        error: 'Error loading your application',
        
        // Status
        statusTitle: 'Application Status',
        statusPending: 'Pending Verification',
        statusApproved: '✓ Approved',
        statusRejected: '✗ Rejected',
        statusPendingDesc: 'Your application is being reviewed by our team',
        statusApprovedDesc: 'Congratulations! Your application has been approved',
        statusRejectedDesc: 'Your application has been rejected',
        
        // Info
        submittedOn: 'Submitted On',
        applicationId: 'Application Number',
        
        // Personal Info
        personalInfo: 'Personal Information',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        dateOfBirth: 'Date of Birth',
        address: 'Address',
        
        // Application Details
        applicationDetails: 'Application Details',
        disabilities: 'Declared Disabilities',
        services: 'Services Required',
        otherInfo: 'Other Information',
        additionalDetails: 'Additional Details',
        adminNotes: 'Administrator Notes',
        
        // Documents
        documents: 'Submitted Documents',
        identityDoc: 'Proof of Identity',
        medicalDoc: 'Medical Proof',
        viewDoc: 'View Document',
        downloading: 'Loading...',
        
        // Actions
        editApplication: 'Edit My Application',
        cannotEdit: 'Editing Not Available',
        cannotEditApproved: 'Your application has been approved and can no longer be modified',
        cannotEditRejected: 'Your application has been rejected. You can submit a new application',
        backHome: 'Back to Home',
        newApplication: 'New Application',
    },
}

interface ApplicationData {
    id: string
    status: string
    createdAt: string
    updatedAt: string
    disabilities: string[]
    services: string[]
    otherText: string | null
    details: string | null
    identityDocUrl: string
    medicalDocUrl: string
    adminNotes: string | null
    verifiedAt: string | null
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

function ViewApplicationContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const [lang, setLang] = useState<Lang>('fr')
    const [mounted, setMounted] = useState(false)
    const [application, setApplication] = useState<ApplicationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [viewingDoc, setViewingDoc] = useState<{ identity: boolean; medical: boolean }>({
        identity: false,
        medical: false,
    })

    const t = (key: keyof typeof translations.fr) => translations[lang][key]

    useEffect(() => {
        const saved = (localStorage.getItem('lang') as Lang) || 'fr'
        setLang(saved)
        document.documentElement.lang = saved
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && email) {
            fetchApplication()
        }
    }, [mounted, email])

    const fetchApplication = async () => {
        try {
            const response = await fetch(`/api/application/status?email=${encodeURIComponent(email!)}`)
            
            if (!response.ok) {
                throw new Error('Failed to fetch application')
            }

            const data = await response.json()
            setApplication(data)
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
            alert('Failed to open document. Please try again.')
        } finally {
            setViewingDoc(prev => ({ ...prev, [type]: false }))
        }
    }

    const handleEdit = () => {
        // Store application data for editing
        const step1Data = {
            prenom: application!.user.firstName,
            nom: application!.user.lastName,
            courriel: application!.user.email,
            telephone: application!.user.phone,
            dateNaissance: application!.user.dateOfBirth.split('T')[0],
            adresse1: application!.user.address.line1,
            adresse2: application!.user.address.line2 || '',
            ville: application!.user.address.city,
            province: application!.user.address.province,
            codePostal: application!.user.address.postalCode,
        }

        const step2Data = {
            disabilities: application!.disabilities,
            services: application!.services,
            otherText: application!.otherText || '',
            details: application!.details || '',
        }

        sessionStorage.setItem('demande-step1', JSON.stringify(step1Data))
        sessionStorage.setItem('demande-step2', JSON.stringify(step2Data))
        sessionStorage.setItem('editing-application-id', application!.id)
        
        // Redirect to step 1 (beginning) so users can edit ALL information
        router.push('/demande')
    }

    const toggleLang = () => {
        setLang(prev => {
            const next = prev === 'fr' ? 'en' : 'fr'
            localStorage.setItem('lang', next)
            document.documentElement.lang = next
            return next
        })
    }

    const getStatusSection = () => {
        if (!application) return null

        const statusConfig = {
            PENDING: {
                bg: 'from-yellow-50 to-amber-50',
                border: 'border-yellow-500',
                icon: (
                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                ),
                title: t('statusPending'),
                desc: t('statusPendingDesc'),
            },
            APPROVED: {
                bg: 'from-green-50 to-emerald-50',
                border: 'border-green-600',
                icon: (
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ),
                title: t('statusApproved'),
                desc: t('statusApprovedDesc'),
            },
            REJECTED: {
                bg: 'from-red-50 to-rose-50',
                border: 'border-red-600',
                icon: (
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                ),
                title: t('statusRejected'),
                desc: t('statusRejectedDesc'),
            },
        }

        const config = statusConfig[application.status as keyof typeof statusConfig]

        return (
            <section className={`bg-gradient-to-br ${config.bg} rounded-2xl shadow-lg p-8 border-l-4 ${config.border}`}>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">{t('statusTitle')}</h2>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {config.icon}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{config.title}</h3>
                        <p className="text-lg text-slate-700">{config.desc}</p>
                        {application.verifiedAt && (
                            <p className="text-sm text-slate-600 mt-2">
                                {new Date(application.verifiedAt).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        )}
                    </div>
                </div>
            </section>
        )
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

                    <div className="py-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">{t('title')}</h1>
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
                                {/* Status */}
                                {getStatusSection()}

                                {/* Application Info */}
                                <section className="bg-white rounded-xl shadow-md p-8 border-l-4 border-slate-700">
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
                                </section>

                                {/* Personal Info */}
                                <section className="bg-white rounded-xl shadow-md p-8 border-l-4 border-blue-700">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6">{t('personalInfo')}</h2>
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

                                {/* Admin Notes (if rejected) */}
                                {application.adminNotes && application.status === 'REJECTED' && (
                                    <section className="bg-red-50 rounded-xl shadow-md p-8 border-l-4 border-red-600">
                                        <h2 className="text-xl font-semibold text-red-900 mb-4">{t('adminNotes')}</h2>
                                        <p className="text-base text-red-800 whitespace-pre-wrap">{application.adminNotes}</p>
                                    </section>
                                )}
                            </div>

                            {/* Right Column - Actions */}
                            <div className="space-y-6">
                                {/* Edit Button - Only show if PENDING */}
                                {application.status === 'PENDING' ? (
                                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                                        <button
                                            onClick={handleEdit}
                                            className="w-full px-6 py-3.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold text-lg shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            {t('editApplication')}
                                        </button>
                                    </section>
                                ) : (
                                    <section className="bg-slate-50 rounded-xl shadow-md p-6 border-l-4 border-slate-400">
                                        <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('cannotEdit')}</h3>
                                        <p className="text-sm text-slate-600 mb-4">
                                            {application.status === 'APPROVED' ? t('cannotEditApproved') : t('cannotEditRejected')}
                                        </p>
                                        {application.status === 'REJECTED' && (
                                            <button
                                                onClick={() => router.push('/demande')}
                                                className="w-full px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                                            >
                                                {t('newApplication')}
                                            </button>
                                        )}
                                    </section>
                                )}

                                {/* Back Home */}
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full px-6 py-3 bg-white text-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                                >
                                    {t('backHome')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default function ViewApplicationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ViewApplicationContent />
        </Suspense>
    )
}
