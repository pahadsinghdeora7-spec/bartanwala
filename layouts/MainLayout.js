import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import BottomNav from "../components/BottomNav";
import MenuDrawer from "../components/MenuDrawer";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

const HIDE_NAV = ["/login", "/signup", "/checkout", "/payment"];

export default function MainLayout({ children }) {

  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  const hideBottomNav = HIDE_NAV.some((p) =>
    router.pathname.startsWith(p)
  );

  /* ================= AUTH ================= */

  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: subscription } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => {
      subscription?.subscription?.unsubscribe();
    };

  }, []);

  /* ================= UI ================= */

  return (

    <div style={styles.outer}>

      {/* MOBILE APP CONTAINER */}
      <div style={styles.mobile}>

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

        <main style={{
          paddingBottom: hideBottomNav ? 0 : 72
        }}>
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Bottom Nav */}
        {!hideBottomNav && <BottomNav />}

      </div>

    </div>

  );

}

/* ================= STYLES ================= */

const styles = {

  /* Desktop background */
  outer: {
    background: "#f1f3f6",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },

  /* Mobile app width */
  mobile: {
    width: "100%",
    maxWidth: "480px",     // ✅ mobile app width lock
    background: "#ffffff",
    minHeight: "100vh",
    boxShadow: "0 0 25px rgba(0,0,0,0.08)",
  },

};
