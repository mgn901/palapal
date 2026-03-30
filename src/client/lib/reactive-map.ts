const underlyingMap = Symbol("map");
const comparator = Symbol("compare");
const listenerMapForEntry = Symbol("listenerMapForEntry");
const listenersForMap = Symbol("listenersForMap");

const defaultCompare = <V>(prev: V, next: V) => prev === next;

export interface ReactivateMapOption<K, V> {
  readonly compare?: (this: unknown, prev: V, next: V) => boolean;
  readonly listenerMap?: Map<K, (() => void)[]>;
}

export class ReactiveMap<K, V> implements Map<K, V> {
  private readonly [underlyingMap]: Map<K, V>;
  private readonly [comparator]: (this: unknown, prev: V, next: V) => boolean;
  private readonly [listenerMapForEntry]: Map<K, (() => void)[]>;
  private readonly [listenersForMap]: (() => void)[] = [];

  constructor(map: Map<K, V>, option?: ReactivateMapOption<K, V>) {
    this[underlyingMap] = map;
    this[comparator] = option?.compare ?? defaultCompare;
    this[listenerMapForEntry] = option?.listenerMap ?? new Map();
  }

  subscribe(onChange: () => void): () => void {
    if (!this[listenersForMap].includes(onChange))
      this[listenersForMap].push(onChange);
    return () => unsubscribeWithArray(this[listenersForMap], onChange);
  }

  subscribeToEntry(key: K, onChange: () => void): () => void {
    return subscribeWithMap(this[listenerMapForEntry], key, onChange);
  }

  set(key: K, value: V): this {
    const prev = this[underlyingMap].get(key);

    this[underlyingMap].set(key, value);

    if (prev === undefined || !this[comparator](prev, value))
      dispatchListenersInMap(this[listenerMapForEntry], key);

    for (const listener of this[listenersForMap]) listener();

    return this;
  }

  delete(key: K): boolean {
    const result = this[underlyingMap].delete(key);

    if (result) {
      dispatchListenersInMap(this[listenerMapForEntry], key);
      for (const listener of this[listenersForMap]) listener();
    }

    for (const listener of this[listenersForMap]) listener();

    return result;
  }

  clear(): void {
    this[underlyingMap].clear();

    for (const listeners of this[listenerMapForEntry].values())
      for (const listener of listeners) listener();

    for (const listener of this[listenersForMap]) listener();
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: unknown,
  ): void {
    this[underlyingMap].forEach(callbackfn, thisArg);
  }
  get(key: K): V | undefined {
    return this[underlyingMap].get(key);
  }
  has(key: K): boolean {
    return this[underlyingMap].has(key);
  }
  get size(): number {
    return this[underlyingMap].size;
  }
  entries(): MapIterator<[K, V]> {
    return this[underlyingMap].entries();
  }
  keys(): MapIterator<K> {
    return this[underlyingMap].keys();
  }
  values(): MapIterator<V> {
    return this[underlyingMap].values();
  }
  [Symbol.iterator](): MapIterator<[K, V]> {
    return this[underlyingMap][Symbol.iterator]();
  }
  get [Symbol.toStringTag]() {
    return "ReactiveMap";
  }
}

const subscribeWithMap = <K>(
  map: Map<K, (() => void)[]>,
  key: K,
  listener: () => void,
): (() => void) => {
  const listeners = map.get(key) ?? [];
  if (!listeners.includes(listener)) listeners.push(listener);
  map.set(key, listeners);

  return () => unsubscribeWithMap(map, key, listener);
};

const unsubscribeWithMap = <K>(
  map: Map<K, (() => void)[]>,
  key: K,
  listener: () => void,
): void => {
  const listeners = map.get(key) ?? [];
  const listenerIndex = listeners.indexOf(listener);
  if (listenerIndex !== -1) listeners.splice(listenerIndex, 1);
};

const unsubscribeWithArray = (array: (() => void)[], listener: () => void) => {
  const index = array.indexOf(listener);
  if (index !== -1) array.splice(index, 1);
};

const dispatchListenersInMap = <K>(
  map: Map<K, (() => void)[]>,
  key: K,
): void => {
  for (const listener of map.get(key) ?? []) listener();
};
