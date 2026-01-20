/**
 * Sanitizes a string by trimming whitespace and removing control characters
 * @param value - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(value: string): string {
  if (typeof value !== 'string') {
    return value;
  }

  // Trim leading and trailing whitespace
  let sanitized = value.trim();

  // Remove control characters (except newline, tab, carriage return)
  // Control characters are characters with code points < 32, excluding:
  // - Space (32)
  // - Newline (10)
  // - Tab (9)
  // - Carriage return (13)
  sanitized = sanitized
    .split('')
    .filter((char) => {
      const charCode = char.charCodeAt(0);
      return charCode >= 32 || charCode === 9 || charCode === 10 || charCode === 13;
    })
    .join('');

  return sanitized;
}

/**
 * Sanitizes an ID by trimming whitespace and removing special characters
 * Keeps only alphanumeric characters, hyphens, and underscores
 * @param id - The ID to sanitize
 * @returns Sanitized ID
 */
export function sanitizeId(id: string): string {
  if (typeof id !== 'string') {
    return id;
  }

  // Trim leading and trailing whitespace
  let sanitized = id.trim();

  // Remove all non-alphanumeric characters except hyphens and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '');

  return sanitized;
}
