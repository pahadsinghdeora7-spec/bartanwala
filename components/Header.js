import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Header({ onMenuClick }) {
  const { cart } = useCart();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    setCount(total);
  }, [cart]);

  return (
    <header style={styles.header}>
      <button onClick={onMenuClick} style={styles.iconBtn}>
        <FaBars size={20} />
      </button>

      <Link href="/" style={styles.logo}>
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

        <Link href="/cart">
          <div style={styles.cart}>
            <FaShoppingCart size={18} />
            {count > 0 && (
              <span style={styles.badge}>{count}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
             }
