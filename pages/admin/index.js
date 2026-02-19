import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

import {
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaFolderOpen,
  FaLayerGroup,
  FaMoneyBillWave,
  FaBan,
  FaTruck,
  FaFileAlt,
  FaImage
} from "react-icons/fa";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function AdminDashboard() {

  const router = useRouter();

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    subcategories: 0,
    orders: 0,
    customers: 0,
    pending: 0,
    cancelled: 0,
    delivered: 0,
    revenue: 0
  });

  const [loading, setLoading] = useState(true);


  /* ================= INIT ================= */

  useEffect(() => {
    init();
  }, []);


  async function init() {

    const { data } = await supabase.auth.getUser();

    if (!data?.user || data.user.email !== ADMIN_EMAIL) {
      router.replace("/");
      return;
    }

    setUser(data.user);

    await loadStats();

    setLoading(false);

  }


  /* ================= LOAD STATS ================= */

  async function loadStats() {

    const { count: products } =
      await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

    const { count: categories } =
      await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

    const { count: subcategories } =
      await supabase
        .from("subcategories")
        .select("*", { count: "exact", head: true });

    const { count: customers } =
      await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });


    const { data: orders } =
      await supabase
        .from("orders")
        .select("status,total_amount");


    const totalOrders = orders?.length || 0;

    const pending =
      orders?.filter(o => o.status === "Processing").length || 0;

    const cancelled =
      orders?.filter(o => o.status === "Cancelled").length || 0;

    const deliveredOrders =
      orders?.filter(o => o.status === "Delivered") || [];

    const delivered = deliveredOrders.length;

    const revenue =
      deliveredOrders.reduce(
        (sum, o) => sum + Number(o.total_amount || 0),
        0
      );


    setStats({
      products: products || 0,
      categories: categories || 0,
      subcategories: subcategories || 0,
      customers: customers || 0,
      orders: totalOrders,
      pending,
      cancelled,
      delivered,
      revenue
    });

  }


  if (loading || !user) return null;


  return (
    <>
      <Head>
        <title>Admin Dashboard | Bartanwala</title>
      </Head>


      {/* HEADER */}

      <div style={styles.header}>

        <div style={styles.menu}>
          ☰ Admin Panel
        </div>

        <button
          style={styles.backBtn}
          onClick={() => router.push("/")}
        >
          Back To Store →
        </button>

      </div>


      <div style={styles.page}>

        <h2 style={styles.title}>
          Admin Dashboard
        </h2>

        <p style={styles.sub}>
          Welcome, {user.email}
        </p>



        {/* ================= ORDER STATS ================= */}

        <div style={styles.grid}>

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
            onClick={() => router.push("/admin/orders?status=Processing")}
          />

          <StatCard
            icon={<FaBan />}
            label="Cancelled Orders"
            value={stats.cancelled}
            onClick={() => router.push("/admin/orders?status=Cancelled")}
          />

          <StatCard
            icon={<FaTruck />}
            label="Delivered Orders"
            value={stats.delivered}
            onClick={() => router.push("/admin/orders?status=Delivered")}
          />

          <StatCard
            icon={<FaMoneyBillWave />}
            label="Total Revenue"
            value={`₹ ${stats.revenue}`}
          />

        </div>



        {/* ================= MAIN MANAGEMENT ================= */}

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
            icon={<FaLayerGroup />}
            label="Subcategories"
            value={stats.subcategories}
            onClick={() => router.push("/admin/subcategories")}
          />

          <StatCard
            icon={<FaUsers />}
            label="Customers"
            value={stats.customers}
            onClick={() => router.push("/admin/customers")}
          />

          <StatCard
            icon={<FaImage />}
            label="Banner Management"
            onClick={() => router.push("/admin/banners")}
          />

          <StatCard
            icon={<FaFileAlt />}
            label="Policy Management"
            onClick={() => router.push("/admin/policies")}
          />

        </div>



        {/* QUICK ACTION */}

        <div style={styles.quickWrap}>

          <h3 style={styles.quickTitle}>
            Quick Actions
          </h3>

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
            onClick={() => router.push("/admin/subcategories/add")}
          >
            ➕ Add Subcategory
          </button>

          <button
            style={styles.quickBtn}
            onClick={() => router.push("/admin/policies")}
          >
            ➕ Edit Policies
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

      <div style={styles.icon}>
        {icon}
      </div>

      <div>
        <div style={styles.statValue}>
          {value}
        </div>

        <div style={styles.statLabel}>
          {label}
        </div>
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
    alignItems: "center"
  },

  menu: {
    fontSize: 18,
    fontWeight: 700
  },

  backBtn: {
    background: "#fff",
    color: "#0B5ED7",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 600
  },

  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh"
  },

  title: {
    fontSize: 22,
    fontWeight: 700
  },

  sub: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 14,
    marginBottom: 20
  },

  stat: {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
    cursor: "pointer",
    border: "1px solid #e5e7eb"
  },

  icon: {
    fontSize: 22,
    color: "#0B5ED7"
  },

  statValue: {
    fontSize: 18,
    fontWeight: 700
  },

  statLabel: {
    fontSize: 13,
    color: "#6b7280"
  },

  quickWrap: {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    border: "1px solid #e5e7eb"
  },

  quickTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10
  },

  quickBtn: {
    width: "100%",
    padding: 12,
    marginTop: 8,
    borderRadius: 10,
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 600
  }

};
