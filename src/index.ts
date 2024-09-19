export interface StorageTS<T> {
  write<U extends keyof T>(key: U, value: T[U]): void;
  read<U extends keyof T>(key: U): T[U] | null;
  delete<U extends keyof T>(key: U): void;
  clear(): void;
}

export enum StorageType {
  LOCAL = "local",
  SESSION = "session",
  IN_MEMORY = "in-memory",
}

export interface StorageOptions {
  type: StorageType;
}

const createInMemoryStore = (): Storage => {
  const store = new Map();

  return {
    length: store.size,
    getItem: (key) => {
      const v = store.get(key);

      return v !== undefined ? v : null;
    },
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    key: () => null,
  };
};

const getStore = (type: StorageType): Storage => {
  switch (type) {
    case "local":
      if (typeof window !== "undefined" && "localStorage" in window) {
        try {
          return window.localStorage;
        } catch (_) {}
      }

      return createInMemoryStore();
    case "session":
      if (typeof window !== "undefined" && "sessionStorage" in window) {
        try {
          return window.sessionStorage;
        } catch (_) {}
      }

      return createInMemoryStore();
    default:
      return createInMemoryStore();
  }
};

export const createStorage = <T>({ type }: StorageOptions): StorageTS<T> => {
  const store = getStore(type);

  return {
    write: <K extends keyof T>(key: K, value: T[K]) => {
      store.setItem(key.toString(), JSON.stringify(value));
    },
    read: <K extends keyof T>(key: K) => {
      let i = null;

      try {
        i = store.getItem(key.toString());
      } catch (_) {}

      if (i === null) return i;

      return JSON.parse(i) as T[K];
    },
    delete: (key) => {
      store.removeItem(key.toString());
    },
    clear: () => {
      store.clear();
    },
  };
};
