import Head from "next/head";
import "../styles/globals.css";
import MainLayout from "../layouts/MainLayout";
import { CartProvider } from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {

  // 👉 Admin pages (no layout restriction)
  if (Component.getLayout) {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <CartProvider>
          {Component.getLayout(<Component {...pageProps} />)}
        </CartProvider>
      </>
    );
  }

  // 👉 Normal pages
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <CartProvider>

        {/* Responsive container */}
        <div className="app-container">
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </div>

      </CartProvider>
    </>
  );
    }
