import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

/* ================= SERVER ================= */

export async function getServerSideProps() {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      image
    `)
    .order("id", { ascending: true });

  if (error) {
    console.log("CATEGORY ERROR:", error);
  }

  return {
    props: {
      categories: categories || [],
    },
  };
}

/* ================= PAGE ================= */

export default function CategoriesPage({ categories }) {

  return (
    <>
      <Head>
        <title>All Categories | Bartanwala</title>
      </Head>

      <div style={styles.page}>

        <h1 style={styles.title}>
          All Categories
        </h1>

        {/* EMPTY STATE */}
        {categories.length === 0 && (
          <div style={styles.empty}>
            No categories found
          </div>
        )}

        {/* CATEGORY GRID */}
        <div style={styles.grid}>

          {categories.map((cat) => (

            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              style={styles.card}
            >

              {/* IMAGE */}
              <div style={styles.imageWrap}>
                <img
                  src={cat.image || "/placeholder.png"}
                  alt={cat.name}
                  style={styles.image}
                />
              </div>

              {/* NAME */}
              <div style={styles.name}>
                {cat.name}
              </div>

            </Link>

          ))}

        </div>

      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {

  page: {
    padding: "20px 16px 100px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 18,
  },

  empty: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  },

  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 14,
    textAlign: "center",
    textDecoration: "none",
    color: "#111",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    transition: "all 0.2s ease",
  },

  imageWrap: {
    width: "100%",
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
  },

};
