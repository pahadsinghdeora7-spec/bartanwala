import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function OrderSuccess() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setOrder(data);
      }

      setLoading(false);
    }

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!order) {
    return <div style={{ padding: 20 }}>Order not found.</div>;
  }

  return (
    <>
      <Head>
        <title>Order Success | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>🎉 Order Successfully Placed</h2>

          <div style={styles.row}>
            <span>Order Number:</span>
            <strong>{order.order_number}</strong>
          </div>

          <div style={styles.row}>
            <span>Order Status:</span>
            <strong style={{ color: "#0B5ED7" }}>
              {order.status || "Processing"}
            </strong>
          </div>

          <div style={styles.row}>
            <span>Payment Status:</span>
            <strong style={{ color: "#16a34a" }}>
              {order.payment_status || "Pending"}
            </strong>
          </div>

          <div style={styles.row}>
            <span>Total Amount:</span>
            <strong>₹ {order.total_amount}</strong>
          </div>

          <button
            style={styles.button}
            onClick={() => router.push("/orders")}
          >
            View My Orders
          </button>

          <button
            style={styles.homeBtn}
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    background: "#fff",
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 18,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    fontSize: 14,
  },

  button: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },

  homeBtn: {
    marginTop: 10,
    width: "100%",
    padding: 12,
    background: "#e5e7eb",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
};
