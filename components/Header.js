import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Header({ onMenuClick }) {
  const { cartCount } = useCart();

  return (
    <header style={styles.header}>
      <button onClick={onMenuClick} style={styles.iconBtn}>
        <FaBars size={20} />
      </button>

      <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>BW</div>
          <span style={styles.logoText}>Bartanwala</span>
        </div>
      </Link>

      <div style={styles.right}>
        <a
          href="https://wa.me/919873670361"
          target="_blank"
          rel="noreferrer"
          style={styles.whatsapp}
        >
          <FaWhatsapp size={18} />
        </a>

        <Link href="/cart" style={{ textDecoration: "none" }}>
          <div style={styles.cart}>
            <FaShoppingCart size={18} />
            {cartCount > 0 && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

/* ✅ STYLES ADDED (IMPORTANT) */

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: 56,
    background: "#0B5ED7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
  },

  iconBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    padding: 6,
    cursor: "pointer",
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  logoIcon: {
    width: 28,
    height: 28,
    background: "#fff",
    color: "#0B5ED7",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
  },

  logoText: {
    fontWeight: 700,
    fontSize: 16,
    color: "#fff",
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
    color: "#fff",
    cursor: "pointer",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    background: "#ff0000",
    color: "#fff",
    fontSize: 10,
    padding: "2px 6px",
    borderRadius: 999,
    fontWeight: 600,
  },
};
