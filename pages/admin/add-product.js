import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddProduct() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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

  const [images, setImages] = useState([]);

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
      .replace(/(^-|-$)/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      ...(name === "name" && { slug: makeSlug(value) }),
    }));
  };

  /* ================= IMAGE SELECT ================= */
  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.price || images.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ INSERT PRODUCT */
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          ...form,
          search_text: form.name,
        })
        .select()
        .single();

      if (error) throw error;

      /* 2️⃣ UPLOAD IMAGES */
      const uploadedImages = [];

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

        uploadedImages.push({
          product_id: product.id,
          image_url: data.publicUrl,
          position: i + 1,
        });
      }

      /* 3️⃣ SAVE IMAGE URLs */
      await supabase.from("product_images").insert(uploadedImages);

      alert("✅ Product added successfully");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Product | Admin</title>
      </Head>

      <div style={styles.page}>
        <h2>Add New Product</h2>

        <input
          placeholder="Product Name *"
          name="name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          placeholder="Slug"
          value={form.slug}
          disabled
          style={{ ...styles.input, background: "#f3f4f6" }}
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Category *</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div style={styles.row}>
          <input
            placeholder="Price *"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="price_unit"
            value={form.price_unit}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="kg">KG</option>
            <option value="pcs">PCS</option>
            <option value="set">SET</option>
          </select>
        </div>

        <textarea
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
        />

        <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </div>
    </>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    maxWidth: 520,
    margin: "auto",
    padding: 16,
    background: "#fff",
    borderRadius: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
  },
  textarea: {
    width: "100%",
    padding: 12,
    minHeight: 80,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    marginBottom: 12,
  },
  row: {
    display: "flex",
    gap: 10,
  },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#0B5ED7",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
  },
};
