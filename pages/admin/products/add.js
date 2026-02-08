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
    category_slug: "",
    price: "",
    price_unit: "pcs",
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
      .select("id, slug, name")
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

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" ? { slug: makeSlug(value) } : {}),
    }));
  };

  const handleImages = (e) => {
    setImages([...e.target.files]); // 📱 gallery se select
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.price) {
      alert("Required fields missing");
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
          search_text: `${form.name} ${form.size} ${form.gauge}`,
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

        uploaded.push(data.publicUrl);
      }

      /* 3️⃣ UPDATE IMAGE COLUMNS */
      await supabase
        .from("products")
        .update({
          image: uploaded[0] || null,
          image1: uploaded[1] || null,
          image2: uploaded[2] || null,
          image3: uploaded[3] || null,
        })
        .eq("id", product.id);

      alert("✅ Product added successfully");
      router.push("/admin/products");

    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Product | Admin</title>
      </Head>

      <div style={{ padding: 16 }}>
        <h2>Add New Product</h2>

        <input name="name" placeholder="Product name" onChange={handleChange} />
        <input name="slug" value={form.slug} disabled />

        <select
          name="category_id"
          onChange={(e) => {
            const cat = categories.find((c) => c.id == e.target.value);
            setForm((p) => ({
              ...p,
              category_id: cat.id,
              category_slug: cat.slug,
            }));
          }}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="size" placeholder="Size" onChange={handleChange} />
        <input name="gauge" placeholder="Gauge" onChange={handleChange} />
        <input name="weight" placeholder="Weight" onChange={handleChange} />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="in_stock"
            checked={form.in_stock}
            onChange={handleChange}
          />{" "}
          In Stock
        </label>

        <input type="file" multiple onChange={handleImages} />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>
    </>
  );
                          }
