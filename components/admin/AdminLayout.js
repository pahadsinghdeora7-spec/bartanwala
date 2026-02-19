import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { FaBars } from "react-icons/fa";

import AdminDrawer from "./AdminDrawer";

export default function AdminLayout({ children }) {

  const router = useRouter();

  const [checking, setChecking] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [user, setUser] = useState(null);


  /* ================= CHECK ADMIN ================= */

  useEffect(() => {

    async function checkUser() {

      const { data } = await supabase.auth.getUser();

      if (!data?.user) {

        router.replace("/admin/login");

      } else {

        setUser(data.user);

        setChecking(false);

      }

    }

    checkUser();

  }, []);


  if (checking) return null;


  /* ================= UI ================= */

  return (

    <div style={styles.wrapper}>

      {/* ================= DRAWER ================= */}

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />


      {/* ================= HEADER ================= */}

      <header style={styles.header}>


        {/* LEFT */}

        <div style={styles.left}>

          <div
            style={styles.menuBtn}
            onClick={() => setDrawerOpen(true)}
          >
            <FaBars size={20} />
          </div>


          <span style={styles.logo}>
            Admin Panel
          </span>

        </div>


        {/* RIGHT */}

        <div style={styles.right}>


          {user?.email && (

            <span style={styles.email}>
              {user.email}
            </span>

          )}


          <button
            style={styles.storeBtn}
            onClick={() => router.push("/")}
          >
            Store →
          </button>

        </div>


      </header>


      {/* ================= CONTENT ================= */}

      <main style={styles.content}>

        {children}

      </main>


    </div>

  );

}



/* ================= STYLES ================= */

const styles = {

  wrapper: {
    minHeight: "100vh",
    background: "#f5f6f8"
  },


  header: {
    height: 56,
    background: "#0B5ED7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    position: "sticky",
    top: 0,
    zIndex: 100
  },


  left: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },


  menuBtn: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },


  logo: {
    fontWeight: 700,
    fontSize: 16
  },


  right: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },


  email: {
    fontSize: 12,
    opacity: 0.9
  },


  storeBtn: {
    background: "#fff",
    color: "#0B5ED7",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer"
  },


  content: {
    padding: 16
  }

};
