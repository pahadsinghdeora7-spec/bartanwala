import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BottomNav from "../components/BottomNav";
import MenuDrawer from "../components/MenuDrawer";
import { getSupabase } from "../lib/supabase";

const HIDE_NAV = ["/login", "/checkout", "/payment"];

export default function MainLayout({ children }) {
  const router = useRouter();
  const supabase = getSupabase();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  // hide bottom nav logic
  const hideBottomNav = HIDE_NAV.some((p) =>
    router.pathname.startsWith(p)
  );

  // 🔑 AUTH STATE (MOST IMPORTANT PART)
  useEffect(() => {
    // get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // listen login / logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
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
