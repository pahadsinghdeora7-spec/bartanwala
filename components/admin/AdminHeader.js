import { useRouter } from "next/router";

export default function AdminHeader({ onMenuClick }) {
  const router = useRouter();

  return (
    <header style={styles.header}>
      {/* LEFT – MENU ICON */}
      <button style={styles.menuBtn} onClick={onMenuClick}>
        ☰
      </button>

      {/* TITLE */}
      <div style={styles.title}>Admin Panel</div>

      {/* RIGHT – BACK TO STORE */}
      <button
        style={styles.storeBtn}
        onClick={() => router.push("/")}
      >
        Back to Store →
      </button>
    </header>
  );
}

/* ================= STYLES ================= */

const styles = {
  header: {
    height: 56,
    background: "#0B5ED7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  menuBtn: {
    fontSize: 22,
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  title: {
    fontSize: 16,
    fontWeight: 700,
  },

  storeBtn: {
    background: "#fff",
    color: "#0B5ED7",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};
