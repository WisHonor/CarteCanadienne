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
        title: 'Vérifier le statut de votre demande',
        subtitle: 'Entrez votre adresse courriel pour voir le statut de votre demande',
        emailLabel: 'Adresse courriel *',
        emailPlaceholder: 'votre@courriel.com',
        checkStatus: 'Vérifier le statut',
        loading: 'Chargement...',
        errorEmail: 'Veuillez entrer une adresse courriel valide',
        errorNotFound: 'Aucune demande trouvée pour cette adresse courriel',
        errorGeneral: 'Erreur lors de la recherche de votre demande',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        langToggleSr: '— Switch to French',
        title: 'Check Your Application Status',
        subtitle: 'Enter your email address to view your application status',
        emailLabel: 'Email Address *',
        emailPlaceholder: 'your@email.com',
        checkStatus: 'Check Status',
        loading: 'Loading...',
        errorEmail: 'Please enter a valid email address',
        errorNotFound: 'No application found for this email address',
        errorGeneral: 'Error searching for your application',
    },
}

export default function CheckStatusPage() {
    const router = useRouter()
    const [lang, setLang] = useState<Lang>('fr')
    const [mounted, setMounted] = useState(false)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const t = (key: keyof typeof translations.fr) => translations[lang][key]

    useEffect(() => {
        const saved = (localStorage.getItem('lang') as Lang) || 'fr'
        setLang(saved)
        document.documentElement.lang = saved
        setMounted(true)
    }, [])

    const toggleLang = () => {
        setLang(prev => {
            const next = prev === 'fr' ? 'en' : 'fr'
            localStorage.setItem('lang', next)
            document.documentElement.lang = next
            return next
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate email
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t('errorEmail'))
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`/api/application/status?email=${encodeURIComponent(email)}`)
            
            if (response.status === 404) {
                setError(t('errorNotFound'))
                setLoading(false)
                return
            }

            if (!response.ok) {
                throw new Error('Failed to fetch application')
            }

            const data = await response.json()
            
            // Redirect to the application detail page
            router.push(`/application/view?email=${encodeURIComponent(email)}`)
        } catch (err) {
            console.error('Error checking status:', err)
            setError(t('errorGeneral'))
            setLoading(false)
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header role="banner" className="bg-white shadow-sm border-b-4 border-blue-700">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center" aria-hidden="true">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
                            aria-pressed={lang === 'en'}
                        >
                            <span className="text-lg" aria-hidden="true">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
                            {translations[lang].langToggle}
                            <span className="sr-only">{translations[lang].langToggleSr}</span>
                        </button>
                    </div>

                    <div className="py-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">{t('title')}</h1>
                        <p className="mt-2 text-lg text-slate-600">{t('subtitle')}</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main role="main" className="flex-1">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 sm:p-12 border border-blue-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-lg font-semibold text-slate-900 mb-3">
                                    {t('emailLabel')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('emailPlaceholder')}
                                    className="w-full px-4 py-3 text-lg border-2 border-slate-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-800 font-medium">{error}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-md flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        {t('loading')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        {t('checkStatus')}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
