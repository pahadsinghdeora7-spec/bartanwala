import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            image,
            size,
            gauge,
            subcategories(name)
          `)
          .eq("in_stock", true)
          .order("created_at", { ascending: false });

        if (!error) setProducts(data || []);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function addToCart(product) {
    if (typeof window === "undefined") return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);

    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
  }

  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Steel & Aluminium Utensils</title>
      </Head>

      {/* ================= HERO ================= */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Wholesale Steel & Aluminium Utensils
        </h1>
        <p style={styles.heroSub}>
          B2B Wholesale · Factory Price · All India Delivery
        </p>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section style={styles.categorySection}>
        <h2 style={styles.categoryHeading}>Shop By Category</h2>

        <div style={styles.categoryRow}>
          <Link href="/category/stainless-steel-utensils" style={styles.categoryCard}>
            <div style={styles.categoryTitle}>
              Stainless Steel Utensils
            </div>
          </Link>

          <Link href="/category/alluminium-utensils" style={styles.categoryCard}>
            <div style={styles.categoryTitle}>
              Alluminium Utensils
            </div>
          </Link>
        </div>

        <div style={styles.viewAllWrap}>
          <Link href="/categories" style={styles.viewAll}>
            View All Categories →
          </Link>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        {loading ? (
          <p style={{ fontSize: 13 }}>Loading products...</p>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => (
              <div key={p.id} style={styles.card}>
                <Link
                  href={`/product/${p.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={styles.imageSection}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={styles.image} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                  </div>

                  <div style={styles.detailsSection}>
                    <h3 style={styles.name}>{p.name}</h3>

                    {p.size && (
                      <div style={styles.meta}>Size: {p.size}</div>
                    )}

                    {p.gauge && (
                      <div style={styles.meta}>Gauge: {p.gauge}</div>
                    )}

                    {p.subcategories?.name && (
                      <div style={styles.meta}>
                        {p.subcategories.name}
                      </div>
                    )}
                  </div>
                </Link>

                <div style={styles.actionSection}>
                  <button
                    style={styles.addToCart}
                    onClick={() => addToCart(p)}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  hero: {
    background: "#f8fafc",
    padding: "26px 16px",
    textAlign: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    border: "1px solid #E5E7EB",
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 6,
  },

  heroSub: {
    fontSize: 13,
    color: "#6b7280",
  },

  categorySection: {
    padding: 12,
    background: "#ffffff",
  },

  categoryHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
  },

  categoryRow: {
    display: "flex",
    gap: 10,
  },

  categoryCard: {
    flex: 1,
    padding: 14,
    background: "#f8fafc",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    textDecoration: "none",
    color: "#111",
    textAlign: "center",
  },

  categoryTitle: {
    fontSize: 14,
    fontWeight: 600,
  },

  viewAllWrap: {
    marginTop: 8,
    textAlign: "right",
  },

  viewAll: {
    fontSize: 12,
    fontWeight: 600,
    color: "#0B5ED7",
    textDecoration: "none",
  },

  main: {
    padding: 12,
    paddingBottom: 90,
  },

  heading: {
    fontSize: 16,
    marginBottom: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  imageSection: {
    height: 150,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  noImage: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  detailsSection: {
    padding: 10,
    textAlign: "center",
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    minHeight: 38,
  },

  meta: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 3,
  },

  actionSection: {
    padding: 10,
    borderTop: "1px solid #E5E7EB",
  },

  addToCart: {
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
};
