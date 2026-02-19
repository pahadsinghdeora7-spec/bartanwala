import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

import {
  FaHome,
  FaBoxOpen,
  FaFolderOpen,
  FaLayerGroup,
  FaClipboardList,
  FaUsers,
  FaImage,
  FaFileAlt,
  FaSignOutAlt,
  FaStore
} from "react-icons/fa";


export default function AdminDrawer({ open, onClose }) {

  const router = useRouter();


  async function logout() {

    await supabase.auth.signOut();

    router.push("/login");

  }


  function Item({ icon, label, path }) {

    return (

      <div
        style={styles.item}
        onClick={() => {
          router.push(path);
          onClose();
        }}
      >

        <span style={styles.icon}>
          {icon}
        </span>

        {label}

      </div>

    );

  }


  return (
    <>
      {/* OVERLAY */}

      {open && (
        <div
          style={styles.overlay}
          onClick={onClose}
        />
      )}


      {/* DRAWER */}

      <div
        style={{
          ...styles.drawer,
          left: open ? 0 : -260
        }}
      >

        {/* HEADER */}

        <div style={styles.header}>

          <div style={styles.title}>
            Admin Panel
          </div>

          <div
            style={styles.close}
            onClick={onClose}
          >
            ✕
          </div>

        </div>



        {/* MENU */}

        <Item
          icon={<FaHome />}
          label="Dashboard"
          path="/admin"
        />

        <Item
          icon={<FaBoxOpen />}
          label="Products"
          path="/admin/products"
        />

        <Item
          icon={<FaFolderOpen />}
          label="Categories"
          path="/admin/categories"
        />

        <Item
          icon={<FaLayerGroup />}
          label="Subcategories"
          path="/admin/subcategories"
        />

        <Item
          icon={<FaClipboardList />}
          label="Orders"
          path="/admin/orders"
        />

        <Item
          icon={<FaUsers />}
          label="Customers"
          path="/admin/customers"
        />

        <Item
          icon={<FaImage />}
          label="Banner Management"
          path="/admin/banners"
        />

        <Item
          icon={<FaFileAlt />}
          label="Policy Management"
          path="/admin/policies"
        />

        <Item
          icon={<FaFileAlt />}
          label="CMS Pages"
          path="/admin/cms"
        />


        <hr style={styles.hr} />


        <Item
          icon={<FaStore />}
          label="Back To Store"
          path="/"
        />


        <div
          style={styles.item}
          onClick={logout}
        >

          <span style={styles.icon}>
            <FaSignOutAlt />
          </span>

          Logout

        </div>


      </div>

    </>
  );

}



/* ================= STYLES ================= */

const styles = {

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 999
  },


  drawer: {
    position: "fixed",
    top: 0,
    bottom: 0,
    width: 260,
    background: "#fff",
    zIndex: 1000,
    transition: "0.25s",
    paddingTop: 10
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    borderBottom: "1px solid #eee"
  },


  title: {
    fontSize: 18,
    fontWeight: 700
  },


  close: {
    fontSize: 18,
    cursor: "pointer"
  },


  item: {
    padding: "12px 16px",
    display: "flex",
    gap: 12,
    alignItems: "center",
    cursor: "pointer",
    fontSize: 15
  },


  icon: {
    fontSize: 16,
    color: "#0B5ED7"
  },


  hr: {
    margin: "10px 0"
  }

};
