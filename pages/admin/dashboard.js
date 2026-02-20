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

      const { count: products } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: categories } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      const { count: subcategories } = await supabase
        .from("subcategories")
        .select("*", { count: "exact", head: true });

      const { count: customers } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

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


      {/* ================= STATS ================= */}

      <div style={styles.statsGrid}>

        <StatCard label="Total Orders" value={stats.orders} />
        <StatCard label="Pending Orders" value={stats.pending} />
        <StatCard label="Cancelled Orders" value={stats.cancelled} />
        <StatCard label="Delivered Orders" value={stats.delivered} />
        <StatCard label="Total Revenue" value={`₹ ${stats.revenue}`} />
        <StatCard label="Sub Categories" value={stats.subcategories} />

      </div>



      {/* ================= MANAGEMENT ================= */}

      <div style={styles.grid}>


        {/* PRODUCTS */}
        <Card
          icon="📦"
          label="Products"
          sub={`Total: ${stats.products}`}
          onClick={() => router.push("/admin/products")}
        />


        {/* CATEGORIES */}
        <Card
          icon="🗂️"
          label="Categories"
          sub={`Total: ${stats.categories}`}
          onClick={() => router.push("/admin/categories")}
        />


        {/* SUBCATEGORIES */}
        <Card
          icon="📂"
          label="Sub Categories"
          sub={`Total: ${stats.subcategories}`}
          onClick={() => router.push("/admin/categories/add-sub")}
        />


        {/* ORDERS */}
        <Card
          icon="🧾"
          label="Orders"
          sub={`Total: ${stats.orders}`}
          onClick={() => router.push("/admin/orders")}
        />


        {/* CUSTOMERS */}
        <Card
          icon="👤"
          label="Customers"
          sub={`Total: ${stats.customers}`}
          onClick={() => router.push("/admin/customers")}
        />


        {/* BANNERS */}
        <Card
          icon="🖼️"
          label="Banner Management"
          sub="Upload & manage banners"
          onClick={() => router.push("/admin/banners")}
        />


        {/* POLICIES */}
        <Card
          icon="📄"
          label="Policy Management"
          sub="Edit website policies"
          onClick={() => router.push("/admin/policies")}
        />


      </div>


    </AdminLayout>

  );

}



/* ================= COMPONENTS ================= */

function StatCard({ label, value }) {

  return (

    <div style={styles.statCard}>

      <div style={styles.statValue}>{value}</div>

      <div style={styles.statLabel}>{label}</div>

    </div>

  );

}



function Card({ icon, label, sub, onClick }) {

  return (

    <div style={styles.card} onClick={onClick}>

      <div style={styles.icon}>{icon}</div>

      <div style={styles.label}>{label}</div>

      <div style={styles.sub}>{sub}</div>

    </div>

  );

}



/* ================= STYLES ================= */

const styles = {

  title:{
    fontSize:22,
    fontWeight:700,
    marginBottom:16
  },


  statsGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
    gap:12,
    marginBottom:20
  },


  statCard:{
    background:"#fff",
    padding:16,
    borderRadius:12,
    border:"1px solid #e5e7eb"
  },


  statValue:{
    fontSize:20,
    fontWeight:700,
    color:"#0B5ED7"
  },


  statLabel:{
    fontSize:12,
    color:"#6b7280"
  },


  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
    gap:16
  },


  card:{
    background:"#fff",
    border:"1px solid #e5e7eb",
    borderRadius:14,
    padding:20,
    textAlign:"center",
    cursor:"pointer"
  },


  icon:{
    fontSize:28,
    marginBottom:8
  },


  label:{
    fontSize:16,
    fontWeight:700
  },


  sub:{
    fontSize:12,
    color:"#6b7280",
    marginTop:6
  }

};
