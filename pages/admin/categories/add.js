import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";

export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

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
    if (!form.name) {
      alert("Category name required");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("categories").insert({
        name: form.name,
        slug: form.slug,
        description: form.description,
      });

      if (error) throw error;

      alert("✅ Category added");
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
        <title>Add Category | Admin</title>
      </Head>

      <div style={styles.container}>
        <h2>Add Main Category</h2>

        <div style={styles.card}>
          <label>Name *</label>
          <input style={styles.input} name="name" onChange={handleChange} />

          <label>Slug</label>
          <input style={styles.input} value={form.slug} disabled />

          <label>Description</label>
          <textarea
            style={styles.textarea}
            name="description"
            onChange={handleChange}
          />

          <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
            {loading ? "Saving..." : "➕ Add Category"}
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
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
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
