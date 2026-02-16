import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminLayout from "../../components/admin/AdminLayout";

export default function Dashboard() {

  const router = useRouter();

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    subcategories: 0,
    customers: 0,
    orders: 0,
    pending: 0,
    cancelled: 0,
    delivered: 0,
    revenue: 0
  });


  /* ================= LOAD STATS ================= */

  useEffect(() => {
    loadStats();
  }, []);


  async function loadStats() {

    try {

      /* PRODUCTS COUNT */
      const { count: products } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });


      /* CATEGORIES COUNT */
      const { count: categories } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });


      /* SUBCATEGORIES COUNT */
      const { count: subcategories } = await supabase
        .from("subcategories")
        .select("*", { count: "exact", head: true });


      /* CUSTOMERS COUNT */
      const { count: customers } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });


      /* ORDERS DATA */
      const { data: orders } = await supabase
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

    } catch (err) {

      console.log(err);

    }

  }



  return (

    <AdminLayout>

      <Head>
        <title>Admin Dashboard | Bartanwala</title>
      </Head>


      <h1 style={styles.title}>Admin Dashboard</h1>


      {/* ================= STATS CARDS ================= */}

      <div style={styles.statsGrid}>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.orders}</div>
          <div style={styles.statLabel}>Total Orders</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending Orders</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.cancelled}</div>
          <div style={styles.statLabel}>Cancelled Orders</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.delivered}</div>
          <div style={styles.statLabel}>Delivered Orders</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>₹ {stats.revenue}</div>
          <div style={styles.statLabel}>Total Revenue</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.subcategories}</div>
          <div style={styles.statLabel}>Sub Categories</div>
        </div>

      </div>



      {/* ================= MAIN CARDS ================= */}

      <div style={styles.grid}>
        
        {/* PRODUCTS */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/products")}
        >
          <div style={styles.icon}>📦</div>
          <div style={styles.label}>Products</div>
          <div style={styles.sub}>
            Total: {stats.products}
          </div>
        </div>


        {/* CATEGORIES */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/categories")}
        >
          <div style={styles.icon}>🗂️</div>
          <div style={styles.label}>Categories</div>
          <div style={styles.sub}>
            Total: {stats.categories}
          </div>
        </div>


        {/* ORDERS */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/orders")}
        >
          <div style={styles.icon}>🧾</div>
          <div style={styles.label}>Orders</div>
          <div style={styles.sub}>
            Total: {stats.orders}
          </div>
        </div>


        {/* CUSTOMERS */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/customers")}
        >
          <div style={styles.icon}>👤</div>
          <div style={styles.label}>Customers</div>
          <div style={styles.sub}>
            Total: {stats.customers}
          </div>
        </div>


        {/* DELIVERY */}
        <div
          style={styles.card}
          onClick={() => router.push("/admin/delivery")}
        >
          <div style={styles.icon}>🚚</div>
          <div style={styles.label}>Delivery</div>
          <div style={styles.sub}>
            Shipping & Tracking
          </div>
        </div>

      </div>


    </AdminLayout>

  );

}



/* ================= STYLES ================= */

const styles = {

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 16
  },


  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 20
  },


  statCard: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #e5e7eb"
  },


  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0B5ED7"
  },


  statLabel: {
    fontSize: 12,
    color: "#6b7280"
  },


  grid: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16
  },


  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
    textAlign: "center",
    cursor: "pointer"
  },


  icon: {
    fontSize: 28,
    marginBottom: 8
  },


  label: {
    fontSize: 16,
    fontWeight: 700
  },


  sub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6
  }

};
