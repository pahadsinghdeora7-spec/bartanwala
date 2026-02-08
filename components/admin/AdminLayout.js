import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { FaBars } from "react-icons/fa";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.replace("/admin/login");
      } else {
        setChecking(false);
      }
    });
  }, []);

  if (checking) return null;

  return (
    <div style={styles.wrapper}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <div style={styles.left}>
          <FaBars size={20} />
          <span style={styles.logo}>Admin Panel</span>
        </div>

        <button
          style={styles.storeBtn}
          onClick={() => router.push("/")}
        >
          Back To Store →
        </button>
      </header>

      {/* ================= CONTENT ================= */}
      <main style={styles.content}>{children}</main>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6f8",
  },

  header: {
    height: 56,
    background: "#0B5ED7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 700,
    fontSize: 16,
  },

  logo: {
    letterSpacing: 0.3,
  },

  storeBtn: {
    background: "#fff",
    color: "#0B5ED7",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },

  content: {
    padding: 16,
  },
};
