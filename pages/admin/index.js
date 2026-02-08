import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import {
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaTruck,
} from "react-icons/fa";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pending: 0,
    customers: 0,
  });

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user || data.user.email !== ADMIN_EMAIL) {
        router.replace("/");
        return;
      }

      setUser(data.user);

      try {
        const { count: productCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        const { count: orderCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        const { count: pendingCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        const { count: customerCount } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true });

        setStats({
          products: productCount || 0,
          orders: orderCount || 0,
          pending: pendingCount || 0,
          customers: customerCount || 0,
        });
      } catch (err) {
        console.error("Admin stats error:", err);
      }

      setLoading(false);
    }

    init();
  }, []);

  if (loading) return null;
  if (!user) return null;

  return (
    <>
      <Head>
        <title>Admin Dashboard | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <p style={styles.sub}>Welcome, {user.email}</p>

        {/* STATS */}
        <div style={styles.grid}>
          <StatCard
            icon={<FaBoxOpen />}
            label="Products"
            value={stats.products}
            onClick={() => router.push("/admin/products")}
          />

          <StatCard
            icon={<FaClipboardList />}
            label="Total Orders"
            value={stats.orders}
            onClick={() => router.push("/admin/orders")}
          />

          <StatCard
            icon={<FaTruck />}
            label="Pending Orders"
            value={stats.pending}
            onClick={() => router.push("/admin/orders?status=pending")}
          />

          <StatCard
            icon={<FaUsers />}
            label="Customers"
            value={stats.customers}
            onClick={() => router.push("/admin/customers")}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.card}>
          <h3>Quick Actions</h3>

          <button
            style={styles.btn}
            onClick={() => router.push("/admin/products/add")}
          >
            ➕ Add New Product
          </button>

          <button
            style={styles.btn}
            onClick={() => router.push("/admin/orders")}
          >
            📦 Manage Orders
          </button>

          <button
            style={styles.btn}
            onClick={() => router.push("/admin/policies")}
          >
            📜 Manage Policies
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
  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: 20,
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
    gap: 12,
    marginBottom: 16,
  },

  stat: {
    background: "#fff",
    padding: 14,
    borderRadius: 12,
    display: "flex",
    gap: 12,
    alignItems: "center",
    cursor: "pointer",
    border: "1px solid #e5e7eb",
  },

  icon: {
    fontSize: 22,
    color: "#0B5ED7",
  },

  statValue: {
    fontSize: 18,
    fontWeight: 700,
  },

  statLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
  },

  btn: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 600,
    fontSize: 15,
  },
};
