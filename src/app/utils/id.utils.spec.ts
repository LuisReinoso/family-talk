import { generateId, generateAvatarPaths } from './id.utils';

describe('id.utils', () => {
  describe('generateId', () => {
    it('should return a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should return a non-empty string', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate unique ids', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });
  });

  describe('generateAvatarPaths', () => {
    it('should return an array of avatar paths', () => {
      const paths = generateAvatarPaths();
      expect(Array.isArray(paths)).toBe(true);
      expect(paths.length).toBe(48); // 16 mainSeed * 3 rowSeed
    });

    it('should generate paths with correct format', () => {
      const paths = generateAvatarPaths();
      paths.forEach((path) => {
        expect(path).toMatch(/^\/assets\/faces\/\d+_\d+_\d+\.png$/);
      });
    });

    it('should always return the same paths', () => {
      const paths1 = generateAvatarPaths();
      const paths2 = generateAvatarPaths();
      expect(paths1).toEqual(paths2);
    });

    it('should include path for mainSeed 1, rowSeed 0', () => {
      const paths = generateAvatarPaths();
      expect(paths).toContain('/assets/faces/1_0_0.png');
    });

    it('should include path for mainSeed 16, rowSeed 2', () => {
      const paths = generateAvatarPaths();
      expect(paths).toContain('/assets/faces/16_2_2.png');
    });
  });
});