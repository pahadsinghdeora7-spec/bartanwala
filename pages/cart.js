import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaWhatsapp,
} from "react-icons/fa";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  function updateQty(id, qty) {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, qty: Math.max(1, qty) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function removeItem(id) {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const totalAmount = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const whatsappText = encodeURIComponent(
    cart
      .map(
        (i) =>
          `${i.name} - Qty: ${i.qty} (${i.price}/${i.price_unit})`
      )
      .join("\n") +
      `\n\nTotal: ₹${totalAmount}`
  );

  return (
    <>
      <Head>
        <title>My Cart | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        {/* HEADER */}
        <div style={styles.topRow}>
          <h2>My Cart</h2>
          <Link href="/">
            <a style={styles.continue}>Continue Shopping</a>
          </Link>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 && (
          <div style={styles.empty}>
            🛒 Cart is empty
          </div>
        )}

        {/* CART ITEMS */}
        {cart.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={item.image || "/placeholder.png"}
              style={styles.image}
            />

            <div style={styles.info}>
              <div style={styles.name}>{item.name}</div>
              <div style={styles.price}>
                ₹ {item.price} / {item.price_unit}
              </div>

              <div style={styles.qtyRow}>
                <button
                  onClick={() =>
                    updateQty(item.id, item.qty - 1)
                  }
                >
                  <FaMinus />
                </button>

                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.id, Number(e.target.value))
                  }
                />

                <button
                  onClick={() =>
                    updateQty(item.id, item.qty + 1)
                  }
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <button
              style={styles.remove}
              onClick={() => removeItem(item.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* STICKY BOTTOM SUMMARY */}
      {cart.length > 0 && (
        <div style={styles.bottom}>
          <div style={styles.total}>
            <span>Total</span>
            <strong>₹ {totalAmount}</strong>
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
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    paddingBottom: 120,
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  continue: {
    fontSize: 13,
    color: "#2563eb",
    textDecoration: "underline",
  },

  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#6b7280",
  },

  card: {
    display: "flex",
    gap: 12,
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  image: {
    width: 64,
    height: 64,
    objectFit: "contain",
    borderRadius: 8,
    background: "#f3f4f6",
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
  },

  price: {
    fontSize: 13,
    color: "#2563eb",
    marginTop: 2,
  },

  qtyRow: {
    display: "flex",
    gap: 6,
    marginTop: 8,
    alignItems: "center",
  },

  remove: {
    background: "none",
    border: "none",
    color: "#dc2626",
  },

  bottom: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
    padding: 12,
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    fontSize: 16,
  },

  whatsapp: {
    background: "#25D366",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 700,
    display: "flex",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
  },
};
