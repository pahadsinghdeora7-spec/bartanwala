import { useEffect, useState } from "react";
import Head from "next/head";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaWhatsapp,
} from "react-icons/fa";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
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
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const whatsappText = encodeURIComponent(
    cart
      .map(
        (i) =>
          `${i.name}\nQty: ${i.qty}\nRate: ₹${i.price}/${i.price_unit}\n`
      )
      .join("\n") + `\nTotal Amount: ₹${subtotal}`
  );

  return (
    <>
      <Head>
        <title>Shopping Cart | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        {/* TITLE */}
        <h2 style={styles.title}>
          Shopping Cart ({cart.length} items)
        </h2>

        {/* CART LIST */}
        {cart.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={item.image || "/placeholder.png"}
              style={styles.image}
            />

            <div style={styles.info}>
              <div style={styles.name}>{item.name}</div>
              <div style={styles.price}>₹ {item.price}</div>

              <div style={styles.qtyRow}>
                <button onClick={() => updateQty(item.id, item.qty - 1)}>
                  <FaMinus />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>
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

        {/* ORDER SUMMARY */}
        {cart.length > 0 && (
          <div style={styles.summary}>
            <h3>Order Summary</h3>

            <div style={styles.row}>
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div style={styles.rowMuted}>
              <span>Courier Charges</span>
              <span>Not included</span>
            </div>

            <hr />

            <div style={styles.totalRow}>
              <strong>Total</strong>
              <strong>₹ {subtotal}</strong>
            </div>

            <a
              href={`https://wa.me/919873670361?text=${whatsappText}`}
              target="_blank"
              style={styles.whatsapp}
            >
              <FaWhatsapp /> Place Order on WhatsApp
            </a>
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
    paddingBottom: 80,
  },

  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 12,
  },

  card: {
    display: "flex",
    gap: 12,
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    objectFit: "contain",
    background: "#f3f4f6",
    borderRadius: 6,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    color: "#2563eb",
  },

  qtyRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 6,
  },

  delete: {
    background: "none",
    border: "none",
    color: "#dc2626",
  },

  summary: {
    background: "#fff",
    borderRadius: 12,
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

  whatsapp: {
    marginTop: 14,
    background: "#2563eb",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: 600,
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
  },
};
