import { FaBars } from "react-icons/fa";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminHeader({ user, onMenuClick }) {

  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  /* ================= CHECK SCREEN ================= */

  useEffect(() => {

    function checkScreen() {

      setIsMobile(window.innerWidth < 768);

    }

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () =>
      window.removeEventListener("resize", checkScreen);

  }, []);


  return (

    <header
      style={{
        ...styles.header,
        left: isMobile ? 0 : 240,   // desktop sidebar offset
        width: isMobile ? "100%" : "calc(100% - 240px)"
      }}
    >

      {/* LEFT */}
      <div style={styles.left}>

        <FaBars
          size={20}
          onClick={onMenuClick}
          style={styles.menu}
        />

        <span style={styles.logo}>
          Admin Panel
        </span>

      </div>


      {/* RIGHT */}
      <div style={styles.right}>

        <span style={styles.email}>
          {user?.email}
        </span>

        <button
          style={styles.storeBtn}
          onClick={() => router.push("/")}
        >
          View Store
        </button>

      </div>


    </header>

  );

}


/* ================= STYLES ================= */

const styles = {

  header: {

    position: "fixed",   // ✅ FIXED HEADER
    top: 0,
    right: 0,

    height: 56,

    background: "#fff",

    borderBottom: "1px solid #e5e7eb",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "0 16px",

    zIndex: 1000,

    transition: "all 0.2s ease"

  },


  left: {

    display: "flex",

    alignItems: "center",

    gap: 12

  },


  menu: {

    cursor: "pointer"

  },


  logo: {

    fontWeight: 700,

    fontSize: 16

  },


  right: {

    display: "flex",

    alignItems: "center",

    gap: 12

  },


  email: {

    fontSize: 13,

    color: "#6b7280"

  },


  storeBtn: {

    background: "#0B5ED7",

    color: "#fff",

    border: "none",

    padding: "6px 12px",

    borderRadius: 6,

    cursor: "pointer",

    fontWeight: 600

  }

};
