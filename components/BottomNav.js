import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import styles from "../styles/bottomNav.module.css";

export default function BottomNav() {
  const router = useRouter();
  const { cartCount } = useCart();

  const isActive = (path) =>
    router.pathname === path ? styles.active : "";

  return (
    <nav className={styles.nav}>
      <Link href="/" className={isActive("/")}>
        <span>🏠</span>
        <span>Home</span>
      </Link>

      <Link href="/categories" className={isActive("/categories")}>
        <span>📦</span>
        <span>Categories</span>
      </Link>

      <Link href="/cart" className={`${styles.cartLink} ${isActive("/cart")}`}>
        <span className={styles.cartIcon}>
          🛒
          {cartCount > 0 && (
            <span className={styles.badge}>{cartCount}</span>
          )}
        </span>
        <span>Cart</span>
      </Link>

      <Link href="/orders" className={isActive("/orders")}>
        <span>📄</span>
        <span>Orders</span>
      </Link>

      <Link href="/account" className={isActive("/account")}>
        <span>👤</span>
        <span>Account</span>
      </Link>
    </nav>
  );
          }
