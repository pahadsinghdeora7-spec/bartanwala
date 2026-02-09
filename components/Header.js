import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Header({ onMenuClick }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  /* ================= LOAD + LIVE UPDATE CART COUNT ================= */
  useEffect(() => {
    const loadCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalQty = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
      setCartCount(totalQty);
    };

    loadCount(); // first load

    // 🔥 listen from cart page
    window.addEventListener("cartUpdated", loadCount);

    return () => {
      window.removeEventListener("cartUpdated", loadCount);
    };
  }, []);

  /* ================= HIDE HEADER ON ADMIN ================= */
  if (router.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header style={styles.header}>
      {/* MENU */}
      <button onClick={onMenuClick} style={styles.iconBtn}>
        <FaBars size={20} />
      </button>

      {/* LOGO */}
      <Link href="/" style={styles.logo}>
        <span style={styles.logoIcon}>🍽️</span>
        <span>Bartanwala</span>
      </Link>

      {/* ACTIONS */}
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

/* ================= STYLES ================= */

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: 56,
    background: "#2563eb", // 🔵 blue header
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

  logoIcon: {
    fontSize: 20,
  },

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
