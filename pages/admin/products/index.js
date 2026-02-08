import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../../../lib/supabase";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  /* ================= LOAD DATA ================= */

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        in_stock,
        category_id,
        subcategory_id,
        categories(name),
        subcategories(name)
      `)
      .order("id", { ascending: false });

    setProducts(data || []);
  };

  useEffect(() => {
    loadProducts();

    supabase.from("categories").select("id, name").then(({ data }) => {
      setCategories(data || []);
    });

    supabase.from("subcategories").select("id, name, category_id").then(({ data }) => {
      setSubcategories(data || []);
    });
  }, []);

  /* ================= DELETE ================= */

  const deleteProduct = async (id) => {
    if (!confirm("Product delete karna sure hai?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (!error) {
      alert("✅ Product deleted");
      loadProducts();
    }
  };

  /* ================= EDIT ================= */

  const openEdit = (p) => {
    setEditForm({ ...p });
    setEditOpen(true);
  };

  const updateProduct = async () => {
    const { error } = await supabase
      .from("products")
      .update({
        name: editForm.name,
        price: Number(editForm.price),
        category_id: editForm.category_id,
        subcategory_id: editForm.subcategory_id || null,
        in_stock: editForm.in_stock,
      })
      .eq("id", editForm.id);

    if (!error) {
      alert("✅ Product updated");
      setEditOpen(false);
      loadProducts();
    }
  };

  const filteredSubcats = subcategories.filter(
    (s) => s.category_id === editForm?.category_id
  );

  return (
    <>
      <Head>
        <title>Products | Admin</title>
      </Head>

      <div style={styles.page}>
        <h2 style={styles.title}>Products</h2>

        {products.map((p) => (
          <div key={p.id} style={styles.row}>
            <div>
              <strong>{p.name}</strong>
              <div style={styles.meta}>
                Category: {p.categories?.name || "-"} <br />
                Sub: {p.subcategories?.name || "-"} <br />
                Price: ₹{p.price}
              </div>
              <span
                style={{
                  color: p.in_stock ? "green" : "red",
                  fontSize: 12,
                }}
              >
                {p.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div style={styles.actions}>
              <button style={styles.edit} onClick={() => openEdit(p)}>
                Edit
              </button>
              <button style={styles.delete} onClick={() => deleteProduct(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Product</h3>

            <input
              style={styles.input}
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              placeholder="Product Name"
            />

            <input
              style={styles.input}
              value={editForm.price}
              onChange={(e) =>
                setEditForm({ ...editForm, price: e.target.value })
              }
              placeholder="Price"
            />

            <select
              style={styles.input}
              value={editForm.category_id}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  category_id: Number(e.target.value),
                  subcategory_id: null,
                })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {filteredSubcats.length > 0 && (
              <select
                style={styles.input}
                value={editForm.subcategory_id || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    subcategory_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Select Sub Category</option>
                {filteredSubcats.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            <label style={styles.check}>
              <input
                type="checkbox"
                checked={editForm.in_stock}
                onChange={(e) =>
                  setEditForm({ ...editForm, in_stock: e.target.checked })
                }
              />
              In Stock
            </label>

            <div style={styles.modalActions}>
              <button style={styles.save} onClick={updateProduct}>
                Save
              </button>
              <button
                style={styles.cancel}
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 12 },

  row: {
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #e5e7eb",
  },
  meta: { fontSize: 13, color: "#6b7280", marginTop: 4 },

  actions: { display: "flex", gap: 8 },
  edit: {
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    padding: "6px 12px",
    borderRadius: 6,
  },
  delete: {
    border: "1px solid #dc2626",
    background: "#fff",
    color: "#dc2626",
    padding: "6px 12px",
    borderRadius: 6,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },
  check: {
    marginTop: 10,
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  modalActions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },
  save: {
    flex: 1,
    padding: 10,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  cancel: {
    flex: 1,
    padding: 10,
    background: "#e5e7eb",
    border: "none",
    borderRadius: 8,
  },
};
