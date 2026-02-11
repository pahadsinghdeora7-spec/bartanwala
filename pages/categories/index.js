import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: true });

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>All Categories</h2>

      <div style={styles.grid}>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>
            <div style={styles.card}>
              <img
                src={cat.image || "/placeholder.png"}
                style={styles.image}
                alt={cat.name}
              />
              <div style={styles.name}>{cat.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 14,
    textAlign: "center",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    height: 120,
    objectFit: "contain",
    marginBottom: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
  },
};
