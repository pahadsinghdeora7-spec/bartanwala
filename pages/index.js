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
          `
          id,
          name,
          slug,
          price,
          image,
          size,
          gauge,
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

      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>

              {/* IMAGE SECTION */}
              <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                <div style={styles.imageSection}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}
                </div>
              </Link>

              {/* DETAILS SECTION */}
              <div style={styles.detailsSection}>
                <div style={styles.category}>
                  {p.categories?.name}
                </div>

                <div style={styles.name}>
                  {p.name}
                </div>

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
                </div>
              </div>

              {/* ADD TO CART SECTION */}
              <div style={styles.cartSection}>
                <button
                  style={styles.cartBtn}
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
    height: 420,            // FIXED CARD HEIGHT
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  /* IMAGE */
  imageSection: {
    height: 150,            // FIXED IMAGE HEIGHT
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

  /* DETAILS */
  detailsSection: {
    flex: 1,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },

  category: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0B5ED7",
    marginBottom: 4,
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 6,
    minHeight: 42,
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

  /* CART */
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
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
};
