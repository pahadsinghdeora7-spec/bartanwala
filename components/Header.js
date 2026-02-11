import Link from "next/link";
import { FaBars, FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Header({ onMenuClick }) {
  const { cartCount } = useCart(); // ✅ DIRECT

  return (
    <header>
      ...
      <Link href="/cart">
        <div>
          <FaShoppingCart />
          {cartCount > 0 && (
            <span>{cartCount}</span>
          )}
        </div>
      </Link>
    </header>
  );
}
