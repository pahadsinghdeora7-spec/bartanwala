import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function OrderSuccess() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  async function fetchOrder() {
    try {
      // 🔹 Fetch order
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      // 🔹 Fetch order items
      const { data: itemData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);

      setOrder(orderData);
      setItems(itemData || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (loading)
    return <div style={{ padding: 20 }}>Loading Order...</div>;

  if (!order)
    return <div style={{ padding: 20 }}>Order not found.</div>;

  return (
    <>
      <Head>
        <title>Order Success | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.successTitle}>
            🎉 Order Successfully Placed
          </h2>

          <div style={styles.section}>
            <p><strong>Order Number:</strong> {order.order_number}</p>
            <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment Status:</strong> {order.payment_status}</p>
            <p><strong>Total Amount:</strong> ₹ {order.total_amount}</p>
          </div>

          <hr style={styles.hr} />

          <div style={styles.section}>
            <h4>Customer Details</h4>
            <p><strong>Business:</strong> {order.customer_business || "-"}</p>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>City:</strong> {order.customer_city}</p>
            <p><strong>Address:</strong> {order.customer_address}</p>
          </div>

          <hr style={styles.hr} />

          <div style={styles.section}>
            <h4>Transport Details</h4>
            <p><strong>Transport Name:</strong> {order.transport_name || "-"}</p>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
          </div>

          <hr style={styles.hr} />

          <div style={styles.section}>
            <h4>Ordered Items</h4>

            {items.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <div>
                  <strong>{item.product_name}</strong>
                  <div style={styles.qty}>
                    Qty: {item.quantity} {item.unit}
                  </div>
                </div>

                <div>
                  ₹ {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <hr style={styles.hr} />

          <div style={styles.buttonRow}>
            <button
              style={styles.primaryBtn}
              onClick={() => router.push("/orders")}
            >
              View My Orders
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => router.push("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },

  successTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
    color: "#16a34a",
  },

  section: {
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 1.6,
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  qty: {
    fontSize: 12,
    color: "#6b7280",
  },

  hr: {
    margin: "16px 0",
  },

  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "10px 16px",
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "10px 16px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
