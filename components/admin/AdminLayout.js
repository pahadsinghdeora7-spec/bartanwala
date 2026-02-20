import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  /* ================= CHECK ADMIN ================= */

  useEffect(() => {

    async function checkUser() {

      const { data } = await supabase.auth.getUser();

      if (!data?.user) {

        router.replace("/admin/login");
        return;

      }

      setUser(data.user);
      setLoading(false);

    }

    checkUser();

  }, []);



  /* ================= CHECK DEVICE ================= */

  useEffect(() => {

    function handleResize() {

      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);

      // Desktop → sidebar always open
      if (!mobile) {

        setSidebarOpen(true);

      }

    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);

  }, []);



  if (loading) return null;



  /* ================= UI ================= */

  return (

    <div style={styles.wrapper}>

      {/* SIDEBAR */}

      <AdminSidebar
        open={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />


      {/* MAIN AREA */}

      <div
        style={{
          ...styles.main,
          marginLeft:
            !isMobile && sidebarOpen
              ? 240
              : 0
        }}
      >


        {/* HEADER */}

        <AdminHeader
          user={user}
          onMenuClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        />


        {/* PAGE CONTENT */}

        <div style={styles.content}>

          {children}

        </div>


      </div>


    </div>

  );

}



/* ================= STYLES ================= */

const styles = {

  wrapper: {

    display: "flex",

    minHeight: "100vh",

    background: "#f4f6f8"

  },


  main: {

    flex: 1,

    transition: "margin-left 0.2s ease"

  },


  content: {

    padding: 20,

    paddingTop: 76,   // ✅ IMPORTANT → fixed header offset

    minHeight: "100vh"

  }

};
