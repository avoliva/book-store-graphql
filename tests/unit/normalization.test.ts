import { normalizeId } from '../../src/utils/normalization';

describe('Normalization Utilities', () => {
  describe('normalizeId', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(normalizeId('  book123  ')).toBe('book123');
      expect(normalizeId('\t\nbook123\n\t')).toBe('book123');
    });

    it('should NOT remove special characters', () => {
      expect(normalizeId('abc#123')).toBe('abc#123');
      expect(normalizeId('book@123')).toBe('book@123');
      expect(normalizeId('book.123')).toBe('book.123');
    });

    it('should handle empty strings', () => {
      expect(normalizeId('')).toBe('');
      expect(normalizeId('   ')).toBe('');
    });
  });
});
