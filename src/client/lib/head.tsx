import {
  createContext,
  type Dispatch,
  type LinkHTMLAttributes,
  type MetaHTMLAttributes,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export interface HeadData {
  readonly path: string;
  readonly title?: string;
  readonly meta?: readonly MetaHTMLAttributes<HTMLMetaElement>[];
  readonly link?: readonly (LinkHTMLAttributes<HTMLLinkElement> & {
    rel: string;
    href: string;
  })[];
}

type HeadDataStore = readonly HeadData[];

const HeadDataStoreContext = createContext<HeadDataStore>([]);
const SetHeadDataStoreContext = createContext<
  Dispatch<SetStateAction<HeadDataStore>>
>(() => {});

export const useHead = (data: HeadData) => {
  const setHeadDataStore = useContext(SetHeadDataStoreContext);

  useEffect(() => {
    setHeadDataStore((prev) => [...prev, data]);

    return () => {
      setHeadDataStore((prev) => {
        const index = prev.indexOf(data);
        return index === -1
          ? prev
          : [...prev.slice(0, index), ...prev.slice(index + 1)];
      });
    };
  }, [data, setHeadDataStore]);
};

export const HeadProvider = (props: { children: ReactNode }): ReactNode => {
  const [headDataStore, setHeadDataStore] = useState<HeadDataStore>([]);

  const usedData = headDataStore.reduce<Required<HeadData> | undefined>(
    (prev, current) =>
      prev === undefined ||
      prev.path.split("/").filter((s) => s.length > 0).length <
        current.path.split("/").filter((s) => s.length > 0).length
        ? { title: "", meta: [], link: [], ...current }
        : prev,
    undefined,
  );

  return (
    <SetHeadDataStoreContext value={setHeadDataStore}>
      <HeadDataStoreContext value={headDataStore}>
        {usedData && (
          <>
            <title>{usedData.title}</title>
            {usedData.meta.map((attributes) => (
              <meta key={attributes.name} {...attributes} />
            ))}
            {usedData.link.map((attributes) => (
              <link key={attributes.rel + attributes.href} {...attributes} />
            ))}
          </>
        )}
        {props.children}
      </HeadDataStoreContext>
    </SetHeadDataStoreContext>
  );
};
