import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";

export default function Header({ onMenuClick, cartCount = 0 }) {
  return (
    <header style={styles.header}>
      {/* LEFT : MENU */}
      <button onClick={onMenuClick} style={styles.iconBtn}>
        <FaBars size={20} color="#fff" />
      </button>

      {/* CENTER : LOGO */}
      <Link href="/">
        <a style={styles.logo}>
          <span style={styles.logoIcon}>🍽️</span>
          <span>Bartanwala</span>
        </a>
      </Link>

      {/* RIGHT : ACTIONS */}
      <div style={styles.right}>
        <a
          href="https://wa.me/919873670361"
          target="_blank"
          rel="noreferrer"
          style={styles.whatsapp}
        >
          <FaWhatsapp size={18} />
        </a>

        <Link href="/cart">
          <a style={styles.cart}>
            <FaShoppingCart size={18} color="#fff" />
            {cartCount > 0 && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </a>
        </Link>
      </div>
    </header>
  );
}

/* ================= STYLES ================= */

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: 56,
    background: "#0B5ED7", // ✅ BLUE HEADER
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
  },

  iconBtn: {
    background: "none",
    border: "none",
    padding: 6,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 18,
    textDecoration: "none",
    color: "#fff",
  },

  logoIcon: {
    fontSize: 26, // 🍽️ utensil icon
    lineHeight: 1,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  whatsapp: {
    background: "#25D366",
    color: "#fff",
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cart: {
    position: "relative",
    padding: 6,
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#dc2626",
    color: "#fff",
    fontSize: 10,
    padding: "2px 5px",
    borderRadius: 999,
    lineHeight: 1,
  },
};
