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

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

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

      {/* MAIN CATEGORIES */}
      <section style={styles.categorySection}>
        <h2 style={styles.categoryHeading}>Shop By Category</h2>

        <div style={styles.categoryRow}>
          <Link
            href="/category/stainless-steel-utensils"
            style={styles.categoryCard}
          >
            <div style={styles.categoryTitle}>
              Stainless Steel Utensils
            </div>
            <div style={styles.categorySub}>
              Heavy Quality · Bulk Supply
            </div>
          </Link>

          <Link
            href="/category/aluminium-utensils"
            style={styles.categoryCard}
          >
            <div style={styles.categoryTitle}>
              Aluminium Utensils
            </div>
            <div style={styles.categorySub}>
              Factory Price · Wholesale
            </div>
          </Link>
        </div>

        <div style={styles.viewAllWrap}>
          <Link href="/categories" style={styles.viewAll}>
            View All Categories →
          </Link>
        </div>
      </section>

      {/* PRODUCTS */}
      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>
              <Link
                href={`/product/${p.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div>
                  <div style={styles.imageSection}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={styles.image} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                  </div>

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
      </main>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  hero: {
    background: "#f2f6ff",
    padding: "20px 12px",
    textAlign: "center",
  },

  /* CATEGORY */
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
    padding: 12,
    background: "#f8fafc",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    textDecoration: "none",
    color: "#111",
  },

  categoryTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
  },

  categorySub: {
    fontSize: 11,
    color: "#6b7280",
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

  /* MAIN */
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
    gap: 10,
  },

  card: {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  imageSection: {
    height: 110,
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
    fontSize: 11,
    color: "#9CA3AF",
  },

  detailsSection: {
    padding: 8,
  },

  name: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
  },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "#0B5ED7",
    fontSize: 12,
  },

  badge: {
    marginTop: 4,
    fontSize: 10,
    background: "#E6F4EA",
    color: "#137333",
    padding: "2px 6px",
    borderRadius: 6,
    display: "inline-flex",
    gap: 4,
    alignItems: "center",
  },

  actionSection: {
    padding: 8,
    borderTop: "1px solid #E5E7EB",
  },

  addToCart: {
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
};
