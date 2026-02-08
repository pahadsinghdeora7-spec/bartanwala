import Head from "next/head";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

export default function Dashboard() {
  const router = useRouter();

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Bartanwala</title>
      </Head>

      <h1>Admin Dashboard</h1>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => router.push("/admin/products")}>
          📦 Products
        </div>

        <div style={styles.card} onClick={() => router.push("/admin/categories")}>
          🗂️ Categories
        </div>

        <div style={styles.card} onClick={() => router.push("/admin/orders")}>
          🧾 Orders
        </div>

        <div style={styles.card}>
          🚚 Delivery
        </div>

        <div style={styles.card}>
          👤 Customers
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= STYLES ================= */

const styles = {
  grid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 16,
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
};
