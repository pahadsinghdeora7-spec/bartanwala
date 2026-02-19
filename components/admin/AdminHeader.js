import { FaBars } from "react-icons/fa";
import { useRouter } from "next/router";

export default function AdminHeader({ user, onMenuClick }) {

  const router = useRouter();

  return (

    <div style={styles.header}>


      <FaBars
        size={20}
        onClick={onMenuClick}
        style={{ cursor: "pointer" }}
      />


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


    </div>

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
    padding: "0 20px"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  email: {
    fontSize: 13
  },

  storeBtn: {
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6
  }

};
