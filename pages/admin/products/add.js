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
    price_unit: "kg",
    unit_type: "kg",
    description: "",
    in_stock: true,
  });

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name")
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
    setImages([...e.target.files]); // 📸 gallery se select
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.price || images.length === 0) {
      alert("All required fields fill karo");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ INSERT PRODUCT */
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          ...form,
          price: Number(form.price),
        })
        .select()
        .single();

      if (error) throw error;

      /* 2️⃣ UPLOAD IMAGES */
      const uploaded = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = `products/${product.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(path);

        uploaded.push({
          product_id: product.id,
          image_url: data.publicUrl,
          position: i + 1,
        });
      }

      /* 3️⃣ SAVE IMAGE URLS */
      await supabase.from("product_images").insert(uploaded);

      alert("✅ Product Added Successfully");
      router.push("/admin");

    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Product | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <h2>Add New Product</h2>

        <input
          style={styles.input}
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          placeholder="Slug"
          value={form.slug}
          disabled
        />

        <select
          style={styles.input}
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <textarea
          style={{ ...styles.input, height: 90 }}
          name="description"
          placeholder="Description"
          value={form.description}
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

        <input
          style={styles.input}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
        />

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  checkbox: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#0B5ED7",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
  },
};
