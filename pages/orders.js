import Head from "next/head";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Demo orders (baad me Supabase se connect karenge)
    const dummyOrders = [
      {
        id: "ORD-1001",
        date: "12 Jan 2026",
        total: 900,
        status: "Processing",
      },
    ];

    setOrders(dummyOrders);
  }, []);

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
              <div key={order.id} style={styles.card}>
                <div style={styles.row}>
                  <strong>{order.id}</strong>
                  <span style={styles.status}>{order.status}</span>
                </div>

                <div style={styles.subRow}>
                  <span>{order.date}</span>
                  <strong>₹ {order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: 16,
    paddingBottom: 90,
  },

  heading: {
    fontSize: 20,
    marginBottom: 16,
  },

  empty: {
    background: "#f3f4f6",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
    color: "#6b7280",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  card: {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    padding: 14,
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
  },

  status: {
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
  },
};
