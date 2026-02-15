import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {

  return (
    <Html lang="en">

      <Head>
        {/* Theme color allowed */}
        <meta name="theme-color" content="#0B5ED7" />
      </Head>

      <body style={{
        margin: 0,
        padding: 0,
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden"
      }}>

        <Main />
        <NextScript />

      </body>

    </Html>
  );

}
