const listenerMap = Symbol("listenerMap");
const unsubscribe = Symbol();

class ReactivateProxyHandler<T extends object> implements ProxyHandler<T> {
  private readonly [listenerMap]: Map<unknown, (() => void)[]> = new Map();

  subscribe(p: keyof T, onSet: () => void): () => void {
    const listeners = this[listenerMap].get(p) ?? [];
    listeners.push(onSet);
    this[listenerMap].set(p, listeners);
    return () => this[unsubscribe](p, onSet);
  }

  private [unsubscribe](p: keyof T, onSet: () => void): void {
    const listeners = this[listenerMap].get(p) ?? [];
    const index = listeners.indexOf(onSet);
    if (index !== -1) listeners.splice(index, 1);
  }

  set(
    target: T,
    p: string | symbol,
    newValue: unknown,
    receiver: unknown,
  ): boolean {
    const prev = Reflect.get(target, p, receiver);
    const result = Reflect.set(target, p, newValue, receiver);
    if (result && prev !== newValue)
      for (const listener of this[listenerMap].get(p) ?? []) listener();
    return result;
  }
}

export const reactivate = <T extends object>(
  target: T,
): [proxied: T, subscribe: (p: keyof T, onSet: () => void) => () => void] => {
  const handler = new ReactivateProxyHandler<T>();
  const proxied = new Proxy<T>(target, handler);
  return [proxied, handler.subscribe.bind(handler)];
};
