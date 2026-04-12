export function normalizeLanguage(language: string | null): 'es' | 'en' {
  if (!language) return 'en';
  if (language.includes('es')) return 'es';
  if (language.includes('en')) return 'en';
  return 'en';
}