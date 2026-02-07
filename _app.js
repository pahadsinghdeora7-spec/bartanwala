import BottomNav from "../components/BottomNav";
import "../styles/globals.css";

const HIDE_NAV_PAGES = [
  "/login",
  "/register",
  "/checkout",
  "/payment",
  "/success",
];

export default function MyApp({ Component, pageProps, router }) {
  const hideBottomNav = HIDE_NAV_PAGES.some((path) =>
    router.pathname.startsWith(path)
  );

  return (
    <>
      <Component {...pageProps} />
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
