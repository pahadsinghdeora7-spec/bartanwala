import { useCart } from "../context/CartContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import styles from "../styles/cart.module.css";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeItem } = useCart(); // ✅ USE CONTEXT

  const subtotal = cart.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty),
    0
  );

  return (
    <>
      <Head>
        <title>My Cart | Bartanwala</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.header}>
          <h2>Shopping Cart</h2>
          <span>{cart.length} items</span>
        </div>

        {cart.length === 0 && (
          <div className={styles.empty}>
            🛒 Your cart is empty
          </div>
        )}

        {cart.map((item) => (
          <div key={item.id} className={styles.card}>
            <img
              src={item.image || "/placeholder.png"}
              className={styles.image}
              alt={item.name}
            />

            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.price}>
                ₹ {item.price} / {item.price_unit}
              </div>

              <div className={styles.qtyRow}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.qty - 1)}
                >
                  <FaMinus />
                </button>

                <span className={styles.qty}>{item.qty}</span>

                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <button
              className={styles.delete}
              onClick={() => removeItem(item.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}

        {cart.length > 0 && (
          <div className={styles.summary}>
            <h3>Order Summary</h3>

            <div className={styles.row}>
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div className={styles.rowMuted}>
              <span>Courier Charges</span>
              <span>As applicable</span>
            </div>

            <hr />

            <div className={styles.totalRow}>
              <strong>Total</strong>
              <strong>₹ {subtotal}</strong>
            </div>

            <button
              className={styles.checkout}
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
