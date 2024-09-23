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
  prefix?: string;
  silent?: boolean;
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
      // Check that we are in a context where localStorage exists
      if (typeof window !== "undefined" && "localStorage" in window) {
        // Verify that we are allowed to access the getter
        try {
          return window.localStorage;
        } catch (_) {}
      }

      // Fall back to in-memory storage
      return createInMemoryStore();
    case "session":
      // Check that we are in a context where sessionStorage exists
      if (typeof window !== "undefined" && "sessionStorage" in window) {
        try {
          // Verify that we are allowed to access the getter
          return window.sessionStorage;
        } catch (_) {}
      }

      // Fall back to in-memory storage
      return createInMemoryStore();
    default:
      return createInMemoryStore();
  }
};

export const createStorage = <T>({
  type,
  // Storage namespace
  prefix,
  // Fail silently
  silent = true,
}: StorageOptions): StorageTS<T> => {
  const store = getStore(type);

  return {
    write: <K extends keyof T>(key: K, value: T[K]) => {
      try {
        store.setItem(
          prefix ? `${prefix}.${key.toString()}` : key.toString(),
          JSON.stringify(value),
        );
      } catch (e) {
        if (!silent) throw e;
      }
    },
    read: <K extends keyof T>(key: K) => {
      try {
        const i = store.getItem(
          prefix ? `${prefix}.${key.toString()}` : key.toString(),
        );

        if (i === null) return i;

        return JSON.parse(i) as T[K];
      } catch (e) {
        if (!silent) throw e;

        return null;
      }
    },
    delete: (key) => {
      try {
        store.removeItem(
          prefix ? `${prefix}.${key.toString()}` : key.toString(),
        );
      } catch (e) {
        if (!silent) throw e;
      }
    },
    clear: () => {
      store.clear();
    },
  };
};
