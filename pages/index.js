import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  FaRupeeSign,
  FaBoxOpen,
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
                <div style={styles.imageWrap}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.image} />
                  ) : (
                    <div style={styles.placeholder}>No Image</div>
                  )}
                </div>

                <h3 style={styles.pName}>{p.name}</h3>

                <div style={styles.price}>
                  <FaRupeeSign size={12} />
                  <strong>{p.price}</strong> / {p.price_unit}
                </div>

                <div style={styles.meta}>
                  <FaBoxOpen /> Bulk Available
                </div>

                <span style={styles.details}>View Details →</span>
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
    padding: "22px 14px",
    textAlign: "center",
  },
  main: {
    padding: "12px",
    paddingBottom: "80px", // bottom nav safe space
  },
  heading: {
    marginBottom: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // MOBILE 2 COLUMN
    gap: 12,
  },
  card: {
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: 10,
    background: "#fff",
  },
  imageWrap: {
    height: 130,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  placeholder: {
    height: "100%",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    color: "#777",
  },
  pName: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
  },
  price: {
    color: "#0B5ED7",
    fontSize: 14,
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  meta: {
    fontSize: 12,
    marginTop: 4,
    color: "#555",
  },
  details: {
    display: "block",
    marginTop: 6,
    fontSize: 13,
    color: "#0B5ED7",
    fontWeight: 600,
  },
};
