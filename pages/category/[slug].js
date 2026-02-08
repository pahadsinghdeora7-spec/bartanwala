import Head from "next/head";
import Link from "next/link";
import { getSupabase } from "../../lib/supabase";
import { FaRupeeSign } from "react-icons/fa";

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  /* 1️⃣ MAIN CATEGORY */
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", params.slug)
    .single();

  if (!category) {
    return { notFound: true };
  }

  /* 2️⃣ SUBCATEGORIES */
  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("id, name, slug")
    .eq("category_id", category.id)
    .order("name");

  /* 3️⃣ PRODUCTS (category + in_stock) */
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      price_unit,
      image,
      subcategory_id
    `)
    .eq("category_id", category.id)
    .eq("in_stock", true)
    .order("id", { ascending: false });

  return {
    props: {
      category,
      subcategories: subcategories || [],
      products: products || [],
    },
  };
}

export default function CategoryPage({ category, subcategories, products }) {
  return (
    <>
      <Head>
        <title>{category.name} | Bartanwala</title>
        <meta
          name="description"
          content={
            category.description ||
            `Wholesale ${category.name} at best price. All India delivery.`
          }
        />
      </Head>

      <main style={styles.page}>
        {/* TITLE */}
        <h1 style={styles.title}>{category.name}</h1>

        {/* SUB CATEGORIES */}
        {subcategories.length > 0 && (
          <div style={styles.subWrap}>
            {subcategories.map((s) => (
              <Link
                key={s.id}
                href={`/category/${category.slug}/${s.slug}`}
                style={styles.subItem}
              >
                {s.name}
              </Link>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {products.length === 0 && (
          <p style={styles.empty}>
            Is category me abhi products available nahi hain.
          </p>
        )}

        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.imgWrap}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={styles.img}
                  />
                ) : (
                  <div style={styles.noImg}>No Image</div>
                )}
              </div>

              <h3 style={styles.name}>{p.name}</h3>

              <div style={styles.price}>
                <FaRupeeSign size={12} />
                <strong>{p.price}</strong> / {p.price_unit}
              </div>

              <Link href={`/product/${p.slug}`} style={styles.link}>
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f9fafb",
    minHeight: "100vh",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },

  subWrap: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    marginBottom: 16,
  },

  subItem: {
    padding: "6px 14px",
    borderRadius: 20,
    background: "#e5e7eb",
    fontSize: 13,
    whiteSpace: "nowrap",
    textDecoration: "none",
    color: "#111",
    fontWeight: 500,
  },

  empty: {
    color: "#6B7280",
    marginTop: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
    marginTop: 16,
  },

  card: {
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: 10,
    background: "#fff",
  },

  imgWrap: {
    height: 130,
    marginBottom: 6,
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  noImg: {
    height: "100%",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9CA3AF",
    fontSize: 12,
  },

  name: {
    fontSize: 14,
    margin: "6px 0",
  },

  price: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "#0B5ED7",
    fontSize: 14,
  },

  link: {
    display: "inline-block",
    marginTop: 6,
    fontSize: 13,
    color: "#0B5ED7",
    fontWeight: 600,
    textDecoration: "none",
  },
};
