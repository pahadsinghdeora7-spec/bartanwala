import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaWhatsapp,
  FaRupeeSign,
} from "react-icons/fa";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  function updateQty(id, qty) {
    if (qty < 1) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function removeItem(id) {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const whatsappMessage = encodeURIComponent(
    `Hello Bartanwala,

I want to place bulk order:

${cart
  .map(
    (i) =>
      `• ${i.name}
  Qty: ${i.qty}
  Price: ₹${i.price}/${i.price_unit}`
  )
  .join("\n\n")}

Total Approx: ₹${total}

Please confirm best bulk price.`
  );

  return (
    <>
      <Head>
        <title>Cart | Bartanwala</title>
      </Head>

      {/* HEADER */}
      <header style={styles.header}>
        <strong>My Cart</strong>
        <Link href="/">Continue Shopping</Link>
      </header>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <div style={styles.empty}>
          <p>Your cart is empty</p>
          <Link href="/">Browse Products</Link>
        </div>
      )}

      {/* CART ITEMS */}
      <div style={styles.page}>
        {cart.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              style={styles.image}
            />

            <div style={{ flex: 1 }}>
              <h4 style={styles.name}>{item.name}</h4>

              <div style={styles.price}>
                <FaRupeeSign /> {item.price} / {item.price_unit}
              </div>

              {/* QTY */}
              <div style={styles.qtyRow}>
                <button onClick={() => updateQty(item.id, item.qty - 1)}>
                  <FaMinus />
                </button>

                <input
                  type="number"
                  value={item.qty}
                  min="1"
                  onChange={(e) =>
                    updateQty(item.id, Number(e.target.value) || 1)
                  }
                />

                <button onClick={() => updateQty(item.id, item.qty + 1)}>
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

      {/* FOOTER TOTAL */}
      {cart.length > 0 && (
        <div style={styles.footer}>
          <div style={styles.totalRow}>
            <span>Total</span>
            <strong>₹ {total}</strong>
          </div>

          <a
            href={`https://wa.me/919873670361?text=${whatsappMessage}`}
            target="_blank"
            style={styles.whatsappBtn}
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
  header: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
  },

  page: {
    padding: 12,
    paddingBottom: 120,
    background: "#f5f6f8",
  },

  empty: {
    padding: 40,
    textAlign: "center",
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 12,
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  image: {
    width: 70,
    height: 70,
    objectFit: "contain",
    borderRadius: 8,
    background: "#f3f4f6",
  },

  name: {
    fontSize: 14,
    marginBottom: 4,
  },

  price: {
    fontSize: 13,
    color: "#0B5ED7",
    marginBottom: 8,
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  remove: {
    background: "none",
    border: "none",
    color: "#ef4444",
  },

  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
    padding: 14,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    fontSize: 16,
  },

  whatsappBtn: {
    display: "block",
    background: "#25D366",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: 600,
    textDecoration: "none",
  },
};
