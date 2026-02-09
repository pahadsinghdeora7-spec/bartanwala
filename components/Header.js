import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";

export default function Header({ onMenuClick }) {
  const router = useRouter();
  const { cartCount } = useCart();

  // ❌ Admin pages par header hide
  if (router.pathname.startsWith("/admin")) return null;

  return (
    <header style={styles.header}>
      <button onClick={onMenuClick} style={styles.iconBtn}>
        <FaBars size={20} />
      </button>

      <Link href="/" style={styles.logo}>
        <span style={styles.logoIcon}>🍽️</span>
        <span>Bartanwala</span>
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

        <Link href="/cart" style={styles.cart}>
          <FaShoppingCart size={18} />
          {cartCount > 0 && (
            <span style={styles.badge}>{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: 56,
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
    color: "#fff",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "#fff",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 16,
    textDecoration: "none",
    color: "#fff",
  },
  logoIcon: { fontSize: 20 },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
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
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    background: "#dc2626",
    color: "#fff",
    fontSize: 11,
    padding: "2px 6px",
    borderRadius: 999,
    fontWeight: 700,
  },
};
