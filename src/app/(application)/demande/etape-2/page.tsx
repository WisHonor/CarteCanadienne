'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Lang = 'fr' | 'en'

const messages = {
    fr: {
        gc: 'Gouvernement du Canada',
        svc: 'Service de la Carte d’accessibilité',
        langToggle: 'English',
        langToggleSr: '— Basculer vers l’anglais',

        h1: 'Demande — Étape 2 : Handicap & services',
        bcHome: 'Accueil',
        bcForm: 'Demande',
        bcStep: 'Étape 2 : Handicap & services',

        heroTitle: 'Votre situation et vos besoins',
        heroDesc:
            'Sélectionnez les catégories de handicap qui vous concernent et cochez les services et accommodements dont vous avez besoin pour accéder aux programmes et activités.',

        legendDis: 'Catégories de handicap',
        legendSvc: 'Services et accommodements demandés',
        otherLabel: 'Autre (précisez)',
        detailsLabel: 'Détails additionnels (optionnel)',

        // groups
        disA11yHint:
            'Vous pouvez choisir plusieurs catégories si nécessaire.',
        svcA11yHint:
            'Cochez tous les services utiles; des documents d’appui peuvent être exigés selon le programme.',

        // actions
        continue: 'Continuer',
        back: 'Retour',
        clear: 'Effacer',

        // errors
        errTitle: 'Veuillez corriger les erreurs suivantes :',
        errDis: 'Sélectionnez au moins une catégorie de handicap.',
        errSvc: 'Sélectionnez au moins un service ou accommodement.',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        langToggleSr: '— Switch to French',

        h1: 'Application — Step 2: Disability & services',
        bcHome: 'Home',
        bcForm: 'Application',
        bcStep: 'Step 2: Disability & services',

        heroTitle: 'Your situation and needs',
        heroDesc:
            'Select the disability categories that apply to you and check the services and accommodations you need to access programs and activities.',

        legendDis: 'Disability categories',
        legendSvc: 'Requested services & accommodations',
        otherLabel: 'Other (please specify)',
        detailsLabel: 'Additional details (optional)',

        disA11yHint:
            'You may select multiple categories as needed.',
        svcA11yHint:
            'Check all services that apply; supporting documentation may be required depending on the program.',

        continue: 'Continue',
        back: 'Back',
        clear: 'Clear',

        errTitle: 'Please fix the following errors:',
        errDis: 'Select at least one disability category.',
        errSvc: 'Select at least one service or accommodation.',
    },
} as const

const DISABILITIES = [
    { key: 'mobility', fr: 'Mobilité', en: 'Mobility' },
    { key: 'vision', fr: 'Vision', en: 'Vision' },
    { key: 'hearing', fr: 'Audition', en: 'Hearing' },
    { key: 'cognitive', fr: 'Cognitif', en: 'Cognitive' },
    { key: 'mentalHealth', fr: 'Santé mentale', en: 'Mental health' },
    { key: 'speech', fr: 'Parole/communication', en: 'Speech/communication' },
    { key: 'chronicPain', fr: 'Douleur chronique', en: 'Chronic pain' },
    { key: 'neurological', fr: 'Neurologique', en: 'Neurological' },
    { key: 'autism', fr: 'Autisme/TSA', en: 'Autism/ASD' },
    { key: 'intellectual', fr: 'Déficience intellectuelle', en: 'Intellectual disability' },
    { key: 'learning', fr: 'Trouble d’apprentissage', en: 'Learning disability' },
    { key: 'other', fr: 'Autre', en: 'Other' },
] as const

const SERVICES = [
    { key: 'parking', fr: 'Permis de stationnement réservé', en: 'Accessible parking permit' },
    { key: 'prioritySeating', fr: 'Siège prioritaire', en: 'Priority seating' },
    { key: 'companionFare', fr: 'Tarif accompagnateur', en: 'Companion fare' },
    { key: 'transitPass', fr: 'Carte de transport accessible', en: 'Accessible transit pass' },
    { key: 'aslInterpreter', fr: 'Interprétation en LSQ/ASL', en: 'Sign language interpretation' },
    { key: 'braille', fr: 'Documentation en braille', en: 'Braille materials' },
    { key: 'largePrint', fr: 'Documents en gros caractères', en: 'Large-print materials' },
    { key: 'audioDesc', fr: 'Audiodescription', en: 'Audio description' },
    { key: 'listening', fr: 'Système d’écoute assistée', en: 'Assistive listening devices' },
    { key: 'commAssist', fr: 'Aide à la communication', en: 'Communication assistance' },
    { key: 'serviceAnimal', fr: 'Accueil d’animal d’assistance', en: 'Service animal accommodation' },
    { key: 'housing', fr: 'Adaptations de logement', en: 'Accessible housing modifications' },
    { key: 'employment', fr: 'Mesures d’adaptation au travail', en: 'Employment accommodations' },
    { key: 'education', fr: 'Soutiens aux études', en: 'Education supports' },
    { key: 'equipment', fr: 'Subvention d’équipement médical', en: 'Medical equipment subsidy' },
] as const

type Step2Data = {
    disabilities: string[]
    services: string[]
    otherText: string
    details: string
    doc?: File | null
}

const initialData: Step2Data = {
    disabilities: [],
    services: [],
    otherText: '',
    details: '',
    doc: null,
}

export default function Etape2() {
    const router = useRouter()

    // Language (hydrate safely)
    const [lang, setLang] = useState<Lang>('fr')
    const [mounted, setMounted] = useState(false)
    const t = <K extends keyof typeof messages['fr']>(k: K) => messages[lang][k]

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

    const [data, setData] = useState<Step2Data>(initialData)
    const [errors, setErrors] = useState<Record<'dis' | 'svc', string>>({} as any)
    const errorSummaryRef = useRef<HTMLDivElement>(null)

    // Load any previously saved step 2 data
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('demande-step2')
            if (saved) {
                const parsed = JSON.parse(saved) as Step2Data
                setData({ ...initialData, ...parsed })
            }
        } catch {}
    }, [])

    const toggleArrayItem = (arr: string[], value: string) =>
        arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]

    const onToggleDisability = (key: string) => {
        setData(d => ({ ...d, disabilities: toggleArrayItem(d.disabilities, key) }))
    }
    const onToggleService = (key: string) => {
        setData(d => ({ ...d, services: toggleArrayItem(d.services, key) }))
    }

    const validate = () => {
        const e: Record<'dis' | 'svc', string> = {} as any
        if (data.disabilities.length === 0) e.dis = messages[lang].errDis
        if (data.services.length === 0) e.svc = messages[lang].errSvc
        setErrors(e)
        return e
    }

    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault()
        const e = validate()
        if (Object.keys(e).length) {
            requestAnimationFrame(() => errorSummaryRef.current?.focus())
            return
        }
        // Save step 2 + lang
        sessionStorage.setItem('demande-step2', JSON.stringify({ ...data, doc: undefined }))
        sessionStorage.setItem('demande-lang', lang)
        // Go to step 3
        router.push('/demande/etape-3')
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
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
                            {messages[lang].langToggle}
                            <span className="sr-only">{messages[lang].langToggleSr}</span>
                        </button>
                    </div>

                    {/* Title + breadcrumb (non-navigating) */}
                    <div className="py-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">{t('h1')}</h1>
                        <nav aria-label={lang === 'fr' ? "Fil d'Ariane" : 'Breadcrumb'} className="mt-4">
                            <ol className="flex flex-wrap items-center gap-2 text-sm">
                                <li><button type="button" aria-disabled className="text-blue-700 underline underline-offset-2 rounded">{t('bcHome')}</button></li>
                                <li aria-hidden className="text-slate-400">›</li>
                                <li><button type="button" aria-disabled className="text-blue-700 underline underline-offset-2 rounded">{t('bcForm')}</button></li>
                                <li aria-hidden className="text-slate-400">›</li>
                                <li aria-current="page" className="font-medium text-slate-900">{t('bcStep')}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main id="main" role="main" className="flex-1">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 sm:p-12 border border-blue-100">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{t('heroTitle')}</h2>
                            <p className="text-lg text-slate-700 leading-relaxed mb-8">{t('heroDesc')}</p>

                            {/* Error summary */}
                            {(errors.dis || errors.svc) && (
                                <div
                                    ref={errorSummaryRef}
                                    tabIndex={-1}
                                    className="mb-6 rounded-md border border-red-300 bg-red-50 p-4"
                                    aria-labelledby="error-summary-title"
                                >
                                    <h3 id="error-summary-title" className="text-red-800 font-semibold">
                                        {t('errTitle')}
                                    </h3>
                                    <ul className="mt-2 list-disc ps-6 text-red-800">
                                        {errors.dis && <li><button type="button" className="underline" onClick={() => document.getElementById('fieldset-dis')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>{errors.dis}</button></li>}
                                        {errors.svc && <li><button type="button" className="underline" onClick={() => document.getElementById('fieldset-svc')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>{errors.svc}</button></li>}
                                    </ul>
                                </div>
                            )}

                            {/* Form container */}
                            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-700">
                                <form noValidate onSubmit={handleSubmit} className="space-y-10">
                                    {/* Disabilities */}
                                    <fieldset id="fieldset-dis" className="space-y-4">
                                        <legend className="text-lg font-semibold text-slate-900">{t('legendDis')}</legend>
                                        <p className="text-sm text-slate-600">{t('disA11yHint')}</p>
                                        <div className="grid sm:grid-cols-2 gap-3 mt-2">
                                            {DISABILITIES.map(({ key, fr, en }) => (
                                                <label key={key} className="inline-flex items-center gap-3 bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 border border-slate-200">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4"
                                                        checked={data.disabilities.includes(key)}
                                                        onChange={() => onToggleDisability(key)}
                                                    />
                                                    <span className="text-sm text-slate-900">{lang === 'fr' ? fr : en}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* “Other” free text if selected */}
                                        {data.disabilities.includes('other') && (
                                            <div className="mt-2">
                                                <label htmlFor="field-other" className="block text-sm font-medium text-slate-900">
                                                    {t('otherLabel')}
                                                </label>
                                                <input
                                                    id="field-other"
                                                    type="text"
                                                    value={data.otherText}
                                                    onChange={(e) => setData(d => ({ ...d, otherText: e.target.value }))}
                                                    className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-blue-600 focus:border-blue-600"
                                                />
                                            </div>
                                        )}
                                    </fieldset>

                                    {/* Services */}
                                    <fieldset id="fieldset-svc" className="space-y-4">
                                        <legend className="text-lg font-semibold text-slate-900">{t('legendSvc')}</legend>
                                        <p className="text-sm text-slate-600">{t('svcA11yHint')}</p>
                                        <div className="grid sm:grid-cols-2 gap-3 mt-2">
                                            {SERVICES.map(({ key, fr, en }) => (
                                                <label key={key} className="inline-flex items-center gap-3 bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 border border-slate-200">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4"
                                                        checked={data.services.includes(key)}
                                                        onChange={() => onToggleService(key)}
                                                    />
                                                    <span className="text-sm text-slate-900">{lang === 'fr' ? fr : en}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>

                                    {/* Additional details */}
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <label htmlFor="field-details" className="block text-sm font-medium text-slate-900">
                                                {t('detailsLabel')}
                                            </label>
                                            <textarea
                                                id="field-details"
                                                rows={4}
                                                value={data.details}
                                                onChange={(e) => setData(d => ({ ...d, details: e.target.value }))}
                                                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-semibold text-slate-800 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all"
                                        >
                                            {t('back')}
                                        </button>

                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 text-lg font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {t('continue')}
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { setData(initialData); setErrors({} as any) }}
                                            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-semibold text-slate-800 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all"
                                        >
                                            {t('clear')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer (no real links) */}
            <footer role="contentinfo" className="bg-slate-900 text-slate-300 border-t-4 border-blue-700">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-white font-semibold mb-4">{messages[lang].svc}</h3>
                            <p className="text-sm leading-relaxed">
                                {lang === 'fr'
                                    ? 'Offrir un accès équitable aux services et accommodements pour tous les Canadiens en situation de handicap.'
                                    : 'Providing equitable access to services and accommodations for all Canadians with disabilities.'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">{lang === 'fr' ? 'Liens rapides' : 'Quick links'}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><button type="button" aria-disabled className="hover:text-white underline underline-offset-2">{lang === 'fr' ? 'Centre d’aide' : 'Help centre'}</button></li>
                                <li><button type="button" aria-disabled className="hover:text-white underline underline-offset-2">{lang === 'fr' ? 'Avis' : 'Notices'}</button></li>
                                <li><button type="button" aria-disabled className="hover:text-white underline underline-offset-2">{lang === 'fr' ? 'Confidentialité' : 'Privacy'}</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">{lang === 'fr' ? 'Engagement' : 'Commitment'}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><button type="button" aria-disabled className="hover:text-white underline underline-offset-2">{lang === 'fr' ? 'Accessibilité' : 'Accessibility'}</button></li>
                                <li><button type="button" aria-disabled className="hover:text-white underline underline-offset-2">{lang === 'fr' ? 'Signaler un problème' : 'Report a problem'}</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-700 pt-8 text-sm">
                        <p>© {new Date().getFullYear()} {lang === 'fr' ? 'Gouvernement du Canada. Tous droits réservés.' : 'Government of Canada. All rights reserved.'}</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
