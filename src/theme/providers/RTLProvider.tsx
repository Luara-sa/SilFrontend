import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useEffect } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { settingsStore } from "store/settingsStore";

const cacheRtl = createCache({
  key: "mui-rtl",
  prepend: true,
  stylisPlugins: [prefixer, rtlPlugin],
});

export const RTLProvider = ({ children }: { children: JSX.Element }) => {
  const direction = settingsStore((state) => state.direction);

  // if (direction === "rtl") {
  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  // }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
