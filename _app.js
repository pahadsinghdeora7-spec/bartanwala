import "../styles/globals.css";
import BottomNav from "../components/BottomNav";

const HIDE_NAV = ["/login", "/checkout", "/payment", "/success"];

export default function MyApp({ Component, pageProps, router }) {
  const hide = HIDE_NAV.some((p) => router.pathname.startsWith(p));

  return (
    <>
      <Component {...pageProps} />
      {!hide && <BottomNav />}
    </>
  );
}
