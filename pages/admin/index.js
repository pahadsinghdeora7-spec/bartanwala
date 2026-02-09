import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import {
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaFolderOpen,
} from "react-icons/fa";

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
    <>
      <Head>
        <title>Admin Dashboard | Bartanwala</title>
      </Head>

      {/* ADMIN HEADER */}
      <div style={styles.header}>
        <div style={styles.menu}>☰ Admin Panel</div>
        <button
          style={styles.backBtn}
          onClick={() => router.push("/")}
        >
          Back To Store →
        </button>
      </div>

      <div style={styles.page}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <p style={styles.sub}>Welcome, {user.email}</p>

        {/* STATS CARDS */}
        <div style={styles.grid}>
          <StatCard
            icon={<FaBoxOpen />}
            label="Products"
            value={stats.products}
            onClick={() => router.push("/admin/products")}
          />

          <StatCard
            icon={<FaFolderOpen />}
            label="Categories"
            value={stats.categories}
            onClick={() => router.push("/admin/categories")}
          />

          <StatCard
            icon={<FaClipboardList />}
            label="Orders"
            value={stats.orders}
            onClick={() => router.push("/admin/orders")}
          />

          <StatCard
            icon={<FaUsers />}
            label="Customers"
            value={stats.customers}
            onClick={() => router.push("/admin/customers")}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.quickWrap}>
          <h3 style={styles.quickTitle}>Quick Actions</h3>

          <button
            style={styles.quickBtn}
            onClick={() => router.push("/admin/products/add")}
          >
            ➕ Add Product
          </button>

          <button
            style={styles.quickBtn}
            onClick={() => router.push("/admin/categories/add")}
          >
            ➕ Add Category
          </button>

          <button
            style={styles.quickBtn}
            onClick={() => router.push("/admin/categories/add-sub")}
          >
            ➕ Add Sub Category
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= COMPONENT ================= */

function StatCard({ icon, label, value, onClick }) {
  return (
    <div style={styles.stat} onClick={onClick}>
      <div style={styles.icon}>{icon}</div>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  header: {
    background: "#0B5ED7",
    color: "#fff",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menu: {
    fontSize: 18,
    fontWeight: 700,
  },

  backBtn: {
    background: "#fff",
    color: "#0B5ED7",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 600,
  },

  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
  },

  sub: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
    marginBottom: 20,
  },

  stat: {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
    cursor: "pointer",
    border: "1px solid #e5e7eb",
  },

  icon: {
    fontSize: 26,
    color: "#0B5ED7",
  },

  statValue: {
    fontSize: 20,
    fontWeight: 700,
  },

  statLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  quickWrap: {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
  },

  quickTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
  },

  quickBtn: {
    width: "100%",
    padding: 12,
    marginTop: 8,
    borderRadius: 10,
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 600,
    fontSize: 15,
  },
};
