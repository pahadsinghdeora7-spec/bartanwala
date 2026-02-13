import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/router";

export default function AdminOrderDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  async function fetchOrder() {
    // Fetch order
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    // Fetch items
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setOrder(orderData);
    setItems(itemsData || []);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!order) return <div style={{ padding: 20 }}>Order not found</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Order Details</h2>

      {/* ORDER HEADER */}
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <strong>{order.order_number}</strong>
            <div style={styles.date}>
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>

          <div style={styles.amount}>
            ₹ {order.total_amount}
          </div>
        </div>

        <div style={styles.statusRow}>
          <span style={styles.badge}>
            Order: {order.order_status}
          </span>

          <span style={styles.badge}>
            Payment: {order.payment_status}
          </span>
        </div>
      </div>

      {/* CUSTOMER DETAILS */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Customer Details</h3>

        <p><strong>Business:</strong> {order.customer_business || "-"}</p>
        <p><strong>Name:</strong> {order.customer_name}</p>
        <p><strong>Phone:</strong> {order.customer_phone}</p>
        <p><strong>City:</strong> {order.customer_city}</p>
        <p><strong>Address:</strong> {order.customer_address}</p>
        <p><strong>Transport:</strong> {order.transport_name || "-"}</p>
      </div>

      {/* ORDER ITEMS */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Order Items</h3>

        {items.length === 0 && <p>No items found</p>}

        {items.map((item) => (
          <div key={item.id} style={styles.itemRow}>
            <div>
              <strong>{item.product_name}</strong>
              <div style={styles.meta}>
                Qty: {item.quantity} × ₹{item.price}
              </div>
            </div>

            <div style={styles.itemTotal}>
              ₹ {item.quantity * item.price}
            </div>
          </div>
        ))}

        <hr />

        <div style={styles.totalRow}>
          <strong>Total</strong>
          <strong>₹ {order.total_amount}</strong>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 20,
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 20,
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 18,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  date: {
    fontSize: 12,
    color: "#6b7280",
  },

  amount: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0B5ED7",
  },

  statusRow: {
    display: "flex",
    gap: 12,
  },

  badge: {
    background: "#eef2ff",
    padding: "6px 10px",
    borderRadius: 8,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  meta: {
    fontSize: 12,
    color: "#6b7280",
  },

  itemTotal: {
    fontWeight: 700,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    fontSize: 16,
  },
};
