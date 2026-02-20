import Head from "next/head";
import { useRouter } from "next/router";
import "../styles/globals.css";
import MainLayout from "../layouts/MainLayout";
import { CartProvider } from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {

  const router = useRouter();

  // ✅ Detect admin pages
  const isAdminPage = router.pathname.startsWith("/admin");


  /* ================= ADMIN PAGES ================= */
  if (isAdminPage) {
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
        </Head>

        <CartProvider>

          {/* If admin page uses custom layout */}
          {Component.getLayout
            ? Component.getLayout(<Component {...pageProps} />)
            : <Component {...pageProps} />
          }

        </CartProvider>
      </>
    );
  }


  /* ================= STORE PAGES ================= */
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      <CartProvider>

        <div className="app-container">

          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>

        </div>

      </CartProvider>
    </>
  );
              }
