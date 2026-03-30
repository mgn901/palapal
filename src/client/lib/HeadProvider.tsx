import { type ReactNode, useState } from "react";
import {
  type HeadData,
  type HeadDataStore,
  HeadDataStoreContext,
  SetHeadDataStoreContext,
} from "./head.tsx";

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
