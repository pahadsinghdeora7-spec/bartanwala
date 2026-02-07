import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaHome,
  FaThLarge,
  FaShoppingCart,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import styles from "../styles/bottomNav.module.css";

const items = [
  { name: "Home", href: "/", icon: <FaHome /> },
  { name: "Category", href: "/category", icon: <FaThLarge /> },
  { name: "Cart", href: "/cart", icon: <FaShoppingCart /> },
  { name: "Orders", href: "/orders", icon: <FaClipboardList /> },
  { name: "Account", href: "/account", icon: <FaUser /> },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      {items.map((item) => {
        const active = router.pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={styles.link}>
            <div className={`${styles.item} ${active ? styles.active : ""}`}>
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
