import { useRouter } from "next/router";

export default function AdminSidebar({ open, onClose }) {

  const router = useRouter();


  const menu = [

    { name: "Dashboard", path: "/admin" },

    { name: "Products", path: "/admin/products" },

    { name: "Categories", path: "/admin/categories" },

    { name: "Orders", path: "/admin/orders" },

    { name: "Customers", path: "/admin/customers" },

    { name: "Banner", path: "/admin/banner" },

    { name: "CMS Pages", path: "/admin/cms" },

    { name: "Delivery", path: "/admin/delivery" }

  ];


  return (

    <div style={styles.sidebar}>


      <div style={styles.logo}>

        Admin Panel

      </div>


      {menu.map(item => (

        <div
          key={item.path}
          style={{
            ...styles.item,
            background:
              router.pathname === item.path
                ? "#0B5ED7"
                : "transparent",
            color:
              router.pathname === item.path
                ? "#fff"
                : "#111"
          }}
          onClick={() => router.push(item.path)}
        >

          {item.name}

        </div>

      ))}


    </div>

  );

}


/* ================= STYLES ================= */

const styles = {

  sidebar: {
    width: 240,
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    paddingTop: 10
  },

  logo: {
    fontSize: 18,
    fontWeight: 700,
    padding: 16,
    borderBottom: "1px solid #eee"
  },

  item: {
    padding: 14,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500
  }

};
