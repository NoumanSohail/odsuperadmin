// storage.ts
export const storage = {
  get: (key: string) => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key);
  },

  set: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, value);
  },

  remove: (key: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  },

  clear: () => {
    if (typeof window === "undefined") return;
    sessionStorage.clear();
  },
};
