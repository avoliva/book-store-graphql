export function normalizeId(id: string): string {
  if (typeof id !== 'string') {
    return id;
  }

  return id.trim();
}
