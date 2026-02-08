import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        in_stock,
        categories(name),
        subcategories(name)
      `)
      .order("id", { ascending: false });

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Product delete karna sure ho?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (!error) {
      alert("✅ Product deleted");
      loadProducts();
    } else {
      alert(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Products | Admin</title>
      </Head>

      <div style={styles.page}>
        <h2 style={styles.title}>Products</h2>

        {loading && <p>Loading...</p>}

        {!loading && products.length === 0 && (
          <p>No products found</p>
        )}

        <div style={styles.list}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>
              <div>
                <strong>{p.name}</strong>
                <div style={styles.meta}>
                  ₹{p.price} | {p.categories?.name || "-"}{" "}
                  {p.subcategories?.name && `→ ${p.subcategories.name}`}
                </div>
                <div
                  style={{
                    color: p.in_stock ? "green" : "red",
                    fontSize: 12,
                  }}
                >
                  {p.in_stock ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.edit}
                  onClick={() =>
                    router.push(`/admin/products/edit/${p.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  style={styles.delete}
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ===== STYLES ===== */

const styles = {
  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e5e7eb",
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  edit: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 600,
  },
  delete: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #dc2626",
    background: "#fff",
    color: "#dc2626",
    fontWeight: 600,
  },
};
