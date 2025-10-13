'use client'
import { useEffect, useRef, useState } from 'react'

type Lang = 'fr' | 'en'

const messages = {
    fr: {
        gc: 'Gouvernement du Canada',
        svc: 'Service de la Carte d’accessibilité',
        langToggle: 'English',
        langToggleSr: '— Basculer vers l’anglais',

        h1: 'Demande — Étape 1 : Identification',
        bcHome: 'Accueil',
        bcForm: 'Demande',
        bcStep: 'Étape 1 : Identification',

        heroTitle: 'Vos renseignements personnels',
        heroDesc:
            'Cette étape recueille les informations nécessaires pour vous identifier. Ayez sous la main vos coordonnées et votre adresse postale.',

        errTitle: 'Veuillez corriger les erreurs suivantes :',

        legendName: 'Nom légal',
        firstName: 'Prénom *',
        lastName: 'Nom de famille *',

        legendDob: 'Date de naissance',
        dobLabel: 'Date (AAAA-MM-JJ) *',

        legendContact: 'Coordonnées',
        email: 'Courriel *',
        phone: 'Téléphone *',
        phonePh: 'ex.: 613-555-0123',

        legendAddress: 'Adresse postale',
        addr1: 'Adresse (ligne 1) *',
        addr2: 'Adresse (ligne 2) (optionnel)',
        city: 'Ville *',
        province: 'Province/territoire *',
        postal: 'Code postal *',
        postalPh: 'ex.: K1A 0B1',

        continue: 'Continuer',
        clear: 'Effacer',

        supportTitle: 'Besoin d’aide ?',
        supportDesc: 'Nous sommes là pour vous accompagner à chaque étape du processus.',
        supportPhone: 'Par téléphone',
        supportHours: 'Lundi au vendredi, 8h à 20h (HE)',
        supportOnline: 'Ressources en ligne',
        supportHelp: 'Centre d’aide et FAQ',
        supportPledge: 'Engagement en accessibilité',

        // errors
        eFirst: 'Prénom requis.',
        eLast: 'Nom de famille requis.',
        eDob: 'Date de naissance requise.',
        eEmailReq: 'Courriel requis.',
        eEmailBad: 'Courriel invalide.',
        ePhoneReq: 'Téléphone requis.',
        ePhoneBad: 'Téléphone invalide.',
        eAddr1: 'Adresse (ligne 1) requise.',
        eCity: 'Ville requise.',
        eProv: 'Province/territoire requis.',
        ePostalReq: 'Code postal requis.',
        ePostalBad: 'Code postal canadien invalide (ex.: K1A 0B1).',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        langToggleSr: '— Basculer vers le français',

        h1: 'Application — Step 1: Identification',
        bcHome: 'Home',
        bcForm: 'Application',
        bcStep: 'Step 1: Identification',

        heroTitle: 'Your personal information',
        heroDesc:
            'This step collects the information needed to identify you. Have your contact details and mailing address handy.',

        errTitle: 'Please fix the following errors:',

        legendName: 'Legal name',
        firstName: 'First name *',
        lastName: 'Last name *',

        legendDob: 'Date of birth',
        dobLabel: 'Date (YYYY-MM-DD) *',

        legendContact: 'Contact details',
        email: 'Email *',
        phone: 'Phone *',
        phonePh: 'e.g., 613-555-0123',

        legendAddress: 'Mailing address',
        addr1: 'Address (line 1) *',
        addr2: 'Address (line 2) (optional)',
        city: 'City *',
        province: 'Province/Territory *',
        postal: 'Postal code *',
        postalPh: 'e.g., K1A 0B1',

        continue: 'Continue',
        clear: 'Clear',

        supportTitle: 'Need help?',
        supportDesc: 'We’re here to support you at every step.',
        supportPhone: 'By phone',
        supportHours: 'Monday to Friday, 8 a.m. to 8 p.m. (ET)',
        supportOnline: 'Online resources',
        supportHelp: 'Help centre & FAQ',
        supportPledge: 'Accessibility commitment',

        // errors
        eFirst: 'First name is required.',
        eLast: 'Last name is required.',
        eDob: 'Date of birth is required.',
        eEmailReq: 'Email is required.',
        eEmailBad: 'Invalid email address.',
        ePhoneReq: 'Phone is required.',
        ePhoneBad: 'Invalid phone number.',
        eAddr1: 'Address (line 1) is required.',
        eCity: 'City is required.',
        eProv: 'Province/Territory is required.',
        ePostalReq: 'Postal code is required.',
        ePostalBad: 'Invalid Canadian postal code (e.g., K1A 0B1).',
    },
} as const

type FormData = {
    prenom: string
    nom: string
    dateNaissance: string
    courriel: string
    telephone: string
    adresse1: string
    adresse2?: string
    ville: string
    province: string
    codePostal: string
}

const provinces = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT']

const initialData: FormData = {
    prenom: '',
    nom: '',
    dateNaissance: '',
    courriel: '',
    telephone: '',
    adresse1: '',
    adresse2: '',
    ville: '',
    province: '',
    codePostal: '',
}

export default function Demande() {
    // Hydratation sûre : FR au SSR, puis on lit la préférence utilisateur
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

    const [data, setData] = useState<FormData>(initialData)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const errorSummaryRef = useRef<HTMLDivElement>(null)

    const onChange =
        (name: keyof FormData) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                setData(d => ({ ...d, [name]: e.target.value }))
            }

    const validate = () => {
        const e: Record<string, string> = {}
        if (!data.prenom.trim()) e.prenom = messages[lang].eFirst
        if (!data.nom.trim()) e.nom = messages[lang].eLast
        if (!data.dateNaissance) e.dateNaissance = messages[lang].eDob
        if (!data.courriel.trim()) e.courriel = messages[lang].eEmailReq
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.courriel)) e.courriel = messages[lang].eEmailBad
        if (!data.telephone.trim()) e.telephone = messages[lang].ePhoneReq
        else if (!/^[0-9\s\-()+]{7,}$/.test(data.telephone)) e.telephone = messages[lang].ePhoneBad
        if (!data.adresse1.trim()) e.adresse1 = messages[lang].eAddr1
        if (!data.ville.trim()) e.ville = messages[lang].eCity
        if (!data.province) e.province = messages[lang].eProv
        if (!data.codePostal.trim()) e.codePostal = messages[lang].ePostalReq
        else if (!/^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/.test(data.codePostal)) e.codePostal = messages[lang].ePostalBad

        setErrors(e)
        return e
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const eMap = validate()
        if (Object.keys(eMap).length) {
            requestAnimationFrame(() => errorSummaryRef.current?.focus())
            return
        }
        // TODO: remplacer par ton submit réel (API/route)
        console.log('Étape 1 — Données:', data)
        alert(lang === 'fr' ? 'Étape 1 soumise (simulation).' : 'Step 1 submitted (demo).')
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
            {/* En-tête visuel identique à l’accueil */}
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

                        {/* Bascule de langue (bouton, pas de lien) */}
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

                    {/* Titre + fil d’Ariane (non-navigants) */}
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

            {/* Corps principal style “hero card” comme l’accueil */}
            <main id="main" role="main" className="flex-1">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 sm:p-12 border border-blue-100">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{t('heroTitle')}</h2>
                            <p className="text-lg text-slate-700 leading-relaxed mb-8">{t('heroDesc')}</p>

                            {/* Résumé d’erreurs (bilingue) */}
                            {Object.keys(errors).length > 0 && (
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
                                        {Object.entries(errors).map(([field, msg]) => (
                                            <li key={field}>
                                                <button
                                                    type="button"
                                                    className="underline"
                                                    onClick={() => document.getElementById(`field-${field}`)?.focus()}
                                                >
                                                    {msg}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Formulaire dans un panneau blanc à bord gauche bleu */}
                            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-700">
                                <form noValidate onSubmit={handleSubmit} className="space-y-8">
                                    {/* Nom légal */}
                                    <fieldset className="space-y-4">
                                        <legend className="text-lg font-semibold text-slate-900">{t('legendName')}</legend>
                                        <div>
                                            <label htmlFor="field-prenom" className="block text-sm font-medium text-slate-900">{t('firstName')}</label>
                                            <input
                                                id="field-prenom"
                                                name="prenom"
                                                type="text"
                                                autoComplete="given-name"
                                                value={data.prenom}
                                                onChange={onChange('prenom')}
                                                className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                    errors.prenom ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                aria-invalid={!!errors.prenom}
                                                aria-describedby={errors.prenom ? 'error-prenom' : undefined}
                                                required
                                            />
                                            {errors.prenom && <p id="error-prenom" className="mt-1 text-sm text-red-700">{errors.prenom}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="field-nom" className="block text-sm font-medium text-slate-900">{t('lastName')}</label>
                                            <input
                                                id="field-nom"
                                                name="nom"
                                                type="text"
                                                autoComplete="family-name"
                                                value={data.nom}
                                                onChange={onChange('nom')}
                                                className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                    errors.nom ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                aria-invalid={!!errors.nom}
                                                aria-describedby={errors.nom ? 'error-nom' : undefined}
                                                required
                                            />
                                            {errors.nom && <p id="error-nom" className="mt-1 text-sm text-red-700">{errors.nom}</p>}
                                        </div>
                                    </fieldset>

                                    {/* Naissance */}
                                    <fieldset className="space-y-4">
                                        <legend className="text-lg font-semibold text-slate-900">{t('legendDob')}</legend>
                                        <div>
                                            <label htmlFor="field-dateNaissance" className="block text-sm font-medium text-slate-900">
                                                {t('dobLabel')}
                                            </label>
                                            <input
                                                id="field-dateNaissance"
                                                name="dateNaissance"
                                                type="date"
                                                inputMode="numeric"
                                                value={data.dateNaissance}
                                                onChange={onChange('dateNaissance')}
                                                className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                    errors.dateNaissance ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                aria-invalid={!!errors.dateNaissance}
                                                aria-describedby={errors.dateNaissance ? 'error-dob' : undefined}
                                                required
                                            />
                                            {errors.dateNaissance && <p id="error-dob" className="mt-1 text-sm text-red-700">{errors.dateNaissance}</p>}
                                        </div>
                                    </fieldset>

                                    {/* Coordonnées */}
                                    <fieldset className="space-y-4">
                                        <legend className="text-lg font-semibold text-slate-900">{t('legendContact')}</legend>
                                        <div>
                                            <label htmlFor="field-courriel" className="block text-sm font-medium text-slate-900">{t('email')}</label>
                                            <input
                                                id="field-courriel"
                                                name="courriel"
                                                type="email"
                                                autoComplete="email"
                                                value={data.courriel}
                                                onChange={onChange('courriel')}
                                                className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                    errors.courriel ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                aria-invalid={!!errors.courriel}
                                                aria-describedby={errors.courriel ? 'error-courriel' : undefined}
                                                required
                                            />
                                            {errors.courriel && <p id="error-courriel" className="mt-1 text-sm text-red-700">{errors.courriel}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="field-telephone" className="block text-sm font-medium text-slate-900">{t('phone')}</label>
                                            <input
                                                id="field-telephone"
                                                name="telephone"
                                                type="tel"
                                                inputMode="tel"
                                                autoComplete="tel"
                                                placeholder={messages[lang].phonePh}
                                                value={data.telephone}
                                                onChange={onChange('telephone')}
                                                className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                    errors.telephone ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                aria-invalid={!!errors.telephone}
                                                aria-describedby={errors.telephone ? 'error-telephone' : undefined}
                                                required
                                            />
                                            {errors.telephone && <p id="error-telephone" className="mt-1 text-sm text-red-700">{errors.telephone}</p>}
                                        </div>
                                    </fieldset>

                                    {/* Adresse postale */}
                                    <fieldset className="space-y-4">
                                        <legend className="text-lg font-semibold text-slate-900">{t('legendAddress')}</legend>
                                        <div>
                                            <label htmlFor="field-adresse1" className="block text-sm font-medium text-slate-900">{t('addr1')}</label>
                                            <input
                                                id="field-adresse1"
                                                name="adresse1"
                                                type="text"
                                                autoComplete="address-line1"
                                                value={data.adresse1}
                                                onChange={onChange('adresse1')}
                                                className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                    errors.adresse1 ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                aria-invalid={!!errors.adresse1}
                                                aria-describedby={errors.adresse1 ? 'error-adresse1' : undefined}
                                                required
                                            />
                                            {errors.adresse1 && <p id="error-adresse1" className="mt-1 text-sm text-red-700">{errors.adresse1}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="field-adresse2" className="block text-sm font-medium text-slate-900">{t('addr2')}</label>
                                            <input
                                                id="field-adresse2"
                                                name="adresse2"
                                                type="text"
                                                autoComplete="address-line2"
                                                value={data.adresse2 || ''}
                                                onChange={onChange('adresse2')}
                                                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="field-ville" className="block text-sm font-medium text-slate-900">{t('city')}</label>
                                                <input
                                                    id="field-ville"
                                                    name="ville"
                                                    type="text"
                                                    autoComplete="address-level2"
                                                    value={data.ville}
                                                    onChange={onChange('ville')}
                                                    className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                        errors.ville ? 'border-red-500' : 'border-slate-300'
                                                    }`}
                                                    aria-invalid={!!errors.ville}
                                                    aria-describedby={errors.ville ? 'error-ville' : undefined}
                                                    required
                                                />
                                                {errors.ville && <p id="error-ville" className="mt-1 text-sm text-red-700">{errors.ville}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="field-province" className="block text-sm font-medium text-slate-900">{t('province')}</label>
                                                <select
                                                    id="field-province"
                                                    name="province"
                                                    value={data.province}
                                                    onChange={onChange('province')}
                                                    className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-blue-600 focus:border-blue-600 ${
                                                        errors.province ? 'border-red-500' : 'border-slate-300'
                                                    }`}
                                                    aria-invalid={!!errors.province}
                                                    aria-describedby={errors.province ? 'error-province' : undefined}
                                                    required
                                                >
                                                    <option value="">{lang === 'fr' ? '— Sélectionner —' : '— Select —'}</option>
                                                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                                                </select>
                                                {errors.province && <p id="error-province" className="mt-1 text-sm text-red-700">{errors.province}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="field-codePostal" className="block text-sm font-medium text-slate-900">{t('postal')}</label>
                                                <input
                                                    id="field-codePostal"
                                                    name="codePostal"
                                                    type="text"
                                                    autoComplete="postal-code"
                                                    placeholder={messages[lang].postalPh}
                                                    value={data.codePostal}
                                                    onChange={onChange('codePostal')}
                                                    className={`mt-2 block w-full rounded-md border px-3 py-2 uppercase tracking-wider focus:ring-blue-600 focus:border-blue-600 ${
                                                        errors.codePostal ? 'border-red-500' : 'border-slate-300'
                                                    }`}
                                                    aria-invalid={!!errors.codePostal}
                                                    aria-describedby={errors.codePostal ? 'error-cp' : undefined}
                                                    required
                                                />
                                                {errors.codePostal && <p id="error-cp" className="mt-1 text-sm text-red-700">{errors.codePostal}</p>}
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* Actions (CTA style accueil) */}
                                    <div className="flex items-center gap-4 pt-2">
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
                                            onClick={() => { setData(initialData); setErrors({}) }}
                                            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-semibold text-slate-800 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all"
                                        >
                                            {t('clear')}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Bloc d’aide jaune (mêmes styles) */}
                            <section aria-labelledby="support-heading" className="bg-amber-50 rounded-2xl p-6 sm:p-8 border-2 border-amber-200 mt-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden>ℹ️</div>
                                    <div className="flex-1">
                                        <h2 id="support-heading" className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{t('supportTitle')}</h2>
                                        <p className="text-slate-700">{t('supportDesc')}</p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <span aria-hidden>📞</span> {t('supportPhone')}
                                        </h3>
                                        <p className="text-blue-700 text-xl font-semibold">1-800-123-4567</p>
                                        <p className="text-sm text-slate-600 mt-2">{t('supportHours')}</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <span aria-hidden>📧</span> {t('supportOnline')}
                                        </h3>
                                        <ul className="space-y-2 text-sm">
                                            <li><button type="button" aria-disabled className="text-blue-700 underline underline-offset-2">{t('supportHelp')}</button></li>
                                            <li><button type="button" aria-disabled className="text-blue-700 underline underline-offset-2">{t('supportPledge')}</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                </div>
            </main>

            {/* Pied de page (sans liens réels) */}
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
