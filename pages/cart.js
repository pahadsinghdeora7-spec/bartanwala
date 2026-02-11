import { useCart } from "../context/CartContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import styles from "../../styles/cart.module.css";

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

      <div style={styles.page}>
        <div style={styles.header}>
          <h2>Shopping Cart</h2>
          <span>{cart.length} items</span>
        </div>

        {cart.length === 0 && (
          <div style={styles.empty}>
            🛒 Your cart is empty
          </div>
        )}

        {cart.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={item.image || "/placeholder.png"}
              style={styles.image}
              alt={item.name}
            />

            <div style={styles.info}>
              <div style={styles.name}>{item.name}</div>
              <div style={styles.price}>
                ₹ {item.price} / {item.price_unit}
              </div>

              <div style={styles.qtyRow}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.qty - 1)}
                >
                  <FaMinus />
                </button>

                <span style={styles.qty}>{item.qty}</span>

                <button
                  style={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <button
              style={styles.delete}
              onClick={() => removeItem(item.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}

        {cart.length > 0 && (
          <div style={styles.summary}>
            <h3>Order Summary</h3>

            <div style={styles.row}>
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div style={styles.rowMuted}>
              <span>Courier Charges</span>
              <span>As applicable</span>
            </div>

            <hr />

            <div style={styles.totalRow}>
              <strong>Total</strong>
              <strong>₹ {subtotal}</strong>
            </div>

            <button
              style={styles.checkout}
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
