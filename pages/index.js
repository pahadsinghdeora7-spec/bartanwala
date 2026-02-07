import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FaRupeeSign, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

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
        <h1>Wholesale Steel & Aluminium Utensils</h1>
        <p>B2B Wholesale · Factory Price · All India Delivery</p>
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
                {/* IMAGE SECTION */}
                <div style={styles.imageSection}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}
                </div>

                {/* DETAILS SECTION */}
                <div style={styles.detailsSection}>
                  <h3 style={styles.name}>{p.name}</h3>

                  <div style={styles.priceRow}>
                    <FaRupeeSign size={12} />
                    <strong>{p.price}</strong>
                    <span>/ {p.price_unit}</span>
                  </div>

                  <div style={styles.badge}>
                    <FaBoxOpen size={12} /> Bulk Available
                  </div>
                </div>

                {/* BUTTON SECTION */}
                <div style={styles.actionSection}>
                  <button
                    style={styles.addToCart}
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Added to cart");
                    }}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
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
  main: {
    padding: 16,
    paddingBottom: 90, // bottom nav space
  },
  heading: {
    fontSize: 20,
    marginBottom: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // mobile: 2 cards
    gap: 14,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  /* IMAGE */
  imageSection: {
    height: 140,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  noImage: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  /* DETAILS */
  detailsSection: {
    padding: 10,
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
    color: "#0B5ED7",
    fontSize: 14,
  },
  badge: {
    marginTop: 6,
    fontSize: 11,
    background: "#E6F4EA",
    color: "#137333",
    padding: "3px 6px",
    borderRadius: 6,
    display: "inline-flex",
    gap: 4,
    alignItems: "center",
  },

  /* ACTION */
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
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
};
