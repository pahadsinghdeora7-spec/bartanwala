import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  /* 🔹 CATEGORY */
  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category || catError) {
    return { notFound: true };
  }

  /* 🔹 PRODUCTS */
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, price_unit, image")
    .eq("category_id", category.id)
    .eq("in_stock", true)
    .order("id", { ascending: false });

  return {
    props: {
      category,
      products: products || [],
    },
  };
}

/* ================= PAGE ================= */

export default function CategoryPage({ category, products }) {
  return (
    <>
      <Head>
        <title>{category.name} | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <h1 style={styles.title}>{category.name}</h1>

        {products.length === 0 && (
          <div style={styles.empty}>
            No products found in this category.
          </div>
        )}

        <div style={styles.grid}>
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              style={styles.card}
            >
              <img
                src={p.image || "/placeholder.png"}
                style={styles.image}
              />
              <div style={styles.name}>{p.name}</div>
              <div style={styles.price}>
                ₹{p.price}/{p.price_unit}
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
    background: "#fff",
    padding: 12,
    borderRadius: 14,
    textDecoration: "none",
    color: "#111",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },

  image: {
    width: "100%",
    height: 120,
    objectFit: "contain",
    marginBottom: 8,
  },

  name: {
    fontSize: 13,
    fontWeight: 600,
  },

  price: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0B5ED7",
    marginTop: 4,
  },
};
