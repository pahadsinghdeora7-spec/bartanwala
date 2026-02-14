import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

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
        .select(`
          id,
          name,
          slug,
          price,
          image,
          size,
          gauge,
          unit_type,
          pcs_per_carton,
          categories(name),
          subcategories(name)
        `)
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      setProducts(data || []);
    }

    loadProducts();
  }, []);

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const pcsPerCarton = product.pcs_per_carton || 1;

    let minQty = 1;

    if (unit === "kg") minQty = 40;
    if (unit === "pcs" || unit === "set") minQty = pcsPerCarton;

    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      existing.qty += minQty;
    } else {
      cart.push({
        ...product,
        qty: minQty,
        unit,
      });
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

      {/* CATEGORY SECTION — LOCKED */}
      <section style={styles.categorySection}>
        <h2 style={styles.categoryHeading}>Shop By Category</h2>

        <div style={styles.categoryRow}>
          <Link href="/category/stainless-steel-utensils" style={styles.categoryCard}>
            Stainless Steel Utensils
          </Link>

          <Link href="/category/aluminium-utensils" style={styles.categoryCard}>
            Aluminium Utensils
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
          {products.map((p) => {
            const unit = p.unit_type || "kg";
            const pcsPerCarton = p.pcs_per_carton || 1;

            return (
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

                  {/* Category Badge */}
                  <div style={styles.badge}>
                    {p.categories?.name}
                  </div>

                  {/* Name */}
                  <div style={styles.name}>
                    {p.name}
                  </div>

                  {/* Meta */}
                  <div style={styles.metaRow}>
                    {p.size && <span>Size: {p.size}</span>}
                    {p.gauge && <span>Gauge: {p.gauge}</span>}
                  </div>

                  {/* Price */}
                  <div style={styles.price}>
                    ₹ {p.price}
                    <span style={styles.unit}> / {unit.toUpperCase()}</span>
                  </div>

                  {/* Minimum Info */}
                  {unit === "kg" && (
                    <div style={styles.minBox}>
                      Min Order: 40 KG
                    </div>
                  )}

                  {(unit === "pcs" || unit === "set") && (
                    <div style={styles.minBox}>
                      1 Carton = {pcsPerCarton} {unit.toUpperCase()}
                    </div>
                  )}

                </div>

                <div style={styles.cartSection}>
                  <button
                    style={styles.cartBtn}
                    onClick={() => addToCart(p)}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

const styles = {
  hero: {
    background: "#f8fafc",
    padding: "28px 16px",
    textAlign: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    border: "1px solid #E5E7EB",
    marginBottom: 16,
  },
  heroTitle: { fontSize: 20, fontWeight: 700, marginBottom: 6 },
  heroSub: { fontSize: 13, color: "#6b7280" },

  categorySection: { padding: 16 },
  categoryHeading: { fontSize: 16, fontWeight: 700, marginBottom: 12 },
  categoryRow: { display: "flex", gap: 12 },
  categoryCard: {
    flex: 1,
    padding: 14,
    background: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    textDecoration: "none",
    color: "#111",
    textAlign: "center",
    fontWeight: 600,
  },
  viewAllWrap: { marginTop: 10, textAlign: "right" },
  viewAll: { fontSize: 12, fontWeight: 600, color: "#0B5ED7" },

  main: { padding: 16, paddingBottom: 100 },
  heading: { fontSize: 18, fontWeight: 700, marginBottom: 14 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  },

  imageSection: {
    height: 160,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  noImage: { fontSize: 12, color: "#9CA3AF" },

  detailsSection: {
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  badge: {
    fontSize: 10,
    fontWeight: 600,
    background: "#E0EDFF",
    color: "#0B5ED7",
    padding: "4px 8px",
    borderRadius: 20,
    width: "fit-content",
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.3,
  },

  metaRow: {
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#6b7280",
  },

  price: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0B5ED7",
    marginTop: 6,
  },

  unit: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
  },

  minBox: {
    fontSize: 11,
    background: "#F3F4F6",
    padding: "6px 8px",
    borderRadius: 8,
    marginTop: 4,
  },

  cartSection: {
    padding: 12,
    borderTop: "1px solid #E5E7EB",
  },

  cartBtn: {
    width: "100%",
    background: "linear-gradient(135deg,#0B5ED7,#084298)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
