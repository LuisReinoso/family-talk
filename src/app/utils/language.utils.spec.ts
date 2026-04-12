import { normalizeLanguage } from './language.utils';

describe('language.utils', () => {
  describe('normalizeLanguage', () => {
    it('should return "es" for Spanish language codes', () => {
      expect(normalizeLanguage('es')).toBe('es');
      expect(normalizeLanguage('es-ES')).toBe('es');
      expect(normalizeLanguage('es-AR')).toBe('es');
      expect(normalizeLanguage('es-MX')).toBe('es');
    });

    it('should return "en" for English language codes', () => {
      expect(normalizeLanguage('en')).toBe('en');
      expect(normalizeLanguage('en-US')).toBe('en');
      expect(normalizeLanguage('en-GB')).toBe('en');
    });

    it('should return "en" as fallback for null', () => {
      expect(normalizeLanguage(null)).toBe('en');
    });

    it('should return "en" as fallback for unsupported languages', () => {
      expect(normalizeLanguage('fr')).toBe('en');
      expect(normalizeLanguage('de')).toBe('en');
      expect(normalizeLanguage('ja')).toBe('en');
    });

    it('should prioritize "es" when both "es" and "en" are present', () => {
      expect(normalizeLanguage('es-en')).toBe('es');
    });
  });
});