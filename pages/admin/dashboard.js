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

      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.grid}>
        {/* PRODUCTS */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/products")}
        >
          <div style={styles.icon}>📦</div>
          <div style={styles.label}>Products</div>
          <div style={styles.sub}>Add / Edit / Delete Products</div>
        </div>

        {/* CATEGORIES + SUB CATEGORIES */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/categories")}
        >
          <div style={styles.icon}>🗂️</div>
          <div style={styles.label}>Categories</div>
          <div style={styles.sub}>Main & Sub Categories</div>
        </div>

        {/* ORDERS */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/orders")}
        >
          <div style={styles.icon}>🧾</div>
          <div style={styles.label}>Orders</div>
          <div style={styles.sub}>Manage customer orders</div>
        </div>

        {/* DELIVERY */}
        <div style={styles.card}>
          <div style={styles.icon}>🚚</div>
          <div style={styles.label}>Delivery</div>
          <div style={styles.sub}>Shipping & tracking</div>
        </div>

        {/* CUSTOMERS */}
        <div style={styles.card}>
          <div style={styles.icon}>👤</div>
          <div style={styles.label}>Customers</div>
          <div style={styles.sub}>Customer list</div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= STYLES ================= */

const styles = {
  title: {
    fontSize: 20,
    fontWeight: 700,
  },

  grid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  icon: {
    fontSize: 28,
    marginBottom: 6,
  },

  label: {
    fontSize: 16,
    fontWeight: 700,
  },

  sub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
};
