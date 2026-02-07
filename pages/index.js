import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

/* SUPABASE */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, price_unit, image")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      setProducts(data || []);
    }
    loadProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Steel & Aluminium Utensils</title>
      </Head>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Wholesale Steel & Aluminium Utensils
        </h1>
        <p style={styles.heroSub}>
          B2B Wholesale · Factory Price · All India Delivery
        </p>
      </section>

      {/* PRODUCTS */}
      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={styles.card}>
                <div style={styles.imageWrap}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}
                </div>

                <h3 style={styles.name}>{p.name}</h3>

                <div style={styles.priceRow}>
                  <span style={styles.price}>₹ {p.price}</span>
                  <span style={styles.unit}>/ {p.price_unit}</span>
                </div>

                <span style={styles.badge}>Bulk Available</span>

                <button
                  style={styles.addToCart}
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Added to cart");
                  }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

/* STYLES */
const styles = {
  hero: {
    background: "#f2f6ff",
    padding: "32px 16px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: "#555",
  },
  main: {
    padding: 16,
    paddingBottom: 80, // bottom nav space
  },
  heading: {
    fontSize: 20,
    marginBottom: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // mobile 2 cards
    gap: 14,
  },
  card: {
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: 10,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  imageWrap: {
    height: 120,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  noImage: {
    height: "100%",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    color: "#999",
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  price: {
    color: "#0B5ED7",
    fontWeight: 700,
    fontSize: 15,
  },
  unit: {
    fontSize: 12,
    color: "#555",
  },
  badge: {
    fontSize: 11,
    color: "#065f46",
    background: "#d1fae5",
    padding: "2px 6px",
    borderRadius: 6,
    width: "fit-content",
    marginBottom: 8,
  },
  addToCart: {
    marginTop: "auto",
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
