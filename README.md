# Storage TS

Typesafe local, session, or in-memory storage.

If local or session storage are unavailable it will fall back to in-memory storage.

## Usage

```shell
npm i @martinstark/storage-ts

pnpm i @martinstark/storage-ts

yarn add @martinstark/storage-ts
```

```typescript
import { createStorage, StorageType } from "@martinstark/storage-ts";

// Create a schema of valid key value pairs
type Schema = {
  keyA: { complex: "object" };
  keyB: number;
};

// Create a store of the desired type. If it is not available,
// in-memory storage will be used as a fallback.
const store = createStorage<Schema>({
  // "local" persists across browser sessions
  // "session" persists until tab is closed
  // "in-memory" persists until tab is closed
  type: StorageType.LOCAL,

  // set unique prefixes if more than one store is used
  // optional - default: undefined
  prefix: "id",

  // squelch errors
  // false requires try/catch statements around calls to
  // `read` and `write`
  // optional - default: true
  silent: true,
});

// ❌ Argument of type number is not assignable to parameter
// of type { complex: "object" };
store.write("keyA", 1);

// ✅
store.write("keyA", { complex: "object" });

// { complex: "object" } | null
const v1 = store.read("keyA");

// ✅
store.write("keyB", 5);

// number | null
const v2 = store.read("keyB");
```

## Edge Cases

If `window`, `localStorage` or `sessionStorage` are unavailable, in-memory storage will be created as a fallback, regardless of which `StorageType` is provided when creating the store.

In silent (default) mode, `write` will fail silently and `read` will return `null` instead of throwing.

If `silent` is set to `false` read and write can throw, necessitating `try/catch` statements around each call.
