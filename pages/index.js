import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

/* SUPABASE CLIENT */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState([]);

  const banners = [
    "Wholesale Steel Utensils – All India",
    "Aluminium Deg & Dabba – Bulk Supply",
    "Hotel & Catering Bartan Supplier",
  ];

  /* SLIDER */
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  /* LOAD PRODUCTS FROM DB */
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, price, price_unit");

    if (!error && data) {
      setProducts(data);
    }
  }

  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Utensils India</title>
        <meta
          name="description"
          content="B2B wholesale steel and aluminium utensils supplier across India."
        />
      </Head>

      {/* HEADER */}
      <header style={header}>
        <div style={hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span style={line}></span>
          <span style={line}></span>
          <span style={line}></span>
        </div>

        <div style={logo}>Bartanwala</div>

        <a
          href="https://wa.me/919873670361"
          target="_blank"
          rel="noopener noreferrer"
          style={whatsapp}
        >
          WhatsApp
        </a>
      </header>

      {/* DRAWER */}
      {menuOpen && (
        <div style={drawer}>
          <b>Categories</b>
          <Link href="/category/steel-bartan">Steel Bartan</Link>
          <Link href="/category/aluminium-bartan">Aluminium Bartan</Link>
          <Link href="/category/steel-thali-parat">Steel Thali & Parat</Link>
          <Link href="/category/aluminium-deg-dabba">Aluminium Deg & Dabba</Link>
        </div>
      )}

      {/* SEARCH */}
      <div style={searchBox}>
        <input
          placeholder="Search steel bartan, aluminium deg, thali..."
          style={searchInput}
        />
      </div>

      {/* SLIDER */}
      <div style={slider}>
        <h2>{banners[slide]}</h2>
        <p>B2B Wholesale · Best Prices · All India Delivery</p>
      </div>

      {/* PRODUCTS */}
      <main style={main}>
        <h2>Products</h2>

        <div style={productGrid}>
          {products.map((p) => (
            <div key={p.id} style={productCard}>
              <div style={imgBox}>Image</div>

              <h4>{p.name}</h4>

              <p style={price}>
                ₹{p.price} / {p.price_unit}
              </p>

              <Link href={`/product/${p.slug}`} style={viewBtn}>
                View Details →
              </Link>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p style={{ opacity: 0.6 }}>No products found</p>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav style={bottomNav}>
        <NavItem href="/" label="Home" />
        <NavItem href="/category/steel-bartan" label="Category" />
        <NavItem href="/cart" label="Cart" />
        <NavItem href="/orders" label="Orders" />
        <NavItem href="/account" label="Account" />
      </nav>
    </>
  );
}

/* COMPONENT */
function NavItem({ href, label }) {
  return (
    <Link href={href} style={navItem}>
      {label}
    </Link>
  );
}

/* STYLES */

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px",
  borderBottom: "1px solid #ddd",
  background: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const hamburger = { display: "flex", flexDirection: "column", gap: "4px" };
const line = { width: "22px", height: "2px", background: "#000" };
const logo = { fontWeight: "bold", fontSize: "18px" };

const whatsapp = {
  background: "#25D366",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "4px",
  fontSize: "14px",
  textDecoration: "none",
};

const drawer = {
  padding: "16px",
  background: "#f9f9f9",
  borderBottom: "1px solid #ddd",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const searchBox = { padding: "12px" };

const searchInput = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const slider = {
  padding: "20px",
  background: "#f2f6ff",
  textAlign: "center",
};

const main = { padding: "16px", paddingBottom: "90px" };

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "14px",
};

const productCard = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "10px",
  background: "#fff",
};

const imgBox = {
  height: "120px",
  background: "#eee",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
};

const price = { fontWeight: "bold", marginBottom: "6px" };

const viewBtn = {
  textDecoration: "none",
  color: "#0070f3",
  fontWeight: "bold",
  fontSize: "13px",
};

const bottomNav = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-around",
  borderTop: "1px solid #ddd",
  background: "#fff",
  padding: "10px 0",
};

const navItem = {
  fontSize: "13px",
  textDecoration: "none",
  color: "#000",
};
