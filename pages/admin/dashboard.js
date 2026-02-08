import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Bartanwala</title>
      </Head>

      <h1>Admin Dashboard</h1>

      <div style={{ marginTop: 20 }}>
        <div>📦 Products</div>
        <div>🧾 Orders</div>
        <div>🚚 Delivery</div>
        <div>👤 Customers</div>
      </div>
    </AdminLayout>
  );
}
