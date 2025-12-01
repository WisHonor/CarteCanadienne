// Shared service and disability label mappings

export const SERVICE_LABELS: Record<string, { fr: string; en: string }> = {
    parking: { fr: 'Permis de stationnement réservé', en: 'Accessible parking permit' },
    prioritySeating: { fr: 'Siège prioritaire', en: 'Priority seating' },
    companionFare: { fr: 'Tarif accompagnateur', en: 'Companion fare' },
    transitPass: { fr: 'Carte de transport accessible', en: 'Accessible transit pass' },
    aslInterpreter: { fr: 'Interprétation en LSQ/ASL', en: 'Sign language interpretation' },
    braille: { fr: 'Documentation en braille', en: 'Braille materials' },
    largePrint: { fr: 'Documents en gros caractères', en: 'Large-print materials' },
    audioDesc: { fr: 'Audiodescription', en: 'Audio description' },
    listening: { fr: 'Système d\'écoute assistée', en: 'Assistive listening devices' },
    commAssist: { fr: 'Aide à la communication', en: 'Communication assistance' },
    serviceAnimal: { fr: 'Accueil d\'animal d\'assistance', en: 'Service animal accommodation' },
    housing: { fr: 'Adaptations de logement', en: 'Accessible housing modifications' },
    employment: { fr: 'Mesures d\'adaptation au travail', en: 'Employment accommodations' },
    education: { fr: 'Soutiens aux études', en: 'Education supports' },
    equipment: { fr: 'Subvention d\'équipement médical', en: 'Medical equipment subsidy' },
}

export const DISABILITY_LABELS: Record<string, { fr: string; en: string }> = {
    mobility: { fr: 'Mobilité', en: 'Mobility' },
    vision: { fr: 'Vision', en: 'Vision' },
    hearing: { fr: 'Audition', en: 'Hearing' },
    cognitive: { fr: 'Cognitif', en: 'Cognitive' },
    mentalHealth: { fr: 'Santé mentale', en: 'Mental health' },
    speech: { fr: 'Parole/communication', en: 'Speech/communication' },
    chronicPain: { fr: 'Douleur chronique', en: 'Chronic pain' },
    neurological: { fr: 'Neurologique', en: 'Neurological' },
    autism: { fr: 'Autisme/TSA', en: 'Autism/ASD' },
    intellectual: { fr: 'Déficience intellectuelle', en: 'Intellectual disability' },
    learning: { fr: 'Trouble d\'apprentissage', en: 'Learning disability' },
    other: { fr: 'Autre', en: 'Other' },
}

/**
 * Convert service keys to display labels in the specified language
 * @param keys - Array of service keys (e.g., ['companionFare', 'largePrint'])
 * @param lang - Language code ('fr' or 'en')
 * @returns Array of human-readable service labels
 */
export function getServiceLabels(keys: string[], lang: 'fr' | 'en' = 'fr'): string[] {
    return keys
        .map(key => SERVICE_LABELS[key]?.[lang])
        .filter(Boolean) as string[]
}

/**
 * Convert disability keys to display labels in the specified language
 * @param keys - Array of disability keys (e.g., ['mobility', 'vision'])
 * @param lang - Language code ('fr' or 'en')
 * @returns Array of human-readable disability labels
 */
export function getDisabilityLabels(keys: string[], lang: 'fr' | 'en' = 'fr'): string[] {
    return keys
        .map(key => DISABILITY_LABELS[key]?.[lang])
        .filter(Boolean) as string[]
}
