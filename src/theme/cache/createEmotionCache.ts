import createCache, { Options } from "@emotion/cache";

export const createEmotionCache = (options: Partial<Options> = {}) =>
  createCache({ key: "mui", prepend: true, ...options });
