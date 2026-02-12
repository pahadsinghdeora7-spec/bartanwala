import { useEffect, useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          total_amount,
          status,
          customers (
            business_name,
            name,
            mobile,
            city
          )
        `)
        .order("created_at", { ascending: false });

      if (!error) {
        setOrders(data || []);
      } else {
        console.error(error.message);
      }

      setLoading(false);
    }

    loadOrders();
  }, []);

  return (
    <>
      <Head>
        <title>Admin | Orders</title>
      </Head>

      <div style={styles.container}>
        <h1 style={styles.heading}>Order List</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Mobile</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={styles.td}>#{o.id}</td>
                    <td style={styles.td}>
                      {o.customers?.business_name || o.customers?.name}
                    </td>
                    <td style={styles.td}>{o.customers?.mobile}</td>
                    <td style={styles.td}>{o.customers?.city}</td>
                    <td style={styles.td}>₹ {o.total_amount}</td>
                    <td style={styles.td}>{o.status}</td>
                    <td style={styles.td}>
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 20,
  },

  tableWrapper: {
    overflowX: "auto",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: 12,
    background: "#f9fafb",
    borderBottom: "1px solid #E5E7EB",
    fontSize: 14,
  },

  td: {
    padding: 12,
    borderBottom: "1px solid #E5E7EB",
    fontSize: 13,
  },
};
