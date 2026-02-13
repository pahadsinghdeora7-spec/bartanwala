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

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return { notFound: true };

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      price_unit,
      image,
      size,
      gauge,
      subcategories(name)
    `)
    .eq("category_id", category.id)
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

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
            <div key={p.id} style={styles.card}>

              <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                <div style={styles.imageSection}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}
                </div>
              </Link>

              <div style={styles.detailsSection}>
                <div style={styles.name}>{p.name}</div>

                <div style={styles.metaRow}>
                  {p.size && <span>Size: {p.size}</span>}
                  {p.gauge && <span>Gauge: {p.gauge}</span>}
                </div>

                {p.subcategories?.name && (
                  <div style={styles.subcategory}>
                    {p.subcategories.name}
                  </div>
                )}

                <div style={styles.price}>
                  ₹ {p.price}
                  {p.price_unit && (
                    <span style={styles.unit}>
                      {" "} / {p.price_unit.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

            </div>
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
    gap: 16,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    height: 380,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  imageSection: {
    height: 150,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  noImage: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  detailsSection: {
    flex: 1,
    padding: 14,
    display: "flex",
    flexDirection: "column",
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
    minHeight: 40,
  },

  metaRow: {
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },

  subcategory: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },

  price: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0B5ED7",
    marginTop: "auto",
  },

  unit: {
    fontSize: 12,
    color: "#6b7280",
  },
};
