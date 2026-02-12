import { useEffect, useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setCustomers(data || []);
      } else {
        console.error(error.message);
      }

      setLoading(false);
    }

    loadCustomers();
  }, []);

  return (
    <>
      <Head>
        <title>Admin | Customers</title>
      </Head>

      <div style={styles.container}>
        <h1 style={styles.heading}>Customer List</h1>

        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Business</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Mobile</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Pin Code</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.business_name}</td>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}>{c.mobile}</td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.city}</td>
                    <td style={styles.td}>{c.pin_code}</td>
                    <td style={styles.td}>
                      {new Date(c.created_at).toLocaleDateString()}
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
