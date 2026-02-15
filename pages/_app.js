import "../styles/globals.css";
import MainLayout from "../layouts/MainLayout";
import { CartProvider } from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {

  // 👉 Admin pages (no mobile container)
  if (Component.getLayout) {
    return (
      <CartProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </CartProvider>
    );
  }

  // 👉 Normal app pages (mobile app layout)
  return (
    <CartProvider>

      <div style={styles.mobileContainer}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </div>

    </CartProvider>
  );
}


/* ✅ MOBILE APP CONTAINER */
const styles = {

  mobileContainer: {

    maxWidth: "430px",   // exact mobile width
    margin: "0 auto",    // center
    minHeight: "100vh",

    background: "#F3F4F6",

    boxShadow: "0 0 20px rgba(0,0,0,0.08)"

  }

};
