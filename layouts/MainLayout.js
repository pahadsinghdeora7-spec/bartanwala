import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BottomNav from "../components/BottomNav";
import MenuDrawer from "../components/MenuDrawer";

const HIDE_NAV = ["/login", "/checkout", "/payment"];

export default function MainLayout({ children }) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const hideBottomNav = HIDE_NAV.some((p) =>
    router.pathname.startsWith(p)
  );

  /* CART COUNT (for header badge) */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
      setCartCount(count);
    }
  }, [router.pathname]);

  return (
    <>
      {/* HEADER */}
      <Header
        onMenuClick={() => setDrawerOpen(true)}
        cartCount={cartCount}
      />

      {/* DRAWER MENU */}
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={null} // later yaha Supabase user aayega
      />

      {/* SEARCH */}
      <SearchBar />

      {/* PAGE CONTENT */}
      <main style={{ paddingBottom: hideBottomNav ? 0 : 70 }}>
        {children}
      </main>

      {/* BOTTOM NAV */}
      {!hideBottomNav && <BottomNav />}
    </>
  );
          }
