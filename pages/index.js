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
  const [qtyMap, setQtyMap] = useState({}); // 🔥 NEW

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          slug,
          price,
          price_unit,
          image,
          size,
          gauge,
          unit_type,
          carton_size,
          categories(name),
          subcategories(name)
        `
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

    const unit = product.unit_type || "kg";
    const minQty = unit === "kg" ? 40 : 1;

    const qty = qtyMap[product.id] || minQty;

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
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

      {/* ================= CATEGORY SECTION ================= */}
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

      {/* ================= PRODUCTS ================= */}
      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => {
            const unit = p.unit_type || "kg";
            const minQty = unit === "kg" ? 40 : 1;

            return (
              <div key={p.id} style={styles.card}>
                {/* IMAGE */}
                <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={styles.imageSection}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={styles.image} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                  </div>
                </Link>

                {/* DETAILS */}
                <div style={styles.detailsSection}>
                  <div style={styles.category}>
                    {p.categories?.name}
                  </div>

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

                  {/* 🔥 QUANTITY SECTION */}
                  <div style={styles.qtyBox}>
                    <select
                      style={styles.select}
                      value={qtyMap[p.id] || minQty}
                      onChange={(e) =>
                        setQtyMap((prev) => ({
                          ...prev,
                          [p.id]: Number(e.target.value),
                        }))
                      }
                    >
                      {unit === "kg"
                        ? [40, 80, 120, 160].map((val) => (
                            <option key={val} value={val}>
                              {val} KGS
                            </option>
                          ))
                        : [1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val}>
                              {val} Carton
                            </option>
                          ))}
                    </select>

                    <input
                      type="number"
                      min={minQty}
                      value={qtyMap[p.id] || minQty}
                      onChange={(e) =>
                        setQtyMap((prev) => ({
                          ...prev,
                          [p.id]: Number(e.target.value),
                        }))
                      }
                      style={styles.input}
                    />
                  </div>
                </div>

                {/* ADD TO CART */}
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

/* ================= STYLES ================= */

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

  heroTitle: {
    fontSize: 20,
    fontWeight: 700,
  },

  heroSub: {
    fontSize: 13,
    color: "#6b7280",
  },

  categorySection: { padding: 16 },

  categoryHeading: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
  },

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

  viewAll: {
    fontSize: 12,
    fontWeight: 600,
    color: "#0B5ED7",
    textDecoration: "none",
  },

  main: { padding: 16, paddingBottom: 100 },

  heading: { fontSize: 18, fontWeight: 700, marginBottom: 14 },

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
    height: 470,
  },

  imageSection: {
    height: 150,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },

  noImage: { fontSize: 12, color: "#9CA3AF" },

  detailsSection: {
    flex: 1,
    padding: 14,
    display: "flex",
    flexDirection: "column",
  },

  category: { fontSize: 11, fontWeight: 600, color: "#0B5ED7" },

  name: { fontSize: 14, fontWeight: 700, marginBottom: 6 },

  metaRow: { fontSize: 12, color: "#6b7280" },

  subcategory: { fontSize: 12, color: "#9CA3AF" },

  price: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0B5ED7",
    marginTop: "auto",
  },

  unit: { fontSize: 12, color: "#6b7280" },

  qtyBox: {
    marginTop: 10,
    display: "flex",
    gap: 8,
  },

  select: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
  },

  input: {
    width: 70,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
  },

  cartSection: {
    padding: 12,
    borderTop: "1px solid #E5E7EB",
  },

  cartBtn: {
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
