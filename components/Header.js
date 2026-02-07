import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";

export default function Header({ onMenuClick, cartCount = 0 }) {
  return (
    <header style={styles.header}>
      {/* LEFT : MENU */}
      <button onClick={onMenuClick} style={styles.iconBtn}>
        <FaBars size={20} />
      </button>

      {/* CENTER : LOGO */}
      <Link href="/">
        <a style={styles.logo}>
          <img
            src="/logo.png"
            alt="Bartanwala"
            style={styles.logoImg}
          />
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
            <FaShoppingCart size={18} />
            {cartCount > 0 && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </a>
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
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px", // ⬅ thoda breathable
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
    fontSize: 16,
    textDecoration: "none",
    color: "#111",
  },

  logoImg: {
    width: 28,
    height: 28,
    objectFit: "contain",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,          // ⬅ icons closer
    marginRight: 6,  // ⬅ left shift effect
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
    color: "#111",
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
