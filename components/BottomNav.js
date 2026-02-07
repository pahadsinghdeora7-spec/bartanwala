import Link from "next/link";
import styles from "../styles/bottomNav.module.css";

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <Link href="/categories">Categories</Link>
      <Link href="/cart">Cart</Link>
      <Link href="/orders">Orders</Link>
      <Link href="/account">Account</Link>
    </nav>
  );
}
