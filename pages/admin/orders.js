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
  }, []);

  async function checkAdmin() {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user || user.email !== ADMIN_EMAIL) {
      router.push("/");
      return;
    }

    fetchOrders();
  }

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id, field, value) {
    const { error } = await supabase
      .from("orders")
      .update({ [field]: value })
      .eq("id", id);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, [field]: value } : o
        )
      );
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "#2563eb";
      case "Shipped":
        return "#f59e0b";
      case "Delivered":
        return "#16a34a";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#16a34a";
      case "Failed":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  if (loading)
    return <div style={{ padding: 20 }}>Loading Orders...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Admin Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <div key={order.id} style={styles.card}>

          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <div style={styles.orderNo}>
                {order.order_number}
              </div>
              <div style={styles.date}>
                {new Date(order.created_at).toLocaleString()}
              </div>
            </div>

            <div style={styles.amount}>
              ₹ {order.total_amount}
            </div>
          </div>

          {/* STATUS BADGES */}
          <div style={styles.badgeRow}>
            <span
              style={{
                ...styles.badge,
                background: getOrderStatusColor(order.order_status),
              }}
            >
              {order.order_status || "Processing"}
            </span>

            <span
              style={{
                ...styles.badge,
                background: getPaymentStatusColor(order.payment_status),
              }}
            >
              {order.payment_status || "Pending"}
            </span>
          </div>

          {/* CUSTOMER INFO */}
          <div style={styles.info}>
            <p><strong>Business:</strong> {order.customer_business || "-"}</p>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>City:</strong> {order.customer_city}</p>
            <p><strong>Transport:</strong> {order.transport_name || "-"}</p>
          </div>

          {/* STATUS UPDATE */}
          <div style={styles.statusRow}>
            <div style={styles.statusBox}>
              <label style={styles.label}>Order Status</label>
              <select
                value={order.order_status || "Processing"}
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

            <div style={styles.statusBox}>
              <label style={styles.label}>Payment Status</label>
              <select
                value={order.payment_status || "Pending"}
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

          {/* VIEW DETAILS BUTTON */}
          <button
            style={styles.viewBtn}
            onClick={() => router.push(`/admin/orders/${order.id}`)}
          >
            View Full Details
          </button>

        </div>
      ))}
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  orderNo: {
    fontWeight: 700,
    fontSize: 16,
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

  badgeRow: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
  },

  badge: {
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 12,
    color: "#fff",
    fontWeight: 600,
  },

  info: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 1.6,
  },

  statusRow: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },

  statusBox: {
    flex: 1,
    minWidth: 180,
  },

  label: {
    display: "block",
    fontSize: 12,
    marginBottom: 6,
    color: "#6b7280",
  },

  select: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  viewBtn: {
    marginTop: 16,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    background: "#0B5ED7",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
