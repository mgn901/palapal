import {
  cachedFunctionFrom,
  compareTuple,
  LruCacheStrategy,
} from "@mgn901/mgn901-utils-ts/cached-function";

const parrot = <T extends readonly unknown[]>(...args: T): T => args;

export const createVectorCache = <T extends readonly unknown[]>(
  limit: number,
): ((value: T) => T) => {
  const cache = cachedFunctionFrom<T, T>(
    parrot,
    new LruCacheStrategy(limit, compareTuple),
  );
  return (value: T): T => cache(...value);
};

export const createTupleOfVectorsCache = <
  T extends readonly (readonly unknown[])[],
>(
  vectorCacheLimit: number,
  tupleCacheLimit: number,
): ((value: T) => T) => {
  const vectorCache = createVectorCache<T[number]>(vectorCacheLimit);
  const tupleCache = createVectorCache<T>(tupleCacheLimit);
  return (tuple: T): T => {
    const cachedVectors = tuple.map((vector) =>
      vectorCache(vector),
    ) as unknown as T;
    return tupleCache(cachedVectors);
  };
};
