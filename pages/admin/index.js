import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import {
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaTruck,
  FaFolderOpen,
} from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
  });

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();

      if (!data?.user || data.user.email !== ADMIN_EMAIL) {
        router.replace("/");
        return;
      }

      setUser(data.user);

      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: categoryCount } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      const { count: orderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      setStats({
        products: productCount || 0,
        categories: categoryCount || 0,
        orders: orderCount || 0,
        customers: customerCount || 0,
      });

      setLoading(false);
    }

    init();
  }, []);

  if (loading || !user) return null;

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Bartanwala</title>
      </Head>

      <h2 style={{ marginBottom: 6 }}>Admin Dashboard</h2>
      <p style={{ color: "#6b7280", fontSize: 13 }}>
        Welcome, {user.email}
      </p>

      {/* 🔥 MAIN CARDS */}
      <div style={styles.grid}>
        <Card
          icon={<FaBoxOpen />}
          label="Products"
          value={stats.products}
          onClick={() => router.push("/admin/products")}
        />

        <Card
          icon={<FaFolderOpen />}
          label="Categories"
          value={stats.categories}
          onClick={() => router.push("/admin/categories")}
        />

        <Card
          icon={<FaClipboardList />}
          label="Orders"
          value={stats.orders}
          onClick={() => router.push("/admin/orders")}
        />

        <Card
          icon={<FaUsers />}
          label="Customers"
          value={stats.customers}
          onClick={() => router.push("/admin/customers")}
        />
      </div>
    </AdminLayout>
  );
}

/* ================= CARD ================= */

function Card({ icon, label, value, onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.icon}>{icon}</div>
      <div>
        <div style={styles.value}>{value}</div>
        <div style={styles.label}>{label}</div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    marginTop: 16,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },

  icon: {
    fontSize: 22,
    color: "#0B5ED7",
  },

  value: {
    fontSize: 18,
    fontWeight: 700,
  },

  label: {
    fontSize: 13,
    color: "#6b7280",
  },
};
