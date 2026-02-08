import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { FaPlus, FaImage, FaSave } from "react-icons/fa";

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    category_slug: "",
    size: "",
    gauge: "",
    weight: "",
    price: "",
    price_unit: "kg",
    description: "",
  });

  const [images, setImages] = useState([]);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug")
      .then(({ data }) => setCategories(data || []));
  }, []);

  /* ================= HELPERS ================= */

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file) => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${ext}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.price) {
      alert("Name, Category & Price required");
      return;
    }

    try {
      setLoading(true);

      const uploadedUrls = [];
      for (let file of images.slice(0, 4)) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      const slug = slugify(form.name);
      const search_text = `${form.name} ${form.size} ${form.gauge} ${form.weight}`;

      const { error } = await supabase.from("products").insert({
        ...form,
        slug,
        search_text,
        image: uploadedUrls[0] || null,
        image1: uploadedUrls[1] || null,
        image2: uploadedUrls[2] || null,
        image3: uploadedUrls[3] || null,
      });

      if (error) throw error;

      alert("✅ Product added successfully");
      router.push("/admin");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Head>
        <title>Add Product | Admin</title>
      </Head>

      <div style={styles.page}>
        <h1 style={styles.title}>➕ Add New Product</h1>

        <div style={styles.card}>
          <input
            placeholder="Product Name *"
            name="name"
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="category_id"
            onChange={(e) => {
              const cat = categories.find(
                (c) => c.id == e.target.value
              );
              setForm({
                ...form,
                category_id: cat.id,
                category_slug: cat.slug,
              });
            }}
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
              placeholder="Size"
              name="size"
              onChange={handleChange}
              style={styles.input}
            />
            <input
              placeholder="Gauge"
              name="gauge"
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <input
            placeholder="Weight"
            name="weight"
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.row}>
            <input
              type="number"
              placeholder="Price *"
              name="price"
              onChange={handleChange}
              style={styles.input}
            />
            <select
              name="price_unit"
              onChange={handleChange}
              style={styles.input}
            >
              <option value="kg">per KG</option>
              <option value="pcs">per PCS</option>
              <option value="set">per SET</option>
            </select>
          </div>

          <textarea
            placeholder="Product Description"
            name="description"
            rows={4}
            onChange={handleChange}
            style={styles.textarea}
          />

          {/* IMAGE PICKER */}
          <label style={styles.imageBox}>
            <FaImage /> Select Images (max 4)
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => setImages([...e.target.files])}
            />
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={styles.btn}
          >
            <FaSave /> {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
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
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 16,
  },
  row: {
    display: "flex",
    gap: 10,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    marginBottom: 12,
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    marginBottom: 12,
  },
  imageBox: {
    border: "1px dashed #9ca3af",
    padding: 14,
    borderRadius: 12,
    textAlign: "center",
    cursor: "pointer",
    marginBottom: 14,
  },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    fontWeight: 700,
  },
};
