import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BottomNav from "../components/BottomNav";
import MenuDrawer from "../components/MenuDrawer";
import { supabase } from "../lib/supabase";

const HIDE_NAV = ["/login", "/signup", "/checkout", "/payment"];

export default function MainLayout({ children }) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  // hide bottom nav on auth / checkout pages
  const hideBottomNav = HIDE_NAV.some((p) =>
    router.pathname.startsWith(p)
  );

  // ✅ AUTH STATE (CORRECT & SAFE)
  useEffect(() => {
    // get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    // listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      <Header
        onMenuClick={() => setDrawerOpen(true)}
        cartCount={0}
        user={user}
      />

      {/* SEARCH */}
      <SearchBar />

      {/* DRAWER */}
      <MenuDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
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
