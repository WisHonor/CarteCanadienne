'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Lang = 'fr' | 'en'

const translations = {
    fr: {
        title: 'Demande Soumise avec Succès',
        subtitle: 'Votre demande de Carte Canadienne d\'Invalidité a été soumise.',
        status: 'Statut',
        pending: 'En attente de vérification',
        submitted: 'Soumis le',
        reference: 'Numéro de référence',
        documents: 'Documents soumis',
        identityDoc: 'Preuve d\'identité',
        medicalDoc: 'Preuve médicale',
        viewDoc: 'Voir le document',
        loading: 'Chargement...',
        downloading: 'Téléchargement...',
        nextSteps: 'Prochaines étapes',
        step1: 'Notre équipe examinera votre demande dans les 5 à 7 jours ouvrables.',
        step2: 'Vous recevrez un courriel une fois que votre demande aura été approuvée.',
        step3: 'Votre carte sera envoyée par la poste à l\'adresse que vous avez fournie.',
        backHome: 'Retour à l\'accueil',
        error: 'Erreur lors du chargement des informations de la demande.',
        noApplication: 'Aucune demande trouvée.',
    },
    en: {
        title: 'Application Submitted Successfully',
        subtitle: 'Your Canadian Disability Card application has been submitted.',
        status: 'Status',
        pending: 'Pending verification',
        submitted: 'Submitted on',
        reference: 'Reference number',
        documents: 'Submitted documents',
        identityDoc: 'Proof of identity',
        medicalDoc: 'Medical proof',
        viewDoc: 'View document',
        loading: 'Loading...',
        downloading: 'Downloading...',
        nextSteps: 'Next steps',
        step1: 'Our team will review your application within 5-7 business days.',
        step2: 'You will receive an email once your application has been approved.',
        step3: 'Your card will be mailed to the address you provided.',
        backHome: 'Back to home',
        error: 'Error loading application information.',
        noApplication: 'No application found.',
    },
}

interface ApplicationData {
    id: string
    status: string
    createdAt: string
    identityDocUrl: string
    medicalDocUrl: string
}

export default function VerificationStatusPage() {
    const router = useRouter()
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
        if (mounted) {
            fetchApplication()
        }
    }, [mounted])

    const fetchApplication = async () => {
        try {
            // Get application ID from URL
            const searchParams = new URLSearchParams(window.location.search)
            const applicationId = searchParams.get('id')
            console.log('Application ID from URL:', applicationId)
            
            if (!applicationId) {
                console.error('No application ID in URL')
                setError(t('noApplication'))
                setLoading(false)
                return
            }

            const response = await fetch(`/api/application/status?id=${encodeURIComponent(applicationId)}`)
            console.log('API response status:', response.status)
            
            if (!response.ok) {
                const errorData = await response.json()
                console.error('API error:', errorData)
                throw new Error('Failed to fetch application')
            }

            const data = await response.json()
            console.log('Application data:', data)
            setApplication(data)
            
            // Now we can clear sessionStorage since we have the application
            sessionStorage.removeItem('demande-step1')
            sessionStorage.removeItem('demande-step2')
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

    const toggleLang = () => {
        setLang(prev => {
            const next = prev === 'fr' ? 'en' : 'fr'
            localStorage.setItem('lang', next)
            document.documentElement.lang = next
            return next
        })
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl font-bold">🍁</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {lang === 'fr' ? 'Carte Canadienne d\'Invalidité' : 'Canadian Disability Card'}
                        </h1>
                    </div>
                    <button
                        onClick={toggleLang}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {lang === 'fr' ? 'EN' : 'FR'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">{t('loading')}</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={() => router.push('/demande')}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            {t('backHome')}
                        </button>
                    </div>
                ) : application ? (
                    <div className="space-y-8">
                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-green-900">{t('title')}</h2>
                            </div>
                            <p className="text-green-800 ml-11">{t('subtitle')}</p>
                        </div>

                        {/* Application Details */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('reference')}</p>
                                    <p className="font-mono text-sm font-semibold text-gray-900">{application.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('status')}</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                        {t('pending')}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('submitted')}</p>
                                    <p className="text-gray-900">{new Date(application.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('documents')}</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-900">{t('identityDoc')}</span>
                                    </div>
                                    <button
                                        onClick={() => viewDocument(application.identityDocUrl, 'identity')}
                                        disabled={viewingDoc.identity}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                    >
                                        {viewingDoc.identity ? t('downloading') : t('viewDoc')}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-900">{t('medicalDoc')}</span>
                                    </div>
                                    <button
                                        onClick={() => viewDocument(application.medicalDocUrl, 'medical')}
                                        disabled={viewingDoc.medical}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                    >
                                        {viewingDoc.medical ? t('downloading') : t('viewDoc')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">{t('nextSteps')}</h3>
                            <ol className="space-y-3 text-blue-800">
                                <li className="flex gap-3">
                                    <span className="font-semibold">1.</span>
                                    <span>{t('step1')}</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-semibold">2.</span>
                                    <span>{t('step2')}</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-semibold">3.</span>
                                    <span>{t('step3')}</span>
                                </li>
                            </ol>
                        </div>

                        {/* Back to Home Button */}
                        <div className="text-center">
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                {t('backHome')}
                            </button>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    )
}
