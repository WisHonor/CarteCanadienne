'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Lang = 'fr' | 'en'

const translations = {
    fr: {
        gc: 'Gouvernement du Canada',
        svc: "Service de la Carte d'accessibilité",
        langToggle: 'English',
        title: 'Connexion administrateur',
        email: 'Courriel',
        password: 'Mot de passe',
        login: 'Se connecter',
        error: 'Identifiants invalides',
        unauthorized: 'Accès non autorisé',
        loading: 'Connexion...',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        title: 'Administrator Login',
        email: 'Email',
        password: 'Password',
        login: 'Login',
        error: 'Invalid credentials',
        unauthorized: 'Unauthorized access',
        loading: 'Logging in...',
    },
}

export default function AdminLoginPage() {
    const router = useRouter()
    const [lang, setLang] = useState<Lang>('fr')
    const [mounted, setMounted] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const t = (key: keyof typeof translations.fr) => translations[lang][key]

    useEffect(() => {
        const saved = (localStorage.getItem('lang') as Lang) || 'fr'
        setLang(saved)
        document.documentElement.lang = saved
        setMounted(true)

        // Check if already logged in
        const adminToken = sessionStorage.getItem('admin-token')
        if (adminToken) {
            router.push('/admin')
        }
    }, [router])

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
        setLoading(true)

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                sessionStorage.setItem('admin-token', data.token)
                sessionStorage.setItem('admin-user', JSON.stringify(data.user))
                router.push('/admin')
            } else {
                const data = await response.json()
                setError(data.error || t('error'))
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(t('error'))
        } finally {
            setLoading(false)
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
            <main role="main" className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-600"
                                    autoComplete="email"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('password')}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-600"
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? t('loading') : t('login')}
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="text-sm text-blue-700 hover:text-blue-900 underline"
                        >
                            {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
