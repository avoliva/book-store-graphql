import { normalizeString, normalizeId } from '../../src/utils/normalization';

describe('Normalization Utilities', () => {
  describe('normalizeString', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(normalizeString('  hello  ')).toBe('hello');
      expect(normalizeString('\t\nhello\n\t')).toBe('hello');
      expect(normalizeString('  hello world  ')).toBe('hello world');
    });

    it('should remove control characters', () => {
      expect(normalizeString('hello\u0000world')).toBe('helloworld');
      expect(normalizeString('hello\u0001world')).toBe('helloworld');
      expect(normalizeString('hello\u001Fworld')).toBe('helloworld');
    });

    it('should preserve newline, tab, and carriage return', () => {
      expect(normalizeString('hello\nworld')).toBe('hello\nworld');
      expect(normalizeString('hello\tworld')).toBe('hello\tworld');
      expect(normalizeString('hello\rworld')).toBe('hello\rworld');
    });

    it('should handle empty strings', () => {
      expect(normalizeString('')).toBe('');
      expect(normalizeString('   ')).toBe('');
    });

    it('should handle non-string values', () => {
      expect(normalizeString(null as unknown as string)).toBe(null);
      expect(normalizeString(undefined as unknown as string)).toBe(undefined);
    });

    it('should preserve normal characters', () => {
      expect(normalizeString('hello world')).toBe('hello world');
      expect(normalizeString('hello-world_123')).toBe('hello-world_123');
      expect(normalizeString('Hello World!')).toBe('Hello World!');
    });
  });

  describe('normalizeId', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(normalizeId('  book123  ')).toBe('book123');
      expect(normalizeId('\t\nbook123\n\t')).toBe('book123');
    });

    it('should NOT remove special characters', () => {
      expect(normalizeId('abc#123')).toBe('abc#123');
      expect(normalizeId('book@123')).toBe('book@123');
      expect(normalizeId('book$123')).toBe('book$123');
      expect(normalizeId('book.123')).toBe('book.123');
      expect(normalizeId('book 123')).toBe('book 123');
    });

    it('should handle empty strings', () => {
      expect(normalizeId('')).toBe('');
      expect(normalizeId('   ')).toBe('');
    });

    it('should handle non-string values', () => {
      expect(normalizeId(null as unknown as string)).toBe(null);
      expect(normalizeId(undefined as unknown as string)).toBe(undefined);
    });

    it('should preserve control characters (validation will catch them)', () => {
      expect(normalizeId('book\u0000123')).toBe('book\u0000123');
      expect(normalizeId('book\n123')).toBe('book\n123');
      expect(normalizeId('book\t123')).toBe('book\t123');
    });
  });
});
