import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BottomNav from "../components/BottomNav";
import { useRouter } from "next/router";

const HIDE_NAV = ["/login", "/checkout", "/payment"];

export default function MainLayout({ children }) {
  const router = useRouter();
  const hideBottomNav = HIDE_NAV.some((p) =>
    router.pathname.startsWith(p)
  );

  return (
    <>
      <Header />
      <SearchBar />

      <main style={{ paddingBottom: hideBottomNav ? 0 : 70 }}>
        {children}
      </main>

      {!hideBottomNav && <BottomNav />}
    </>
  );
                                      }
