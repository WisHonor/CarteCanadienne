'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Lang = 'fr' | 'en'

const translations = {
    fr: {
        gc: 'Gouvernement du Canada',
        svc: "Service de la Carte d'accessibilité",
        langToggle: 'English',
        langToggleSr: "— Basculer vers l'anglais",
        
        title: 'Demande Soumise avec Succès',
        subtitle: "Votre demande de Carte Canadienne d'Invalidité a été soumise.",
        status: 'Statut',
        pending: 'En attente de vérification',
        submitted: 'Soumis le',
        reference: 'Numéro de référence',
        documents: 'Documents soumis',
        identityDoc: "Preuve d'identité",
        medicalDoc: 'Preuve médicale',
        viewDoc: 'Voir le document',
        loading: 'Chargement...',
        downloading: 'Téléchargement...',
        nextSteps: 'Prochaines étapes',
        step1: 'Notre équipe examinera votre demande dans les 5 à 7 jours ouvrables.',
        step2: 'Vous recevrez un courriel une fois que votre demande aura été approuvée.',
        step3: "Votre carte sera envoyée par la poste à l'adresse que vous avez fournie.",
        backHome: "Retour à l'accueil",
        error: 'Erreur lors du chargement des informations de la demande.',
        noApplication: 'Aucune demande trouvée.',
        bcHome: 'Accueil',
        bcForm: 'Demande',
        bcStatus: 'Statut de vérification',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        langToggleSr: '— Switch to French',
        
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
        bcHome: 'Home',
        bcForm: 'Application',
        bcStatus: 'Verification Status',
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
            {/* Header (same style as other pages) */}
            <header role="banner" className="bg-white shadow-sm border-b-4 border-blue-700">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center" aria-hidden="true">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">{t('gc')}</p>
                                <p className="text-sm text-slate-800 font-semibold">{t('svc')}</p>
                            </div>
                        </div>

                        {/* Language toggle */}
                        <button
                            type="button"
                            onClick={toggleLang}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                            aria-pressed={lang === 'en'}
                        >
                            <span className="text-lg" aria-hidden="true">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
                            {translations[lang].langToggle}
                            <span className="sr-only">{translations[lang].langToggleSr}</span>
                        </button>
                    </div>

                    {/* Breadcrumb */}
                    <div className="py-6">
                        <nav aria-label={lang === 'fr' ? "Fil d'Ariane" : 'Breadcrumb'}>
                            <ol className="flex flex-wrap items-center gap-2 text-sm">
                                <li><button type="button" onClick={() => router.push('/')} className="text-blue-700 underline underline-offset-2 rounded hover:text-blue-900">{t('bcHome')}</button></li>
                                <li aria-hidden className="text-slate-400">›</li>
                                <li><button type="button" onClick={() => router.push('/demande')} className="text-blue-700 underline underline-offset-2 rounded hover:text-blue-900">{t('bcForm')}</button></li>
                                <li aria-hidden className="text-slate-400">›</li>
                                <li aria-current="page" className="font-medium text-slate-900">{t('bcStatus')}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main role="main" className="flex-1">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700 mx-auto"></div>
                        <p className="mt-6 text-lg text-slate-700 font-medium">{t('loading')}</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-red-600">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur</h3>
                                <p className="text-red-800 mb-4">{error}</p>
                                <button
                                    onClick={() => router.push('/demande')}
                                    className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
                                >
                                    {t('backHome')}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : application ? (
                    <div className="space-y-6">
                        {/* Success Message */}
                        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border-l-4 border-green-600">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('title')}</h2>
                                    <p className="text-lg text-slate-700 leading-relaxed">{t('subtitle')}</p>
                                </div>
                            </div>
                        </section>

                        {/* Application Details */}
                        <section className="bg-white rounded-xl shadow-md p-8 border-l-4 border-blue-700">
                            <h3 className="text-xl font-semibold text-slate-900 mb-6">{lang === 'fr' ? 'Détails de la demande' : 'Application Details'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{t('reference')}</p>
                                    <p className="font-mono text-base font-semibold text-slate-900 break-all">{application.id}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{t('status')}</p>
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-900 border border-yellow-200">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        {t('pending')}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{t('submitted')}</p>
                                    <p className="text-base font-medium text-slate-900">{new Date(application.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </section>

                        {/* Documents */}
                        <section className="bg-white rounded-xl shadow-md p-8 border-l-4 border-indigo-600">
                            <h3 className="text-xl font-semibold text-slate-900 mb-6">{t('documents')}</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-colors">
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
                                        className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold shadow-sm"
                                    >
                                        {viewingDoc.identity ? t('downloading') : t('viewDoc')}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:border-green-300 transition-colors">
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
                                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold shadow-sm"
                                    >
                                        {viewingDoc.medical ? t('downloading') : t('viewDoc')}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Next Steps */}
                        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-l-4 border-blue-600">
                            <h3 className="text-xl font-semibold text-slate-900 mb-6">{t('nextSteps')}</h3>
                            <ol className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">1</span>
                                    <span className="text-slate-700 leading-relaxed pt-1">{t('step1')}</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">2</span>
                                    <span className="text-slate-700 leading-relaxed pt-1">{t('step2')}</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">3</span>
                                    <span className="text-slate-700 leading-relaxed pt-1">{t('step3')}</span>
                                </li>
                            </ol>
                        </section>

                        {/* Back to Home Button */}
                        <div className="text-center pt-4">
                            <button
                                onClick={() => router.push('/')}
                                className="px-8 py-3.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm text-lg"
                            >
                                {t('backHome')}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
            </main>
        </div>
    )
}
