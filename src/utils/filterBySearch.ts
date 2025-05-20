export function filterBySearch<T>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  const trimmedSearch = searchTerm.trim();
  if (!trimmedSearch) return items;

  const lowerSearch = trimmedSearch.toLowerCase();

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
