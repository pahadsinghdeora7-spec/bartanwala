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

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select(
          "id, name, slug, price, image, size, gauge, subcategories(name)"
        )
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
    alert("Product added to cart");
  }

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

                  <div style={styles.metaRow}>
                    {p.size && <span>Size: {p.size}</span>}
                    {p.gauge && <span>Gauge: {p.gauge}</span>}
                  </div>

                  {p.subcategories?.name && (
                    <div style={styles.subcat}>
                      {p.subcategories.name}
                    </div>
                  )}

                  <div style={styles.price}>₹ {p.price}</div>

                  <div style={styles.bulkBadge}>
                    Bulk Available
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

  main: {
    padding: 16,
    paddingBottom: 100,
  },

  heading: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14,
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
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  imageSection: {
    height: 160,
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
    padding: 14,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
    color: "#111827",
    minHeight: 40,
  },

  metaRow: {
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },

  subcat: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0B5ED7",
    marginTop: "auto",
    marginBottom: 6,
  },

  bulkBadge: {
    fontSize: 11,
    background: "#E6F4EA",
    color: "#137333",
    padding: "4px 8px",
    borderRadius: 6,
    display: "inline-block",
  },

  actionSection: {
    padding: 12,
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
