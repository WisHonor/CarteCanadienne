'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Lang = 'fr' | 'en'

const messages = {
    fr: {
        gc: 'Gouvernement du Canada',
        svc: 'Service de la Carte d\'accessibilité',
        langToggle: 'English',
        langToggleSr: '— Basculer vers l\'anglais',

        h1: 'Demande — Étape 3 : Documents',
        bcHome: 'Accueil',
        bcForm: 'Demande',
        bcStep: 'Étape 3 : Documents',

        heroTitle: 'Documents justificatifs',
        heroDesc: 'Veuillez téléverser une preuve d\'identité et un document médical attestant de votre situation de handicap.',

        legendIdentity: 'Preuve d\'identité',
        identityDesc: 'Téléversez une copie de votre carte d\'identité, permis de conduire, passeport ou carte d\'assurance maladie.',
        legendMedical: 'Preuve médicale',
        medicalDesc: 'Téléversez un document médical récent (lettre du médecin, rapport médical, certificat d\'invalidité, etc.).',
        
        chooseFile: 'Choisir un fichier',
        fileHint: 'Formats acceptés : JPG, PNG, PDF (max 10 Mo)',
        uploading: 'Téléversement en cours...',
        uploaded: 'Téléversé avec succès',
        changeFile: 'Changer',
        
        continue: 'Soumettre la demande',
        back: 'Retour',

        errTitle: 'Veuillez corriger les erreurs suivantes :',
        errIdentity: 'Veuillez téléverser une preuve d\'identité.',
        errMedical: 'Veuillez téléverser un document médical.',
        errFileSize: 'Le fichier ne doit pas dépasser 10 Mo.',
        errFileType: 'Format de fichier non accepté.',
        errUpload: 'Erreur lors du téléversement.',
        errMissingData: 'Données manquantes. Veuillez recommencer depuis l\'étape 1.',
    },
    en: {
        gc: 'Government of Canada',
        svc: 'Accessible Card Service',
        langToggle: 'Français',
        langToggleSr: '— Switch to French',

        h1: 'Application — Step 3: Documents',
        bcHome: 'Home',
        bcForm: 'Application',
        bcStep: 'Step 3: Documents',

        heroTitle: 'Supporting documents',
        heroDesc: 'Please upload proof of identity and a medical document attesting to your disability.',

        legendIdentity: 'Proof of identity',
        identityDesc: 'Upload a copy of your ID card, driver\'s license, passport, or health insurance card.',
        legendMedical: 'Medical proof',
        medicalDesc: 'Upload a recent medical document (doctor\'s letter, medical report, disability certificate, etc.).',
        
        chooseFile: 'Choose file',
        fileHint: 'Accepted formats: JPG, PNG, PDF (max 10 MB)',
        uploading: 'Uploading...',
        uploaded: 'Successfully uploaded',
        changeFile: 'Change',
        
        continue: 'Submit application',
        back: 'Back',

        errTitle: 'Please fix the following errors:',
        errIdentity: 'Please upload proof of identity.',
        errMedical: 'Please upload a medical document.',
        errFileSize: 'File must not exceed 10 MB.',
        errFileType: 'Unsupported file format.',
        errUpload: 'Upload error.',
        errMissingData: 'Missing data. Please start from step 1.',
    },
} as const

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

type UploadState = {
    file: File | null
    uploading: boolean
    uploaded: boolean
    error: string
    url: string
    s3Key: string // S3 key for database storage
}

export default function Etape3() {
    const router = useRouter()
    const [lang, setLang] = useState<Lang>('fr')
    const [mounted, setMounted] = useState(false)
    const t = <K extends keyof typeof messages['fr']>(k: K) => messages[lang][k]
    const errorSummaryRef = useRef<HTMLDivElement>(null)

    const [identityUpload, setIdentityUpload] = useState<UploadState>({
        file: null,
        uploading: false,
        uploaded: false,
        error: '',
        url: '',
        s3Key: '',
    })

    const [medicalUpload, setMedicalUpload] = useState<UploadState>({
        file: null,
        uploading: false,
        uploaded: false,
        error: '',
        url: '',
        s3Key: '',
    })

    const [errors, setErrors] = useState<Record<'identity' | 'medical', string>>({} as any)
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            errorSummaryRef.current?.focus()
        }
    }, [errors])

    const validateFile = (file: File): string => {
        if (file.size > MAX_FILE_SIZE) return t('errFileSize')
        if (!ACCEPTED_TYPES.includes(file.type)) return t('errFileType')
        return ''
    }

    const uploadFile = async (file: File, type: 'identity' | 'medical'): Promise<{ url: string; s3Key: string }> => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        const response = await fetch('/api/upload-documents', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')
        const data = await response.json()
        return { url: data.url, s3Key: data.s3Key }
    }

    const handleFileSelect = async (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'identity' | 'medical'
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validationError = validateFile(file)
        const setState = type === 'identity' ? setIdentityUpload : setMedicalUpload

        if (validationError) {
            setState(prev => ({ ...prev, error: validationError }))
            return
        }

        setState({
            file,
            uploading: true,
            uploaded: false,
            error: '',
            url: '',
            s3Key: '',
        })

        try {
            const { url, s3Key } = await uploadFile(file, type)
            setState({
                file,
                uploading: false,
                uploaded: true,
                error: '',
                url,
                s3Key,
            })
            setErrors(prev => ({ ...prev, [type]: '' }))
        } catch (err) {
            setState({
                file,
                uploading: false,
                uploaded: false,
                error: t('errUpload'),
                url: '',
                s3Key: '',
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: Record<string, string> = {}
        if (!identityUpload.uploaded) newErrors.identity = t('errIdentity')
        if (!medicalUpload.uploaded) newErrors.medical = t('errMedical')

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors as any)
            return
        }

        const step1Data = sessionStorage.getItem('demande-step1')
        const step2Data = sessionStorage.getItem('demande-step2')
        const editingApplicationId = sessionStorage.getItem('editing-application-id')

        if (!step1Data || !step2Data) {
            alert(t('errMissingData'))
            router.push('/demande')
            return
        }

        setIsSubmitting(true)

        try {
            const requestData = {
                step1: JSON.parse(step1Data),
                step2: JSON.parse(step2Data),
                identityDocUrl: identityUpload.s3Key, // Store S3 key, not the presigned URL
                medicalDocUrl: medicalUpload.s3Key, // Store S3 key, not the presigned URL
                applicationId: editingApplicationId || undefined, // Include if editing
            }
            
            console.log('Submitting application with data:', requestData)
            
            const response = await fetch('/api/save-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            })

            if (response.ok) {
                const result = await response.json()
                console.log('Application saved:', result)
                
                // Clear editing flag if present
                sessionStorage.removeItem('editing-application-id')
                
                // If editing, redirect to view page; otherwise to verification status
                if (editingApplicationId) {
                    const step1 = JSON.parse(step1Data!)
                    router.push(`/application/view?email=${encodeURIComponent(step1.courriel)}`)
                } else {
                    // Don't clear sessionStorage yet - verification-status needs it
                    // sessionStorage will be cleared after viewing the status
                    router.push(`/demande/verification-status?id=${result.applicationId}`)
                }
            } else {
                // Get detailed error message from API
                const errorData = await response.json()
                console.error('API Error Response:', errorData)
                console.error('Status:', response.status)
                
                // Show detailed error to user
                const errorMsg = errorData.details 
                    ? `Failed to submit: ${errorData.details}` 
                    : 'Failed to submit. Please try again.'
                alert(errorMsg)
                setIsSubmitting(false)
            }
        } catch (err) {
            console.error('Submit error:', err)
            alert('An error occurred. Please try again.')
            setIsSubmitting(false)
        }
    }

    const FileUploadBox = ({ 
        upload, 
        type, 
        legend, 
        desc 
    }: { 
        upload: UploadState
        type: 'identity' | 'medical'
        legend: string
        desc: string
    }) => (
        <fieldset className="space-y-3">
            <legend className="text-lg font-semibold text-slate-900">{legend}</legend>
            <p className="text-sm text-slate-600">{desc}</p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
                {!upload.file ? (
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-blue-700 font-medium">{t('chooseFile')}</span>
                        <span className="text-xs text-slate-500">{t('fileHint')}</span>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileSelect(e, type)}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{upload.file.name}</p>
                                <p className="text-xs text-slate-500">
                                    {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        
                        {upload.uploading && (
                            <div className="flex items-center gap-2 text-blue-700">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm">{t('uploading')}</span>
                            </div>
                        )}
                        
                        {upload.uploaded && (
                            <div className="flex items-center gap-2 text-green-700">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-medium">{t('uploaded')}</span>
                            </div>
                        )}
                        
                        {upload.error && (
                            <p className="text-sm text-red-700">{upload.error}</p>
                        )}
                        
                        <label className="inline-block">
                            <span className="text-sm text-blue-700 underline cursor-pointer">{t('changeFile')}</span>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileSelect(e, type)}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
            </div>
        </fieldset>
    )

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
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

            <main id="main" role="main" className="flex-1">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 sm:p-12 border border-blue-100">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{t('heroTitle')}</h2>
                            <p className="text-lg text-slate-700 leading-relaxed mb-8">{t('heroDesc')}</p>

                            {(errors.identity || errors.medical) && (
                                <div
                                    ref={errorSummaryRef}
                                    tabIndex={-1}
                                    className="mb-6 rounded-md border border-red-300 bg-red-50 p-4"
                                >
                                    <h3 className="text-red-800 font-semibold">{t('errTitle')}</h3>
                                    <ul className="mt-2 list-disc ps-6 text-red-800">
                                        {errors.identity && <li>{errors.identity}</li>}
                                        {errors.medical && <li>{errors.medical}</li>}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-700">
                                <form noValidate onSubmit={handleSubmit} className="space-y-8">
                                    <FileUploadBox
                                        upload={identityUpload}
                                        type="identity"
                                        legend={t('legendIdentity')}
                                        desc={t('identityDesc')}
                                    />

                                    <FileUploadBox
                                        upload={medicalUpload}
                                        type="medical"
                                        legend={t('legendMedical')}
                                        desc={t('medicalDesc')}
                                    />

                                    <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-semibold text-slate-800 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all"
                                            disabled={isSubmitting}
                                        >
                                            {t('back')}
                                        </button>

                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 text-lg font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting || identityUpload.uploading || medicalUpload.uploading}
                                        >
                                            {isSubmitting ? (lang === 'fr' ? 'Soumission...' : 'Submitting...') : t('continue')}
                                            {!isSubmitting && (
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

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
                                <li><button type="button" aria-disabled className="hover:text-white underline underline-offset-2">{lang === 'fr' ? 'Centre d\'aide' : 'Help centre'}</button></li>
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
