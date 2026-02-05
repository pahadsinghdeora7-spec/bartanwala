import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const banners = [
    "Wholesale Steel Utensils – All India",
    "Aluminium Deg & Dabba – Bulk Supply",
    "Hotel & Catering Bartan Supplier",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div style={drawer}>
          <p><b>Categories</b></p>
          <Link href="/category/steel-bartan">Steel Bartan</Link>
          <Link href="/category/aluminium-bartan">Aluminium Bartan</Link>
          <Link href="/category/steel-thali-parat">Steel Thali & Parat</Link>
          <Link href="/category/aluminium-deg-dabba">Aluminium Deg & Dabba</Link>
        </div>
      )}

      {/* SEARCH BAR */}
      <div style={searchBox}>
        <input
          type="text"
          placeholder="Search steel bartan, aluminium deg, thali..."
          style={searchInput}
        />
      </div>

      {/* SLIDER */}
      <div style={slider}>
        <h2>{banners[slide]}</h2>
        <p>B2B Wholesale · Best Prices · All India Delivery</p>
      </div>

      {/* MAIN CONTENT */}
      <main style={main}>
        <h2>Product Categories</h2>

        <div style={categoryGrid}>
          <CategoryCard
            title="Steel Bartan"
            desc="Bulk stainless steel utensils for hotels & caterers."
            link="/category/steel-bartan"
          />
          <CategoryCard
            title="Aluminium Bartan"
            desc="Lightweight aluminium utensils at wholesale prices."
            link="/category/aluminium-bartan"
          />
          <CategoryCard
            title="Steel Thali & Parat"
            desc="Heavy gauge steel thali & parat."
            link="/category/steel-thali-parat"
          />
          <CategoryCard
            title="Aluminium Deg & Dabba"
            desc="Commercial cooking deg & storage dabba."
            link="/category/aluminium-deg-dabba"
          />
        </div>
      </main>

      {/* BOTTOM NAVBAR */}
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

/* COMPONENTS */

function CategoryCard({ title, desc, link }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p>{desc}</p>
      <Link href={link} style={cardLink}>
        View Products →
      </Link>
    </div>
  );
}

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

const hamburger = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const line = {
  width: "22px",
  height: "2px",
  background: "#000",
};

const logo = {
  fontWeight: "bold",
  fontSize: "18px",
};

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

const searchBox = {
  padding: "12px",
};

const searchInput = {
  width: "100%",
  padding: "10px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const slider = {
  padding: "20px",
  background: "#f2f6ff",
  textAlign: "center",
};

const main = {
  padding: "16px",
  paddingBottom: "90px",
};

const categoryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const card = {
  border: "1px solid #ddd",
  padding: "14px",
  borderRadius: "6px",
  background: "#fff",
};

const cardLink = {
  color: "#0070f3",
  fontWeight: "bold",
  textDecoration: "none",
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
