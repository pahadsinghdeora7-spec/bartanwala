import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddProduct() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    price: "",
    size: "",
    gauge: "",
    weight: "",
    description: "",
    in_stock: true,
  });

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name")
      .order("name")
      .then(({ data }) => setCategories(data || []));
  }, []);

  /* ================= HELPERS ================= */
  const makeSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" ? { slug: makeSlug(value) } : {}),
    }));
  };

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.price) {
      alert("Required fields fill karo");
      return;
    }

    try {
      setLoading(true);

      /* INSERT PRODUCT (ONLY EXISTING COLUMNS) */
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          name: form.name,
          slug: form.slug,
          category_id: form.category_id,
          price: Number(form.price),
          size: form.size,
          gauge: form.gauge,
          weight: form.weight,
          description: form.description,
          in_stock: form.in_stock,
        })
        .select()
        .single();

      if (error) throw error;

      /* UPLOAD IMAGES */
      let imageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const filePath = `products/${product.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        imageUrls.push(data.publicUrl);
      }

      /* UPDATE IMAGE FIELDS */
      if (imageUrls.length) {
        await supabase
          .from("products")
          .update({
            image: imageUrls[0] || null,
            image1: imageUrls[1] || null,
            image2: imageUrls[2] || null,
            image3: imageUrls[3] || null,
          })
          .eq("id", product.id);
      }

      alert("✅ Product Added Successfully");
      router.push("/admin");

    } catch (err) {
      console.error(err);
      alert(err.message || "Error aaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Product | Bartanwala</title>
      </Head>

      <div style={styles.container}>
        <h2 style={styles.heading}>Add New Product</h2>

        <div style={styles.card}>
          <label style={styles.label}>Product Name *</label>
          <input style={styles.input} name="name" onChange={handleChange} />

          <label style={styles.label}>Slug</label>
          <input style={styles.input} value={form.slug} disabled />

          <label style={styles.label}>Category *</label>
          <select
            style={styles.input}
            value={form.category_id}
            onChange={(e) =>
              setForm((p) => ({ ...p, category_id: e.target.value }))
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Price *</label>
              <input style={styles.input} name="price" onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Size</label>
              <input style={styles.input} name="size" onChange={handleChange} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Gauge</label>
              <input style={styles.input} name="gauge" onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Weight</label>
              <input style={styles.input} name="weight" onChange={handleChange} />
            </div>
          </div>

          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            name="description"
            onChange={handleChange}
          />

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="in_stock"
              checked={form.in_stock}
              onChange={handleChange}
            />
            In Stock
          </label>

          <input type="file" multiple onChange={handleImages} />

          <button
            style={styles.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "➕ Add Product"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    marginTop: 12,
    display: "block",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },
  row: {
    display: "flex",
    gap: 10,
  },
  checkbox: {
    display: "flex",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
    fontSize: 14,
  },
  button: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
  },
};
