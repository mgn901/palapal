import { createTupleCache } from "@mgn901/mgn901-utils-ts/cached-function";
import { generateId } from "@mgn901/mgn901-utils-ts/random-values";
import {
  createContext,
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
  use,
  useSyncExternalStore,
} from "react";
import { ReactiveMap } from "./reactive-map.ts";

type Tuple = [unknown, ...unknown[]];
type Provider = FunctionComponent<
  PropsWithChildren & { args: readonly undefined[] }
>;
type RegisteredProvidersMap = ReactiveMap<
  () => unknown,
  [id: string, Provider: Provider]
>;

class ShowerHead {
  private readonly registeredProvidersMap: RegisteredProvidersMap =
    new ReactiveMap(new Map());
  private readonly ShowerHeadContext = createContext(
    this.registeredProvidersMap,
  );
  private readonly registeredDropletIdsTupleCache =
    createTupleCache<string[]>(1);

  constructor() {
    this.Provider = this.Provider.bind(this);
  }

  public Provider(props: PropsWithChildren): ReactNode {
    const registeredDropletIds = useSyncExternalStore(
      this.registeredProvidersMap.subscribe.bind(this.registeredProvidersMap),
      () =>
        this.registeredDropletIdsTupleCache(
          ...Array.from(this.registeredProvidersMap.values()).map(([id]) => id),
        ),
    );
    const registeredProviders = Array.from(
      this.registeredProvidersMap.values(),
    ).map(([, Provider]) => Provider);

    return (
      <this.ShowerHeadContext.Provider value={this.registeredProvidersMap}>
        {registeredProviders.reduce<ReactNode>(
          (acc, RegisteredProvider, i) => (
            <RegisteredProvider key={registeredDropletIds[i]} args={[]}>
              {acc}
            </RegisteredProvider>
          ),
          props.children,
        )}
      </this.ShowerHeadContext.Provider>
    );
  }

  public put<A extends readonly undefined[], T extends Tuple>(
    hook: (...args: A) => T,
    defaultValue: T,
  ): [Provider: Provider, ...hooks: { [N in keyof T]: () => T[N] }] {
    const dropletContexts = defaultValue.map((defaultDrop) =>
      createContext(defaultDrop),
    );

    const Provider = (props: PropsWithChildren<{ args: A }>) => {
      const droplets = hook(...props.args);
      return dropletContexts.reduce(
        (prev, DropletContext, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: length of dropContexts is fixed.
          <DropletContext.Provider key={i} value={droplets[i]}>
            {prev}
          </DropletContext.Provider>
        ),
        props.children,
      );
    };
    this.registeredProvidersMap.set(hook, [generateId(), Provider as Provider]);

    return [
      Provider,
      ...dropletContexts.map((Context) => () => use(Context)),
    ] as [Provider: Provider, ...hooks: { [N in keyof T]: () => T[N] }];
  }
}

export const createShowerHead = () => new ShowerHead();
