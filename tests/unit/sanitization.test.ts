import { sanitizeString, sanitizeId } from '../../src/utils/sanitization';

describe('Sanitization Utilities', () => {
  describe('sanitizeString', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('\t\nhello\n\t')).toBe('hello');
      expect(sanitizeString('  hello world  ')).toBe('hello world');
    });

    it('should remove control characters', () => {
      expect(sanitizeString('hello\u0000world')).toBe('helloworld');
      expect(sanitizeString('hello\u0001world')).toBe('helloworld');
      expect(sanitizeString('hello\u001Fworld')).toBe('helloworld');
    });

    it('should preserve newline, tab, and carriage return', () => {
      expect(sanitizeString('hello\nworld')).toBe('hello\nworld');
      expect(sanitizeString('hello\tworld')).toBe('hello\tworld');
      expect(sanitizeString('hello\rworld')).toBe('hello\rworld');
    });

    it('should handle empty strings', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString('   ')).toBe('');
    });

    it('should handle non-string values', () => {
      expect(sanitizeString(null as unknown as string)).toBe(null);
      expect(sanitizeString(undefined as unknown as string)).toBe(undefined);
    });

    it('should preserve normal characters', () => {
      expect(sanitizeString('hello world')).toBe('hello world');
      expect(sanitizeString('hello-world_123')).toBe('hello-world_123');
      expect(sanitizeString('Hello World!')).toBe('Hello World!');
    });
  });

  describe('sanitizeId', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(sanitizeId('  book123  ')).toBe('book123');
      expect(sanitizeId('\t\nbook123\n\t')).toBe('book123');
    });

    it('should remove special characters', () => {
      expect(sanitizeId('book@123')).toBe('book123');
      expect(sanitizeId('book#123')).toBe('book123');
      expect(sanitizeId('book$123')).toBe('book123');
      expect(sanitizeId('book.123')).toBe('book123');
      expect(sanitizeId('book 123')).toBe('book123');
    });

    it('should preserve alphanumeric characters, hyphens, and underscores', () => {
      expect(sanitizeId('book-123')).toBe('book-123');
      expect(sanitizeId('book_123')).toBe('book_123');
      expect(sanitizeId('book123')).toBe('book123');
      expect(sanitizeId('Book123')).toBe('Book123');
      expect(sanitizeId('book-123_456')).toBe('book-123_456');
    });

    it('should handle empty strings', () => {
      expect(sanitizeId('')).toBe('');
      expect(sanitizeId('   ')).toBe('');
      expect(sanitizeId('@#$')).toBe('');
    });

    it('should handle non-string values', () => {
      expect(sanitizeId(null as unknown as string)).toBe(null);
      expect(sanitizeId(undefined as unknown as string)).toBe(undefined);
    });

    it('should remove control characters', () => {
      expect(sanitizeId('book\u0000123')).toBe('book123');
      expect(sanitizeId('book\n123')).toBe('book123');
      expect(sanitizeId('book\t123')).toBe('book123');
    });
  });
});
