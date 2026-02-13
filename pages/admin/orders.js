import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

  useEffect(() => {
    checkAdmin();
    fetchOrders();
  }, []);

  async function checkAdmin() {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user || user.email !== ADMIN_EMAIL) {
      router.push("/");
    }
  }

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(id, field, value) {
    await supabase
      .from("orders")
      .update({ [field]: value })
      .eq("id", id);

    fetchOrders();
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Admin Orders</h2>

      {orders.length === 0 && (
        <p>No orders yet</p>
      )}

      {orders.map((order) => (
        <div key={order.id} style={styles.card}>
          
          <div style={styles.header}>
            <div>
              <strong>{order.order_number}</strong>
              <div style={styles.date}>
                {new Date(order.created_at).toLocaleString()}
              </div>
            </div>

            <div>
              <strong>₹ {order.total_amount}</strong>
            </div>
          </div>

          <div style={styles.info}>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>City:</strong> {order.customer_city}</p>
            <p><strong>Address:</strong> {order.customer_address}</p>
            <p><strong>Transport:</strong> {order.transport_name}</p>
          </div>

          <div style={styles.statusRow}>
            <div>
              <label>Order Status</label>
              <select
                value={order.order_status}
                onChange={(e) =>
                  updateStatus(order.id, "order_status", e.target.value)
                }
                style={styles.select}
              >
                <option>Processing</option>
                <option>Confirmed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div>
              <label>Payment Status</label>
              <select
                value={order.payment_status}
                onChange={(e) =>
                  updateStatus(order.id, "payment_status", e.target.value)
                }
                style={styles.select}
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Failed</option>
              </select>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

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
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
  info: {
    fontSize: 14,
    marginBottom: 12,
  },
  statusRow: {
    display: "flex",
    gap: 16,
  },
  select: {
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
};
