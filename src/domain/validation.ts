export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateId(id: string): ValidationResult {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { valid: false, error: 'ID must be a non-empty string' };
  }

  if (id.trim() !== id) {
    return { valid: false, error: 'ID cannot contain leading or trailing whitespace' };
  }

  if (id.length > 100) {
    return { valid: false, error: 'ID length must be between 1 and 100 characters' };
  }

  for (let i = 0; i < id.length; i++) {
    const charCode = id.charCodeAt(i);
    if (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) {
      return { valid: false, error: 'ID cannot contain control characters' };
    }
  }

  return { valid: true };
}
