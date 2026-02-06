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

  /* FETCH PRODUCTS */
  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, price_unit, image")
        .eq("in_stock", true)
        .order("created_at", { ascending: false })
        .limit(8);

      setProducts(data || []);
    }
    loadProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Steel & Aluminium Utensils</title>
        <meta
          name="description"
          content="B2B wholesale steel & aluminium utensils supplier. Bulk prices, all India delivery."
        />
      </Head>

      {/* HEADER */}
      <header style={styles.header}>
        <FaBars size={20} onClick={() => setMenuOpen(!menuOpen)} />
        <strong>Bartanwala</strong>
        <a href="https://wa.me/919873670361" style={styles.whatsapp}>
          <FaWhatsapp /> WhatsApp
        </a>
      </header>

      {/* DRAWER */}
      {menuOpen && (
        <div style={styles.drawer}>
          <Link href="/">Home</Link>
          <Link href="/category/steel-bartan">Steel Bartan</Link>
          <Link href="/category/aluminium-bartan">Aluminium Bartan</Link>
          <Link href="/category/steel-thali-parat">Steel Thali & Parat</Link>
          <Link href="/category/aluminium-deg-dabba">Aluminium Deg & Dabba</Link>
        </div>
      )}

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <FaSearch style={{ color: COLORS.muted }} />
        <input
          placeholder="Search steel bartan, aluminium deg, thali..."
          style={styles.searchInput}
        />
      </div>

      {/* HERO */}
      <section style={styles.hero}>
        <h1>Wholesale Steel & Aluminium Utensils</h1>
        <p>B2B Wholesale · Factory Price · All India Delivery</p>
      </section>

      {/* PRODUCTS */}
      <main style={styles.main}>
        <h2>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav style={styles.bottomNav}>
        <BottomIcon icon={<FaHome />} label="Home" active />
        <BottomIcon icon={<FaThLarge />} label="Category" />
        <BottomIcon icon={<FaShoppingCart />} label="Cart" />
        <BottomIcon icon={<FaClipboardList />} label="Orders" />
        <BottomIcon icon={<FaUser />} label="Account" />
      </nav>
    </>
  );
}

/* PRODUCT CARD – FULLY CLICKABLE */
function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={styles.card}>
        <div style={styles.imageWrap}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={styles.image} />
          ) : (
            <div style={styles.placeholder}>Image</div>
          )}
        </div>

        <h3 style={styles.pName}>{product.name}</h3>

        <div style={styles.price}>
          <FaRupeeSign size={12} />
          <strong>{product.price}</strong> / {product.price_unit}
        </div>

        <div style={styles.meta}>
          <FaBoxOpen /> Bulk Available
        </div>

        <span style={styles.details}>View Details →</span>
      </div>
    </Link>
  );
}

/* BOTTOM ICON */
function BottomIcon({ icon, label, active }) {
  return (
    <div
      style={{
        textAlign: "center",
        color: active ? COLORS.primary : COLORS.muted,
      }}
    >
      <div>{icon}</div>
      <small>{label}</small>
    </div>
  );
}

/* STYLES */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottom: `1px solid ${COLORS.border}`,
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  whatsapp: {
    background: COLORS.success,
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 4,
    textDecoration: "none",
    fontSize: 13,
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  drawer: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#f9fafb",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  searchBox: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
  },
  hero: {
    background: "#f2f6ff",
    padding: 24,
    textAlign: "center",
  },
  main: {
    padding: 16,
    paddingBottom: 90,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
  },
  card: {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: 10,
    background: "#fff",
    cursor: "pointer",
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
    color: COLORS.muted,
  },
  pName: {
    fontSize: 14,
    margin: "6px 0",
  },
  price: {
    color: COLORS.primary,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    fontSize: 12,
    color: COLORS.dark,
    display: "flex",
    gap: 4,
    marginTop: 4,
  },
  details: {
    display: "inline-block",
    marginTop: 6,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    borderTop: `1px solid ${COLORS.border}`,
    background: "#fff",
    padding: "8px 0",
  },
};
