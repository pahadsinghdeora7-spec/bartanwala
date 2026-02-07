import { useState } from "react";
import { useRouter } from "next/router";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BottomNav from "../components/BottomNav";
import DrawerMenu from "../components/DrawerMenu"; // ✅ ab sahi

const HIDE_NAV = ["/login", "/checkout", "/payment"];

export default function MainLayout({ children }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hideBottomNav = HIDE_NAV.some((p) =>
    router.pathname.startsWith(p)
  );

  return (
    <>
      {/* HEADER */}
      <Header
        onMenuClick={() => setDrawerOpen(true)}
        cartCount={0}
      />

      {/* SEARCH */}
      <SearchBar />

      {/* DRAWER */}
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={null} // login ke baad yaha user aayega
      />

      {/* PAGE CONTENT */}
      <main style={{ paddingBottom: hideBottomNav ? 0 : 72 }}>
        {children}
      </main>

      {/* BOTTOM NAV */}
      {!hideBottomNav && <BottomNav />}
    </>
  );
          }
