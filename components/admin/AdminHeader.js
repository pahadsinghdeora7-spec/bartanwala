import { FaBars } from "react-icons/fa";
import { useRouter } from "next/router";

export default function AdminHeader({ user, onMenuClick }) {

  const router = useRouter();

  return (

    <header style={styles.header}>

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
    height: 56,
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    position: "sticky",
    top: 0,
    zIndex: 500
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
