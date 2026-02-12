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
        const { data } = await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            price,
            image,
            size,
            gauge,
            subcategories(name)
          `)
          .eq("in_stock", true)
          .order("created_at", { ascending: false });

        setProducts(data || []);
      } catch (err) {
        console.error(err);
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

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

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
            Stainless Steel Utensils
          </Link>

          <Link href="/category/alluminium-utensils" style={styles.categoryCard}>
            Aluminium Utensils
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
                  {/* IMAGE */}
                  <div style={styles.imageSection}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={styles.image} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div style={styles.detailsSection}>
                    <h3 style={styles.name}>{p.name}</h3>

                    <div style={styles.metaRow}>
                      {p.size && <span>Size: {p.size}</span>}
                      {p.gauge && <span>Gauge: {p.gauge}</span>}
                    </div>

                    {p.subcategories?.name && (
                      <div style={styles.subcat}>
                        {p.subcategories.name}
                      </div>
                    )}

                    <div style={styles.price}>
                      ₹ {p.price}
                    </div>

                    <div style={styles.bulkBadge}>
                      Bulk Available
                    </div>
                  </div>
                </Link>

                {/* BUTTON */}
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
    padding: 14,
    background: "#ffffff",
  },

  categoryHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
  },

  categoryRow: {
    display: "flex",
    gap: 12,
  },

  categoryCard: {
    flex: 1,
    padding: 16,
    background: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    textAlign: "center",
    fontWeight: 600,
    color: "#111",
    textDecoration: "none",
  },

  viewAllWrap: {
    marginTop: 10,
    textAlign: "right",
  },

  viewAll: {
    fontSize: 12,
    fontWeight: 600,
    color: "#0B5ED7",
    textDecoration: "none",
  },

  main: {
    padding: 14,
    paddingBottom: 100,
  },

  heading: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 12,
  },

  /* ================= GRID ================= */

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  },

  /* ================= CARD ================= */

  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    height: 100%,              // ✅ Equal height
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

  detailsSection: {
    padding: 12,
    flex: 1,                   // ✅ Push button bottom
    display: "flex",
    flexDirection: "column",
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
    color: "#111827",
    height: 40,                // ✅ Fixed name height
    overflow: "hidden",
  },

  metaRow: {
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    minHeight: 20,             // ✅ Equal spacing
  },

  subcat: {
    fontSize: 12,
    color: "#9CA3AF",
    minHeight: 18,             // ✅ Fix uneven height
  },

  price: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0B5ED7",
    marginTop: "auto",         // ✅ Price always bottom aligned
    marginBottom: 6,
  },

  bulkBadge: {
    fontSize: 11,
    background: "#E6F4EA",
    color: "#137333",
    padding: "4px 8px",
    borderRadius: 6,
    display: "inline-block",
    marginBottom: 8,
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
    borderRadius: 10,
    padding: "10px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
};
