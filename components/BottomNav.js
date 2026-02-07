import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaHome,
  FaThLarge,
  FaShoppingCart,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";

const navItems = [
  { label: "Home", path: "/", icon: <FaHome /> },
  { label: "Category", path: "/category", icon: <FaThLarge /> },
  { label: "Cart", path: "/cart", icon: <FaShoppingCart /> },
  { label: "Orders", path: "/orders", icon: <FaClipboardList /> },
  { label: "Account", path: "/account", icon: <FaUser /> },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <nav style={styles.nav}>
      {navItems.map((item) => {
        const active = router.pathname === item.path;

        return (
          <Link key={item.path} href={item.path} style={styles.link}>
            <div
              style={{
                ...styles.item,
                color: active ? "#0B5ED7" : "#9CA3AF",
              }}
            >
              <div style={{ fontSize: 18 }}>{item.icon}</div>
              <small>{item.label}</small>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    background: "#fff",
    borderTop: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 100,
  },
  link: {
    textDecoration: "none",
    flex: 1,
  },
  item: {
    textAlign: "center",
    fontSize: 12,
  },
};
