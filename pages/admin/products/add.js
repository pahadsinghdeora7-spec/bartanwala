import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";

export default function AddProduct() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    category_slug: "",
    subcategory_id: "",
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
      .select("id, name, slug")
      .order("name")
      .then(({ data }) => setCategories(data || []));
  }, []);

  /* ================= HELPERS ================= */
  const makeSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" ? { slug: makeSlug(value) } : {}),
    }));
  };

  /* ================= CATEGORY CHANGE ================= */
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    const cat = categories.find((c) => c.id == categoryId);

    setForm((p) => ({
      ...p,
      category_id: categoryId,
      category_slug: cat ? cat.slug : "",
      subcategory_id: "",
    }));

    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    const { data } = await supabase
      .from("subcategories")
      .select("id, name")
      .eq("category_id", categoryId)
      .order("name");

    setSubcategories(data || []);
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

      /* 1️⃣ INSERT PRODUCT FIRST */
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          name: form.name,
          slug: form.slug,
          category_id: form.category_id,
          category_slug: form.category_slug,
          subcategory_id: form.subcategory_id || null,
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

      /* 2️⃣ IMAGE UPLOAD (BUCKET = products) */
      if (images.length > 0) {
        const file = images[0]; // first image only
        const fileName = `${product.id}-${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("products") // ✅ CORRECT BUCKET
          .upload(fileName, file);

        if (uploadError) {
          console.log(uploadError);
        } else {
          const { data } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

          /* 3️⃣ SAVE IMAGE URL IN PRODUCTS TABLE */
          await supabase
            .from("products")
            .update({ image: data.publicUrl })
            .eq("id", product.id);
        }
      }

      alert("✅ Product added successfully");
      router.push("/admin/products");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Product | Admin</title>
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
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label style={styles.label}>Price *</label>
          <input style={styles.input} name="price" onChange={handleChange} />

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

          <input type="file" onChange={handleImages} />

          <button
            style={styles.button}
            disabled={loading}
            onClick={handleSubmit}
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
    maxWidth: 600,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    display: "block",
    marginTop: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 4,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
    marginTop: 4,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },
  checkbox: {
    marginTop: 10,
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  button: {
    marginTop: 14,
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#0B5ED7",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
  },
};
