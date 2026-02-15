import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {

  return (

    <Html lang="en">

      <Head>

        {/* ✅ MOBILE APP VIEWPORT */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        {/* ✅ APP LIKE LOOK */}
        <meta name="theme-color" content="#0B5ED7" />

      </Head>

      <body>

        <Main />
        <NextScript />

      </body>

    </Html>

  );

}
