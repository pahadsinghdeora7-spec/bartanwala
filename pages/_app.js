import "../styles/globals.css";
import MainLayout from "../layouts/MainLayout";
import { CartProvider } from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {
  // 👉 agar admin page hai (AdminLayout use karta hai)
  if (Component.getLayout) {
    return (
      <CartProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </CartProvider>
    );
  }

  // 👉 normal app pages
  return (
    <CartProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </CartProvider>
  );
}
