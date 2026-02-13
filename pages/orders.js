import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      // 🔹 Get customer record
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!customer) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // 🔹 Get orders for that customer
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (loading)
    return <div style={styles.page}>Loading Orders...</div>;

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
                  <span style={styles.status}>
                    {order.status}
                  </span>
                </div>

                <div style={styles.subRow}>
                  <span>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <strong>₹ {order.total_amount}</strong>
                </div>

                <div style={styles.payment}>
                  Payment: {order.payment_status}
                </div>
              </div>
            ))}
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
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 16,
    cursor: "pointer",
    transition: "0.2s",
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

  payment: {
    marginTop: 6,
    fontSize: 12,
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
