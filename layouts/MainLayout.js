import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BottomNav from "../components/BottomNav";
import MenuDrawer from "../components/MenuDrawer";
import Footer from "../components/Footer"; // ✅ Footer Import
import { supabase } from "../lib/supabase";

const HIDE_NAV = ["/login", "/signup", "/checkout", "/payment"];

export default function MainLayout({ children }) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  const hideBottomNav = HIDE_NAV.some((p) =>
    router.pathname.startsWith(p)
  );

  // ✅ AUTH STATE
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      <Header
        onMenuClick={() => setDrawerOpen(true)}
        user={user}
      />

      <SearchBar />

      <MenuDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
      />

      <main style={{ paddingBottom: hideBottomNav ? 0 : 72 }}>
        {children}
      </main>

      {/* ✅ Desktop Only Footer */}
      <Footer />

      {!hideBottomNav && <BottomNav />}
    </>
  );
        }
