/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates ID format
 * @param id - The ID to validate
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateId(id: string): ValidationResult {
  if (!id || typeof id !== 'string') {
    return {
      valid: false,
      error: 'ID must be a non-empty string',
    };
  }

  const trimmed = id.trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'ID cannot be empty or whitespace-only',
    };
  }

  if (trimmed.length !== id.length) {
    return {
      valid: false,
      error: 'ID cannot contain leading or trailing whitespace',
    };
  }

  if (id.length > 100) {
    return {
      valid: false,
      error: `ID length must be between 1 and 100 characters, but got ${id.length}`,
    };
  }

  // Check for control characters (except newline and tab which might be valid in some contexts)
  // Control characters are characters with code points < 32, excluding space (32), newline (10), tab (9), carriage return (13)
  for (let i = 0; i < id.length; i++) {
    const charCode = id.charCodeAt(i);
    if (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) {
      return {
        valid: false,
        error: 'ID cannot contain control characters',
      };
    }
  }

  return { valid: true };
}

/**
 * Validates non-empty, non-whitespace string
 * @param value - The string to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateNonEmptyString(value: string, fieldName: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return {
      valid: false,
      error: `${fieldName} must be a non-empty string`,
    };
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: `${fieldName} cannot be empty or whitespace-only`,
    };
  }

  return { valid: true };
}

/**
 * Validates string length
 * @param value - The string to validate
 * @param min - Minimum length (inclusive)
 * @param max - Maximum length (inclusive)
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      error: `${fieldName} must be a string`,
    };
  }

  const length = value.length;
  if (length < min) {
    return {
      valid: false,
      error: `${fieldName} length must be between ${min} and ${max} characters, but got ${length}`,
    };
  }

  if (length > max) {
    return {
      valid: false,
      error: `${fieldName} length must be between ${min} and ${max} characters, but got ${length}`,
    };
  }

  return { valid: true };
}
