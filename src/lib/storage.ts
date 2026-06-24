export const Storage = {
  async set(key: string, value: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  },

  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as any;
    }
  },

  async remove(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },

  async clear() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};
