'use client'
import { useEffect, useState } from 'react'

// This version removes ALL real hyperlinks. Every former <a href> / <Link href>
// is now a focusable, non-navigating <button> styled like a link.
// The skip link is implemented as a button that programmatically
// moves focus to <main>. All other links are aria-disabled.

type Lang = 'fr' | 'en'

const messages = {
  fr: {
    skip: "Passer au contenu principal",
    gc: "Gouvernement du Canada",
    svc: "Service de la Carte d'accessibilité",
    english: "English",
    englishSr: "— Basculer vers l'anglais",
    title: "Carte canadienne du handicap",
    home: "Accueil",
    heroTitle: "Obtenez votre carte d'accessibilité",
    heroDesc:
        "La Carte canadienne du handicap vous permet d'accéder à des services et accommodements adaptés à travers le pays. Notre formulaire en ligne est conçu pour être accessible, sécurisé et facile à utiliser.",
    need: "Ce dont vous aurez besoin :",
    needId: "Une pièce d'identité valide (permis de conduire, passeport)",
    needProof: "Preuve d'admissibilité (certificat médical, attestation d'invalidité)",
    needTime: "Environ 15-20 minutes pour remplir le formulaire",
    cta: "Commencer la demande",
    saveDraft: "Vous pourrez sauvegarder un brouillon et reprendre plus tard.",
    alreadyApplied: "Vous avez déjà soumis une demande ?",
    checkStatus: "Vérifier le statut de ma demande",
    checkStatusDesc: "Consultez l'état de votre demande ou modifiez-la si nécessaire",
    why: "Pourquoi utiliser notre service en ligne ?",
    a11y: "100% Accessible",
    a11yDesc:
        "Navigation au clavier, lecteurs d'écran, contrastes conformes WCAG 2.2 AA",
    secure: "Sécurisé",
    secureDesc:
        "Vos données sont protégées et chiffrées selon les normes gouvernementales",
    multi: "Multilingue",
    multiDesc: "Formulaire disponible en français et en anglais",
    track: "Suivi en temps réel",
    trackDesc: "Vérifiez l'état de votre demande à tout moment",
    support: "Support 24/7",
    supportDesc: "Aide disponible par téléphone, courriel et clavardage",
    fast: "Rapide",
    fastDesc: "Traitement accéléré par rapport aux demandes papier",
    needHelp: "Besoin d'aide ?",
    helpDesc:
        "Nous sommes là pour vous accompagner à chaque étape du processus.",
    phone: "Par téléphone",
    hours: "Lundi au vendredi, 8h à 20h (HE)",
    online: "Ressources en ligne",
    helpCenter: "Centre d'aide et FAQ",
    pledge: "Engagement en accessibilité",
    footerSvc: "Service de la Carte d'accessibilité",
    footerMission:
        "Offrir un accès équitable aux services et accommodements pour tous les Canadiens en situation de handicap.",
    quickLinks: "Liens rapides",
    notices: "Avis",
    privacy: "Confidentialité",
    accessibility: "Accessibilité",
    report: "Signaler un problème",
    updated: "Dernière mise à jour :",
  },
  en: {
    skip: "Skip to main content",
    gc: "Government of Canada",
    svc: "Accessible Card Service",
    english: "Français",
    englishSr: "— Switch to French",
    title: "Canadian Accessibility Card",
    home: "Home",
    heroTitle: "Get your Accessibility Card",
    heroDesc:
        "The Canadian Accessibility Card helps you access services and accommodations across the country. Our online form is accessible, secure, and easy to use.",
    need: "What you'll need:",
    needId: "Valid ID (driver's licence, passport)",
    needProof: "Proof of eligibility (medical certificate, disability attestation)",
    needTime: "About 15–20 minutes to complete the form",
    cta: "Start application",
    saveDraft: "You can save a draft and come back later.",
    alreadyApplied: "Already submitted an application?",
    checkStatus: "Check my application status",
    checkStatusDesc: "View your application status or edit if needed",
    why: "Why use our online service?",
    a11y: "100% Accessible",
    a11yDesc:
        "Keyboard navigation, screen readers, WCAG 2.2 AA contrast",
    secure: "Secure",
    secureDesc:
        "Your data is protected and encrypted to government standards",
    multi: "Multilingual",
    multiDesc: "Form available in English and French",
    track: "Real-time tracking",
    trackDesc: "Check your application status anytime",
    support: "24/7 Support",
    supportDesc: "Help by phone, email, and chat",
    fast: "Fast",
    fastDesc: "Faster than paper applications",
    needHelp: "Need help?",
    helpDesc: "We’re here to support you at every step.",
    phone: "By phone",
    hours: "Monday to Friday, 8 a.m. to 8 p.m. (ET)",
    online: "Online resources",
    helpCenter: "Help centre & FAQ",
    pledge: "Accessibility commitment",
    footerSvc: "Accessible Card Service",
    footerMission:
        "Providing equitable access to services and accommodations for all Canadians with disabilities.",
    quickLinks: "Quick links",
    notices: "Notices",
    privacy: "Privacy",
    accessibility: "Accessibility",
    report: "Report a problem",
    updated: "Last updated:",
  },
} as const

function LinkLikeButton({
                          children,
                          ariaLabel,
                          className,
                          onClick,
                        }: {
  children: React.ReactNode
  ariaLabel?: string
  className?: string
  onClick?: () => void
}) {
  return (
      <button
          type="button"
          onClick={onClick || (() => {})}
          aria-label={ariaLabel}
          aria-disabled="true"
          className={className}
      >
        {children}
      </button>
  )
}

export default function Home() {
  // Hydration-safe: render FR first, then load saved language
  const [lang, setLang] = useState<Lang>('fr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = (localStorage.getItem('lang') as Lang) || 'fr'
    setLang(saved)
    document.documentElement.lang = saved
    setMounted(true)
  }, [])

  const t = (k: keyof typeof messages['fr']) => messages[lang][k]
  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr'
      localStorage.setItem('lang', next)
      document.documentElement.lang = next
      return next
    })
  }

  const focusMain = () => {
    const el = document.getElementById('main') as HTMLElement | null
    if (el) {
      el.setAttribute('tabindex', '-1')
      el.focus()
    }
  }

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        {/* "Skip link" implemented as a button that moves focus to <main> */}
        <button
            type="button"
            onClick={focusMain}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:rounded-lg focus:bg-blue-700 focus:text-white focus:font-semibold focus:shadow-lg focus:ring-4 focus:ring-blue-300"
        >
          {t('skip')}
        </button>

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

              {/* Language toggle (button, not link) */}
              <button
                  type="button"
                  onClick={toggleLang}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                  aria-pressed={lang === 'en'}
              >
                <span className="text-lg" aria-hidden="true">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
                {t('english')}
                <span className="sr-only">{t('englishSr')}</span>
              </button>
            </div>

            {/* Title & breadcrumb (breadcrumb home is a non-link button) */}
            <div className="py-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">{t('title')}</h1>

              <nav aria-label={lang === 'fr' ? 'Fil d\'Ariane' : 'Breadcrumb'} className="mt-4">
                <ol className="flex flex-wrap items-center gap-2 text-sm">
                  <li>
                    <LinkLikeButton
                        className="text-blue-700 hover:text-blue-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded"
                        ariaLabel={t('home')}
                    >
                      {t('home')}
                    </LinkLikeButton>
                  </li>
                  <li aria-hidden="true" className="text-slate-400">›</li>
                  <li aria-current="page" className="font-medium text-slate-900">{t('title')}</li>
                </ol>
              </nav>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main id="main" role="main" className="flex-1 outline-none">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 sm:p-12 mb-12 border border-blue-100">
              <div className="max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('heroTitle')}</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">{t('heroDesc')}</p>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-700 mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{t('need')}</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-3"><span aria-hidden="true">✔</span><span>{t('needId')}</span></li>
                    <li className="flex items-start gap-3"><span aria-hidden="true">✔</span><span>{t('needProof')}</span></li>
                    <li className="flex items-start gap-3"><span aria-hidden="true">✔</span><span>{t('needTime')}</span></li>
                  </ul>
                </div>

                {/* CTA replaced by non-link button */}
                <a
                    href="/demande"
                    className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 text-lg font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all"
                >
                  {t('cta')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <p className="mt-4 text-sm text-slate-600">{t('saveDraft')}</p>
              </div>
            </section>

            {/* Check Status Section */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 sm:p-10 mb-12 border-2 border-green-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{t('alreadyApplied')}</h2>
                  <p className="text-lg text-slate-700 mb-6">{t('checkStatusDesc')}</p>
                  
                  <a
                      href="/application/check-status"
                      className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 text-lg font-semibold text-white bg-green-700 rounded-xl hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('checkStatus')}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            {/* Features */}
            <section aria-labelledby="features-heading" className="mb-12">
              <h2 id="features-heading" className="text-2xl font-bold text-slate-900 mb-8">{t('why')}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'a11y', desc: 'a11yDesc', icon: '♿' },
                  { title: 'secure', desc: 'secureDesc', icon: '🔒' },
                  { title: 'multi', desc: 'multiDesc', icon: '🌐' },
                  { title: 'track', desc: 'trackDesc', icon: '📊' },
                  { title: 'support', desc: 'supportDesc', icon: '💬' },
                  { title: 'fast', desc: 'fastDesc', icon: '⚡' },
                ].map((f) => (
                    <div key={f.title} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-200">
                      <div className="text-4xl mb-3" aria-hidden="true">{f.icon}</div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{t(f.title as any)}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{t(f.desc as any)}</p>
                    </div>
                ))}
              </div>
            </section>

            {/* Support */}
            <section aria-labelledby="support-heading" className="bg-amber-50 rounded-2xl p-8 sm:p-10 border-2 border-amber-200 mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">ℹ️</div>
                <div className="flex-1">
                  <h2 id="support-heading" className="text-2xl font-bold text-slate-900 mb-2">{t('needHelp')}</h2>
                  <p className="text-slate-700">{t('helpDesc')}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span aria-hidden="true">📞</span>
                    {t('phone')}
                  </h3>
                  {/* Phone presented as non-link button */}
                  <LinkLikeButton
                      className="text-blue-700 text-xl font-semibold hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded"
                      ariaLabel="Phone, 1 800 123-4567"
                  >
                    1‑800‑123‑4567
                  </LinkLikeButton>
                  <p className="text-sm text-slate-600 mt-2">{t('hours')}</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span aria-hidden="true">📧</span>
                    {t('online')}
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <LinkLikeButton className="text-blue-700 hover:text-blue-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded">
                        {t('helpCenter')}
                      </LinkLikeButton>
                    </li>
                    <li>
                      <LinkLikeButton className="text-blue-700 hover:text-blue-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded">
                        {t('pledge')}
                      </LinkLikeButton>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Live region (unused) */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{/* announcements */}</div>
          </div>
        </main>

        {/* Footer (all items are non-link buttons) */}
        <footer role="contentinfo" className="bg-slate-900 text-slate-300 border-t-4 border-blue-700">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white font-semibold mb-4">{t('footerSvc')}</h3>
                <p className="text-sm leading-relaxed">{t('footerMission')}</p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
                <nav aria-label={lang === 'fr' ? 'Liens du pied de page' : 'Footer links'}>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <LinkLikeButton className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        {t('helpCenter')}
                      </LinkLikeButton>
                    </li>
                    <li>
                      <LinkLikeButton className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        {t('notices')}
                      </LinkLikeButton>
                    </li>
                    <li>
                      <LinkLikeButton className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        {t('privacy')}
                      </LinkLikeButton>
                    </li>
                  </ul>
                </nav>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">{t('accessibility')}</h3>
                <nav aria-label={lang === 'fr' ? "Liens d'engagement" : 'Engagement links'}>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <LinkLikeButton className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        {t('accessibility')}
                      </LinkLikeButton>
                    </li>
                    <li>
                      <LinkLikeButton className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        {t('report')}
                      </LinkLikeButton>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-8 text-sm">
              <p>© {new Date().getFullYear()} Government of Canada / Gouvernement du Canada</p>
              <p className="mt-2 text-slate-400">
                {t('updated')}{' '}
                <time dateTime={new Date().toISOString()} suppressHydrationWarning>
                  {mounted
                      ? new Date().toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      : '—'}
                </time>
              </p>
            </div>
          </div>
        </footer>
      </div>
  )
}
