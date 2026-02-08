import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";

export default function AddSubCategory() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
  });

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCategories(data || []));
  }, []);

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
      ...(name === "name" ? { slug: makeSlug(value) } : {}),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category_id) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("subcategories").insert({
        name: form.name,
        slug: form.slug,
        category_id: form.category_id,
      });

      if (error) throw error;

      alert("✅ Sub Category added");
      router.push("/admin");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Sub Category | Admin</title>
      </Head>

      <div style={styles.container}>
        <h2>Add Sub Category</h2>

        <div style={styles.card}>
          <label>Main Category *</label>
          <select
            style={styles.input}
            name="category_id"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Sub Category Name *</label>
          <input style={styles.input} name="name" onChange={handleChange} />

          <label>Slug</label>
          <input style={styles.input} value={form.slug} disabled />

          <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
            {loading ? "Saving..." : "➕ Add Sub Category"}
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { padding: 16 },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    maxWidth: 500,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  btn: {
    marginTop: 12,
    width: "100%",
    padding: 12,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
  },
};
