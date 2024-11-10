const STORAGE_KEY = 'entries';

export const loadEntries = () => {
  const entries = localStorage.getItem(STORAGE_KEY);
  return entries ? JSON.parse(entries) : [];
};

export const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const clearEntries = () => {
  localStorage.removeItem(STORAGE_KEY);
};
