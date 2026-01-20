import { validateId } from '../../src/domain/validation';

describe('Validation Utilities', () => {
  describe('validateId', () => {
    it('should return valid for valid IDs', () => {
      expect(validateId('1')).toEqual({ valid: true });
      expect(validateId('book-123')).toEqual({ valid: true });
      expect(validateId('a'.repeat(100))).toEqual({ valid: true });
      expect(validateId('book_123-456')).toEqual({ valid: true });
    });

    it('should return invalid for empty strings', () => {
      const result = validateId('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should return invalid for whitespace-only strings', () => {
      expect(validateId('   ').valid).toBe(false);
    });

    it('should return invalid for strings with leading or trailing whitespace', () => {
      const result1 = validateId('  book123');
      expect(result1.valid).toBe(false);
      expect(result1.error).toContain('leading or trailing whitespace');
      
      const result2 = validateId('book123  ');
      expect(result2.valid).toBe(false);
      expect(result2.error).toContain('leading or trailing whitespace');
    });

    it('should return invalid for strings longer than 100 characters', () => {
      const longId = 'a'.repeat(101);
      const result = validateId(longId);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('length must be between 1 and 100');
    });

    it('should return invalid for strings with control characters', () => {
      const result = validateId('book\u0000');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('control characters');
    });
  });
});
