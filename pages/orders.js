import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>My Orders | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <h1 style={styles.heading}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={styles.empty}>
            You have not placed any orders yet.
          </div>
        ) : (
          <div style={styles.list}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={styles.card}
                onClick={() =>
                  router.push(`/order-success?id=${order.id}`)
                }
              >
                <div style={styles.row}>
                  <strong>{order.order_number}</strong>
                  <span style={getStatusStyle(order.status)}>
                    {order.status || "Processing"}
                  </span>
                </div>

                <div style={styles.subRow}>
                  <span>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <strong>₹ {order.total_amount}</strong>
                </div>

                <div style={styles.paymentRow}>
                  Payment:{" "}
                  <span style={getPaymentStyle(order.payment_status)}>
                    {order.payment_status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ================= STATUS STYLES ================= */

function getStatusStyle(status) {
  switch (status) {
    case "Delivered":
      return styles.delivered;
    case "Shipped":
      return styles.shipped;
    case "Cancelled":
      return styles.cancelled;
    default:
      return styles.processing;
  }
}

function getPaymentStyle(status) {
  return status === "Paid"
    ? styles.paid
    : styles.pending;
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    paddingBottom: 90,
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  heading: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
  },

  empty: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    color: "#6b7280",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    padding: 16,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  subRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },

  paymentRow: {
    fontSize: 13,
  },

  /* STATUS COLORS */
  processing: {
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
  },

  shipped: {
    background: "#fef9c3",
    color: "#854d0e",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
  },

  delivered: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
  },

  cancelled: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
  },

  paid: {
    color: "#16a34a",
    fontWeight: 600,
  },

  pending: {
    color: "#dc2626",
    fontWeight: 600,
  },
};
