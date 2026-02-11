import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../../../lib/supabase";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newImage, setNewImage] = useState(null);

  /* ================= LOAD PRODUCTS ================= */

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select(`
        *,
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
    if (!confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  };

  /* ================= EDIT ================= */

  const openEdit = (p) => {
    setEditForm({ ...p });
    setNewImage(null);
    setEditOpen(true);
  };

  const updateProduct = async () => {
    try {
      /* Update basic fields */
      await supabase
        .from("products")
        .update({
          name: editForm.name,
          price: Number(editForm.price),
          size: editForm.size,
          gauge: editForm.gauge,
          weight: editForm.weight,
          description: editForm.description,
          category_id: editForm.category_id,
          subcategory_id: editForm.subcategory_id || null,
          in_stock: editForm.in_stock,
        })
        .eq("id", editForm.id);

      /* If new image selected */
      if (newImage) {
        const fileName = `${editForm.id}-${Date.now()}-${newImage.name}`;

        await supabase.storage
          .from("products")
          .upload(fileName, newImage);

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        await supabase
          .from("products")
          .update({ image: data.publicUrl })
          .eq("id", editForm.id);
      }

      alert("✅ Product updated");
      setEditOpen(false);
      loadProducts();
    } catch (err) {
      alert(err.message);
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
            <div style={{ display: "flex", gap: 10 }}>
              {p.image && (
                <img
                  src={p.image}
                  alt=""
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                />
              )}
              <div>
                <strong>{p.name}</strong>
                <div style={styles.meta}>
                  ₹{p.price} <br />
                  {p.categories?.name || "-"} <br />
                  {p.subcategories?.name || "-"}
                </div>
              </div>
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

            {editForm.image && (
              <img
                src={editForm.image}
                alt=""
                style={{ width: "100%", borderRadius: 8, marginBottom: 10 }}
              />
            )}

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

            <input
              style={styles.input}
              value={editForm.size || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, size: e.target.value })
              }
              placeholder="Size"
            />

            <input
              style={styles.input}
              value={editForm.gauge || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, gauge: e.target.value })
              }
              placeholder="Gauge"
            />

            <input
              style={styles.input}
              value={editForm.weight || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, weight: e.target.value })
              }
              placeholder="Weight"
            />

            <textarea
              style={styles.input}
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Description"
            />

            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              style={{ marginTop: 10 }}
            />

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
  page: { padding: 16, background: "#f5f6f8", minHeight: "100vh" },
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
    width: "95%",
    maxWidth: 450,
    maxHeight: "90vh",
    overflowY: "auto",
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
  modalActions: { display: "flex", gap: 10, marginTop: 14 },
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
