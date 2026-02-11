import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext"; // ✅ ADD
import styles from "../styles/bottomNav.module.css";

export default function BottomNav() {
  const router = useRouter();
  const { cartCount } = useCart(); // ✅ LIVE COUNT

  const isActive = (path) =>
    router.pathname === path ? styles.active : "";

  return (
    <nav className={styles.nav}>
      <Link href="/" className={isActive("/")}>
        🏠
        <span>Home</span>
      </Link>

      <Link href="/categories" className={isActive("/categories")}>
        📦
        <span>Categories</span>
      </Link>

      {/* ✅ CART WITH COUNT */}
      <Link href="/cart" className={`${isActive("/cart")} ${styles.cartWrap}`}>
        <div className={styles.cartIcon}>
          🛒
          {cartCount > 0 && (
            <span className={styles.badge}>
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </Link>

      <Link href="/orders" className={isActive("/orders")}>
        📄
        <span>Orders</span>
      </Link>

      <Link href="/account" className={isActive("/account")}>
        👤
        <span>Account</span>
      </Link>
    </nav>
  );
        }
