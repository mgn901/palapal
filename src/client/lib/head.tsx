import {
  createContext,
  type Dispatch,
  type LinkHTMLAttributes,
  type MetaHTMLAttributes,
  type SetStateAction,
  useContext,
  useEffect,
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

export type HeadDataStore = readonly HeadData[];

export const HeadDataStoreContext = createContext<HeadDataStore>([]);
export const SetHeadDataStoreContext = createContext<
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
