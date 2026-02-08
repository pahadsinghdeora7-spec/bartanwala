import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import { supabase } from "../../../lib/supabase";

export default function CategoryList() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        slug,
        subcategories ( id )
      `)
      .order("name");

    setCategories(data || []);
    setLoading(false);
  };

  const deleteCategory = async (id) => {
    if (!confirm("Category delete karni hai? Sub categories bhi delete ho jayengi.")) {
      return;
    }

    await supabase.from("categories").delete().eq("id", id);
    loadCategories();
  };

  return (
    <AdminLayout>
      <Head>
        <title>Categories | Admin</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.top}>
          <h2>Categories</h2>
          <button
            style={styles.addBtn}
            onClick={() => router.push("/admin/categories/add")}
          >
            ➕ Add Category
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && categories.length === 0 && (
          <p>No categories found</p>
        )}

        <div style={styles.list}>
          {categories.map((c) => (
            <div key={c.id} style={styles.card}>
              <div>
                <div style={styles.name}>{c.name}</div>
                <div style={styles.meta}>
                  Slug: {c.slug} <br />
                  Sub Categories: {c.subcategories?.length || 0}
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.edit}
                  onClick={() =>
                    router.push(`/admin/categories/edit/${c.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  style={styles.delete}
                  onClick={() => deleteCategory(c.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  addBtn: {
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    fontWeight: 600,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e5e7eb",
  },

  name: {
    fontSize: 16,
    fontWeight: 700,
  },

  meta: {
    fontSize: 12,
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
