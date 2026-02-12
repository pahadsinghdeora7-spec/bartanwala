import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  FaRupeeSign,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";

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
        .select(`
          id,
          name,
          slug,
          price,
          price_unit,
          image,
          size,
          gauge,
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

      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>
              <Link
                href={`/product/${p.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ flexGrow: 1 }}>
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
                    <div style={styles.name}>{p.name}</div>

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
      </main>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  main: {
    padding: 14,
    paddingBottom: 90,
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  heading: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 340,
    overflow: "hidden",
  },

  imageSection: {
    height: 150,
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

  detailsSection: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flexGrow: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: 38,
  },

  meta: {
    fontSize: 11,
    color: "#6b7280",
  },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "#0B5ED7",
    fontSize: 13,
    fontWeight: 700,
    marginTop: 4,
  },

  badge: {
    marginTop: 4,
    fontSize: 10,
    background: "#E6F4EA",
    color: "#137333",
    padding: "3px 8px",
    borderRadius: 20,
    display: "inline-flex",
    gap: 4,
    alignItems: "center",
    width: "fit-content",
  },

  actionSection: {
    padding: 10,
    borderTop: "1px solid #e5e7eb",
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
