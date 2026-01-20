import { validateId, validateNonEmptyString, validateStringLength } from '../../src/domain/validation';

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
      expect(validateId('\t').valid).toBe(false);
      expect(validateId('\n').valid).toBe(false);
    });

    it('should return invalid for strings with leading whitespace', () => {
      const result = validateId('  book123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('leading or trailing whitespace');
    });

    it('should return invalid for strings with trailing whitespace', () => {
      const result = validateId('book123  ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('leading or trailing whitespace');
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

    it('should return invalid for non-string values', () => {
      const result = validateId(null as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('non-empty string');
    });
  });

  describe('validateNonEmptyString', () => {
    it('should return valid for valid strings', () => {
      expect(validateNonEmptyString('hello', 'field')).toEqual({ valid: true });
      expect(validateNonEmptyString('  hello  ', 'field')).toEqual({ valid: true });
      expect(validateNonEmptyString('a', 'field')).toEqual({ valid: true });
    });

    it('should return invalid for empty strings', () => {
      const result = validateNonEmptyString('', 'fieldName');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('fieldName');
      expect(result.error).toContain('empty');
    });

    it('should return invalid for whitespace-only strings', () => {
      const result1 = validateNonEmptyString('   ', 'fieldName');
      expect(result1.valid).toBe(false);
      expect(result1.error).toContain('whitespace-only');

      const result2 = validateNonEmptyString('\t\n', 'fieldName');
      expect(result2.valid).toBe(false);
      expect(result2.error).toContain('whitespace-only');
    });

    it('should return invalid for non-string values', () => {
      const result = validateNonEmptyString(null as unknown as string, 'fieldName');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('fieldName');
    });
  });

  describe('validateStringLength', () => {
    it('should return valid for strings within length range', () => {
      expect(validateStringLength('hello', 1, 10, 'field')).toEqual({ valid: true });
      expect(validateStringLength('a', 1, 10, 'field')).toEqual({ valid: true });
      expect(validateStringLength('hello world', 1, 20, 'field')).toEqual({ valid: true });
    });

    it('should return invalid for strings shorter than min length', () => {
      const result = validateStringLength('hi', 5, 10, 'fieldName');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('fieldName');
      expect(result.error).toContain('between 5 and 10');
      expect(result.error).toContain('got 2');
    });

    it('should return invalid for strings longer than max length', () => {
      const result = validateStringLength('hello world', 1, 5, 'fieldName');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('fieldName');
      expect(result.error).toContain('between 1 and 5');
      expect(result.error).toContain('got 11');
    });

    it('should return invalid for non-string values', () => {
      const result = validateStringLength(null as unknown as string, 1, 10, 'fieldName');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('fieldName');
      expect(result.error).toContain('must be a string');
    });

    it('should handle edge cases at boundaries', () => {
      expect(validateStringLength('a', 1, 1, 'field')).toEqual({ valid: true });
      expect(validateStringLength('ab', 1, 1, 'field').valid).toBe(false);
      expect(validateStringLength('', 1, 10, 'field').valid).toBe(false);
    });
  });
});
