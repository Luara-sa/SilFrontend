import React, { useEffect, useMemo } from "react";
import Head from "next/head";
import { AppProps as BaseAppProps } from "next/app";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DefaultSeo } from "next-seo";

import { CssBaseline, Box } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { ToastContainer } from "react-toastify";

import { setLocale } from "yup";
import en from "yup/lib/locale";
import { ar } from "yup-locales";

import { meStore } from "store/meStore";
import { _AuthService } from "services/auth.service";
import { InterceptorProvider } from "interceptors1/InterceptorProvider";
import { AuthProvider } from "contexts/AuthContext";

import { Layout } from "components/layout";

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { themeUI } from "theme";
import { createEmotionCache } from "theme/cache/createEmotionCache";

import "react-toastify/dist/ReactToastify.css";
import "styles/globals.css";

// import * as firebase from "firebase/app";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
const clientRtlSideEmotionCache = createEmotionCache({
  stylisPlugins: [prefixer, rtlPlugin],
  key: "mui-rtl",
});

const queryClient = new QueryClient();

type AppProps = {
  emotionCache?: EmotionCache;
  lang?: any;
} & BaseAppProps & {
    Component: NextPage;
  };

const App: NextComponentType<NextPageContext, {}, AppProps> = ({
  Component,
  pageProps,
  emotionCache,
}) => {
  const router = useRouter();

  const lang = router.locale;

  const direction = useMemo(() => (lang === "ar" ? "rtl" : "ltr"), [lang]);
  const isRtl = useMemo(() => direction === "rtl", [direction]);

  const theme = useMemo(
    () => themeUI({ direction: direction, language: lang as "en" }),
    [direction, lang]
  );

  const fallbackClientSideEmotionCache = useMemo(
    () => (isRtl ? clientRtlSideEmotionCache : clientSideEmotionCache),
    [isRtl]
  );

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  useEffect(() => {
    if (lang === "ar") return void setLocale(ar);
    if (lang === "en") return void setLocale(en);
  }, [lang]);

  const LayoutFinal = useMemo(
    () => Component.layout ?? Layout,
    [Component.layout]
  );

  const [setMe] = meStore((state) => [state.setMe]);

  useEffect(() => {
    document.body.style.overflowY = "overlay";
  }, []);

  return (
    <>
      {/* <DefaultSeo {...defaultSeoProps} /> */}
      <CacheProvider value={emotionCache ?? fallbackClientSideEmotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              maxSnack={3}
              autoHideDuration={3000}
              preventDuplicate
            >
              <AuthProvider>
                <InterceptorProvider>
                  <GoogleOAuthProvider clientId="801196929391-r8do46k5fqrn2eifrd1333hgphkh2n0b.apps.googleusercontent.com">
                    <>
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
                      <LayoutFinal>
                        <Component {...pageProps} />
                      </LayoutFinal>
                      {/* </LocalizationProvider> */}
                      {/* {process.env.NODE_ENV !== "production" && (
                      <ReactQueryDevtools />
                    )} */}
                    </>
                  </GoogleOAuthProvider>
                </InterceptorProvider>
              </AuthProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
      <ToastContainer
        position={isRtl ? "top-left" : "top-right"}
        theme="colored"
        autoClose={5000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={isRtl}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
