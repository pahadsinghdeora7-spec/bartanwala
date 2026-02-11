import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Header({ onMenuClick }) {
  const { cartCount } = useCart(); // ✅ DIRECT USE

  return (
    <header style={styles.header}>
      <button onClick={onMenuClick} style={styles.iconBtn}>
        <FaBars size={20} />
      </button>

      <Link href="/" style={{ textDecoration: "none" }}>
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
