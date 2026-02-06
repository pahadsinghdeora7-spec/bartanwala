import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  FaBars,
  FaSearch,
  FaWhatsapp,
  FaHome,
  FaThLarge,
  FaShoppingCart,
  FaClipboardList,
  FaUser,
  FaRupeeSign,
  FaBoxOpen,
} from "react-icons/fa";

/* SUPABASE */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* COLORS */
const COLORS = {
  primary: "#0B5ED7",
  dark: "#333333",
  muted: "#9CA3AF",
  border: "#E5E7EB",
  success: "#25D366",
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

      <header style={styles.header}>
        <FaBars size={20} onClick={() => setMenuOpen(!menuOpen)} />
        <strong>Bartanwala</strong>
        <a href="https://wa.me/919873670361" style={styles.whatsapp}>
          <FaWhatsapp /> WhatsApp
        </a>
      </header>

      {menuOpen && (
        <div style={styles.drawer}>
          <Link href="/">Home</Link>
          <Link href="/category/steel-bartan">Steel Bartan</Link>
          <Link href="/category/aluminium-bartan">Aluminium Bartan</Link>
        </div>
      )}

      <section style={styles.hero}>
        <h1>Wholesale Steel & Aluminium Utensils</h1>
        <p>B2B Wholesale · Factory Price · All India Delivery</p>
      </section>

      <main style={styles.main}>
        <h2>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <a style={styles.card}>
                <div style={styles.imageWrap}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.placeholder}>Image</div>
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
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderBottom: "1px solid #E5E7EB",
  },
  whatsapp: {
    background: "#25D366",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 4,
    textDecoration: "none",
  },
  drawer: {
    padding: 16,
    background: "#f9fafb",
  },
  hero: {
    background: "#f2f6ff",
    padding: 24,
    textAlign: "center",
  },
  main: {
    padding: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
  },
  card: {
    display: "block",
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    padding: 10,
    background: "#fff",
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
  placeholder: {
    height: "100%",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pName: {
    fontSize: 14,
  },
  price: {
    color: "#0B5ED7",
    fontSize: 14,
    display: "flex",
    gap: 4,
  },
  meta: {
    fontSize: 12,
    marginTop: 4,
  },
  details: {
    marginTop: 6,
    fontSize: 13,
    color: "#0B5ED7",
    fontWeight: "bold",
  },
};
