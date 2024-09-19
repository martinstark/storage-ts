# Storage TS

Typesafe local, session, or in-memory storage.

If local or session storage are unavailable it will fall back to in-memory storage.

## Usage

```typescript
// Create a schema of valid key value pairs
type Schema = {
  keyA: { complex: "object" };
  keyB: number;
};

// Create a store of the desired type. If it is not available,
// in-memory storage will be used as a fallback.
const store = createStorage<Schema>({
  type: StorageType.LOCAL,
});

// ❌ Argument of type number is not assignable to parameter of type { complex: "object" };
store.write("keyA", 1);

// ✅
store.write("keyA", { complex: "object" });

// { complex: "object" } | null
const v1 = s.read("keyA");

// ✅
store.write("keyB", 5);

// number | null
const v2 = s.read("keyB");
```

## Edge Cases

If `window`, `localStorage` or `sessionStorage` are unavailable, in-memory storage will be created as a fallback, regardless of which `StorageType` is provided when creating the store.

If access to browser storage is revoked by the user, `write` will fail silently and `read` will return `null` instead of throwing an error.
