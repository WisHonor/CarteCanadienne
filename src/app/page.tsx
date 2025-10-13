'use client'
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        {/* Lien d'évitement */}
        <a
            href="#contenu-principal"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:rounded-lg focus:bg-blue-700 focus:text-white focus:font-semibold focus:shadow-lg focus:ring-4 focus:ring-blue-300"
        >
          Passer au contenu principal
        </a>

        {/* En-tête */}
        <header role="banner" className="bg-white shadow-sm border-b-4 border-blue-700">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Bandeau du gouvernement */}
            <div className="flex items-center justify-between py-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Gouvernement du Canada</p>
                  <p className="text-sm text-slate-800 font-semibold">Service de la Carte d'accessibilité</p>
                </div>
              </div>

              {/* Bascule de langue */}
              <a
                  href="/en"
                  hrefLang="en"
                  lang="en"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
              >
                <span className="text-lg" aria-hidden="true">🇬🇧</span>
                English
                <span className="sr-only">— Basculer vers l'anglais</span>
              </a>
            </div>

            {/* Titre principal */}
            <div className="py-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                Carte canadienne du handicap
              </h1>

              {/* Fil d'Ariane */}
              <nav aria-label="Fil d'Ariane" className="mt-4">
                <ol className="flex flex-wrap items-center gap-2 text-sm">
                  <li>
                    <a
                        href="/"
                        className="text-blue-700 hover:text-blue-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded"
                    >
                      Accueil
                    </a>
                  </li>
                  <li aria-hidden="true" className="text-slate-400">›</li>
                  <li aria-current="page" className="font-medium text-slate-900">
                    Carte canadienne du handicap
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main id="contenu-principal" role="main" className="flex-1">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">

            {/* Section héro avec CTA */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 sm:p-12 mb-12 border border-blue-100">
              <div className="max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Obtenez votre carte d'accessibilité
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  La Carte canadienne du handicap vous permet d'accéder à des services et accommodements adaptés à travers le pays. Notre formulaire en ligne est conçu pour être accessible, sécurisé et facile à utiliser.
                </p>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-700 mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Ce dont vous aurez besoin :</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Une pièce d'identité valide (permis de conduire, passeport)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Preuve d'admissibilité (certificat médical, attestation d'invalidité)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Environ 15-20 minutes pour remplir le formulaire</span>
                    </li>
                  </ul>
                </div>

                <a
                    href="/demande"
                    className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 text-lg font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Commencer la demande
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <p className="mt-4 text-sm text-slate-600">
                  Vous pourrez sauvegarder un brouillon et reprendre plus tard.
                </p>
              </div>
            </section>

            {/* Grille de fonctionnalités */}
            <section aria-labelledby="features-heading" className="mb-12">
              <h2 id="features-heading" className="text-2xl font-bold text-slate-900 mb-8">
                Pourquoi utiliser notre service en ligne ?
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "100% Accessible",
                    description: "Navigation au clavier, lecteurs d'écran, contrastes conformes WCAG 2.2 AA",
                    icon: "♿"
                  },
                  {
                    title: "Sécurisé",
                    description: "Vos données sont protégées et chiffrées selon les normes gouvernementales",
                    icon: "🔒"
                  },
                  {
                    title: "Multilingue",
                    description: "Formulaire disponible en français et en anglais",
                    icon: "🌐"
                  },
                  {
                    title: "Suivi en temps réel",
                    description: "Vérifiez l'état de votre demande à tout moment",
                    icon: "📊"
                  },
                  {
                    title: "Support 24/7",
                    description: "Aide disponible par téléphone, courriel et clavardage",
                    icon: "💬"
                  },
                  {
                    title: "Rapide",
                    description: "Traitement accéléré par rapport aux demandes papier",
                    icon: "⚡"
                  }
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-200">
                      <div className="text-4xl mb-3" aria-hidden="true">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
              </div>
            </section>

            {/* Section Accessibilité et soutien */}
            <section aria-labelledby="support-heading" className="bg-amber-50 rounded-2xl p-8 sm:p-10 border-2 border-amber-200 mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 id="support-heading" className="text-2xl font-bold text-slate-900 mb-2">
                    Besoin d'aide ?
                  </h2>
                  <p className="text-slate-700">
                    Nous sommes là pour vous accompagner à chaque étape du processus.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span aria-hidden="true">📞</span>
                    Par téléphone
                  </h3>
                  <a
                      href="tel:+18001234567"
                      className="text-blue-700 text-xl font-semibold hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded"
                      aria-label="Téléphone, 1 800 123-4567"
                  >
                    1‑800‑123‑4567
                  </a>
                  <p className="text-sm text-slate-600 mt-2">Lundi au vendredi, 8h à 20h (HE)</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span aria-hidden="true">📧</span>
                    Ressources en ligne
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/aide" className="text-blue-700 hover:text-blue-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded">
                        Centre d'aide et FAQ
                      </a>
                    </li>
                    <li>
                      <a href="/accessibilite" className="text-blue-700 hover:text-blue-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded">
                        Engagement en accessibilité
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Région de statut pour annonces dynamiques */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              Aucune notification pour le moment.
            </div>
          </div>
        </main>

        {/* Pied de page */}
        <footer role="contentinfo" className="bg-slate-900 text-slate-300 border-t-4 border-blue-700">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Service de la Carte d'accessibilité</h3>
                <p className="text-sm leading-relaxed">
                  Offrir un accès équitable aux services et accommodements pour tous les Canadiens en situation de handicap.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
                <nav aria-label="Liens du pied de page">
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/aide" className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        Centre d'aide
                      </a>
                    </li>
                    <li>
                      <a href="/avis" className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        Avis
                      </a>
                    </li>
                    <li>
                      <a href="/confidentialite" className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        Confidentialité
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Engagement</h3>
                <nav aria-label="Liens d'engagement">
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/accessibilite" className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        Accessibilité
                      </a>
                    </li>
                    <li>
                      <a href="/signaler-un-probleme" className="hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                        Signaler un problème
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-8 text-sm">
              <p>© {new Date().getFullYear()} Gouvernement du Canada. Tous droits réservés.</p>
              <p className="mt-2 text-slate-400">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}