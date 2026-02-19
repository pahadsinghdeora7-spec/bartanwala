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


  if (loading) return null;


  return (

    <div style={styles.wrapper}>


      {/* SIDEBAR */}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* MAIN */}

      <div style={styles.main}>


        <AdminHeader
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />


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
    marginLeft: 240
  },

  content: {
    padding: 20
  }

};
