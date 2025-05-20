export function filterBySearch<T>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items;

  const lowerSearch = searchTerm.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (typeof value === 'string' || typeof value === 'number') {
        return String(value).toLowerCase().includes(lowerSearch);
      }
      return false;
    })
  );
}
