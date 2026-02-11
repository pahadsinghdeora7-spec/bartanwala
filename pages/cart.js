import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(saved);
    }
  }, []);

  const updateQty = (id, qty) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, qty) } : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

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

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
    paddingBottom: 90,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 600,
  },

  empty: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    color: "#6b7280",
  },

  card: {
    display: "flex",
    gap: 12,
    background: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },

  image: {
    width: 64,
    height: 64,
    objectFit: "contain",
    background: "#f3f4f6",
    borderRadius: 8,
  },

  info: { flex: 1 },

  name: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 4,
  },

  price: {
    fontSize: 13,
    color: "#2563eb",
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },

  qtyBtn: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: "4px 8px",
    borderRadius: 6,
    cursor: "pointer",
  },

  qty: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: 600,
  },

  delete: {
    background: "none",
    border: "none",
    color: "#dc2626",
    fontSize: 16,
    cursor: "pointer",
  },

  summary: {
    background: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  rowMuted: {
    display: "flex",
    justifyContent: "space-between",
    color: "#6b7280",
    fontSize: 13,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    fontSize: 16,
  },

  checkout: {
    marginTop: 14,
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    padding: 16,
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};
