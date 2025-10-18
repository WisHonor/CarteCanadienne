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
        title: 'Tableau de bord administrateur',
        subtitle: 'Gérer les demandes de Carte Canadienne d\'Invalidité',
        loading: 'Chargement...',
        error: 'Erreur lors du chargement des demandes.',
        noApplications: 'Aucune demande trouvée.',
        statusPending: 'En attente',
        statusApproved: 'Approuvé',
        statusRejected: 'Rejeté',
        filterAll: 'Toutes',
        filterPending: 'En attente',
        filterApproved: 'Approuvées',
        filterRejected: 'Rejetées',
        applicantName: 'Nom du demandeur',
        email: 'Courriel',
        submittedOn: 'Soumis le',
        status: 'Statut',
        actions: 'Actions',
        review: 'Examiner',
        totalApplications: 'Total des demandes',
        pendingReview: 'En attente d\'examen',
        approved: 'Approuvées',
        rejected: 'Rejetées',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        langToggleSr: '— Switch to French',
        title: 'Admin Dashboard',
        subtitle: 'Manage Canadian Disability Card applications',
        loading: 'Loading...',
        error: 'Error loading applications.',
        noApplications: 'No applications found.',
        statusPending: 'Pending',
        statusApproved: 'Approved',
        statusRejected: 'Rejected',
        filterAll: 'All',
        filterPending: 'Pending',
        filterApproved: 'Approved',
        filterRejected: 'Rejected',
        applicantName: 'Applicant Name',
        email: 'Email',
        submittedOn: 'Submitted On',
        status: 'Status',
        actions: 'Actions',
        review: 'Review',
        totalApplications: 'Total Applications',
        pendingReview: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected',
    },
}

interface ApplicationData {
    id: string
    status: string
    createdAt: string
    user: {
        firstName: string
        lastName: string
        email: string
    }
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const [lang, setLang] = useState<Lang>('fr')
    const [mounted, setMounted] = useState(false)
    const [applications, setApplications] = useState<ApplicationData[]>([])
    const [filteredApplications, setFilteredApplications] = useState<ApplicationData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

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
        if (mounted && isAuthenticated) {
            fetchApplications()
        }
    }, [mounted, isAuthenticated])

    useEffect(() => {
        if (filter === 'ALL') {
            setFilteredApplications(applications)
        } else {
            setFilteredApplications(applications.filter(app => app.status === filter))
        }
    }, [filter, applications])

    const fetchApplications = async () => {
        try {
            const token = sessionStorage.getItem('admin-token')
            const response = await fetch('/api/admin/applications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            
            if (response.status === 401) {
                // Token invalid, redirect to login
                sessionStorage.removeItem('admin-token')
                sessionStorage.removeItem('admin-user')
                router.push('/admin/login')
                return
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch applications')
            }

            const data = await response.json()
            setApplications(data)
            setFilteredApplications(data)
        } catch (err) {
            console.error('Error fetching applications:', err)
            setError(t('error'))
        } finally {
            setLoading(false)
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
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-900 border border-yellow-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {t('statusPending')}
                    </span>
                )
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold bg-green-100 text-green-900 border border-green-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {t('statusApproved')}
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold bg-red-100 text-red-900 border border-red-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {t('statusRejected')}
                    </span>
                )
            default:
                return null
        }
    }

    const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'PENDING').length,
        approved: applications.filter(app => app.status === 'APPROVED').length,
        rejected: applications.filter(app => app.status === 'REJECTED').length,
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

                        <div className="flex items-center gap-3">
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
                            
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.removeItem('admin-token')
                                    sessionStorage.removeItem('admin-user')
                                    router.push('/admin/login')
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {lang === 'fr' ? 'Déconnexion' : 'Logout'}
                            </button>
                        </div>
                    </div>

                    <div className="py-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">{t('title')}</h1>
                        <p className="mt-2 text-lg text-slate-600">{t('subtitle')}</p>
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
                    ) : error ? (
                        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-red-600">
                            <p className="text-red-800">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-700">
                                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{t('totalApplications')}</p>
                                    <p className="text-4xl font-bold text-slate-900 mt-2">{stats.total}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{t('pendingReview')}</p>
                                    <p className="text-4xl font-bold text-yellow-900 mt-2">{stats.pending}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
                                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{t('approved')}</p>
                                    <p className="text-4xl font-bold text-green-900 mt-2">{stats.approved}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
                                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{t('rejected')}</p>
                                    <p className="text-4xl font-bold text-red-900 mt-2">{stats.rejected}</p>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setFilter('ALL')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            filter === 'ALL'
                                                ? 'bg-blue-700 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {t('filterAll')} ({applications.length})
                                    </button>
                                    <button
                                        onClick={() => setFilter('PENDING')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            filter === 'PENDING'
                                                ? 'bg-yellow-500 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {t('filterPending')} ({stats.pending})
                                    </button>
                                    <button
                                        onClick={() => setFilter('APPROVED')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            filter === 'APPROVED'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {t('filterApproved')} ({stats.approved})
                                    </button>
                                    <button
                                        onClick={() => setFilter('REJECTED')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            filter === 'REJECTED'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {t('filterRejected')} ({stats.rejected})
                                    </button>
                                </div>
                            </div>

                            {/* Applications Table */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                {filteredApplications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-slate-600">{t('noApplications')}</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b-2 border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                                        {t('applicantName')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                                        {t('email')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                                        {t('submittedOn')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                                        {t('status')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                                        {t('actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {filteredApplications.map((app) => (
                                                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <p className="font-medium text-slate-900">
                                                                {app.user.firstName} {app.user.lastName}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <p className="text-slate-600">{app.user.email}</p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <p className="text-slate-600">
                                                                {new Date(app.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA')}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getStatusBadge(app.status)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => router.push(`/admin/verification/${app.id}`)}
                                                                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm"
                                                            >
                                                                {t('review')}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
