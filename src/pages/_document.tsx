import createEmotionServer from "@emotion/server/create-instance";
// import { createEmotionCache } from "$ui/cache";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { createEmotionCache } from "theme/cache/createEmotionCache";
import { setCookie } from "cookies-next";

export default class MyDocument extends Document {
  render() {
    return (
      <Html dir={this.props.locale === "ar" ? "rtl" : "ltr"}>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body
          style={{
            overflowX: "hidden",
            // overflowY: "overlay",
            maxWidth: 2000,
            margin: "0 auto",
          }}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const isRtl = ctx.locale === "ar";

  const cache = createEmotionCache(
    isRtl
      ? {
          stylisPlugins: [prefixer, rtlPlugin],
          key: "mui-rtl",
        }
      : {}
  );
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: React.ComponentType<any>) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} lang={ctx.locale} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
