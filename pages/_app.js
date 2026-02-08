import "../styles/globals.css";
import MainLayout from "../layouts/MainLayout";

export default function MyApp({ Component, pageProps }) {
  // 👉 agar admin page hai
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  }

  // 👉 normal app pages
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}
