import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Utensils B2B</title>
        <meta
          name="description"
          content="Wholesale steel and aluminium utensils supplier for hotels, restaurants and caterers across India."
        />
      </Head>

      {/* HEADER */}
      <header style={headerStyle}>
        {/* LEFT: HAMBURGER */}
        <div
          style={hamburgerStyle}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={lineStyle}></span>
          <span style={lineStyle}></span>
          <span style={lineStyle}></span>
        </div>

        {/* CENTER: LOGO */}
        <div style={logoStyle}>Bartanwala</div>

        {/* RIGHT: WHATSAPP */}
        <a
          href="https://wa.me/919873670361"
          target="_blank"
          rel="noopener noreferrer"
          style={whatsappBtn}
        >
          WhatsApp
        </a>
      </header>

      {/* NAVBAR */}
      <nav style={navStyle}>
        <Link href="/">Home</Link>
        <Link href="/category/steel-bartan">Category</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/account">Account</Link>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={mobileMenu}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/category/steel-bartan" onClick={() => setMenuOpen(false)}>Category</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
          <Link href="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
          <Link href="/account" onClick={() => setMenuOpen(false)}>Account</Link>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main style={{ padding: "24px", maxWidth: "1100px", margin: "auto" }}>
        <h1>Wholesale Steel & Aluminium Utensils</h1>
        <p style={{ color: "#555", maxWidth: "700px" }}>
          Buy stainless steel and aluminium utensils in bulk at wholesale prices.
          Trusted by hotels, caterers and restaurants across India.
        </p>

        <h2 style={{ marginTop: "32px" }}>Product Categories</h2>

        <ul>
          <li>Steel Bartan</li>
          <li>Aluminium Bartan</li>
          <li>Steel Thali & Parat</li>
          <li>Aluminium Deg & Dabba</li>
        </ul>
      </main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        © 2026 Bartanwala · B2B Wholesale Platform
      </footer>
    </>
  );
}

/* ================= STYLES ================= */

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid #e5e5e5",
  position: "sticky",
  top: 0,
  background: "#fff",
  zIndex: 1000,
};

const hamburgerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  cursor: "pointer",
};

const lineStyle = {
  width: "22px",
  height: "2px",
  background: "#000",
};

const logoStyle = {
  fontSize: "18px",
  fontWeight: "bold",
};

const whatsappBtn = {
  background: "#25D366",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "4px",
  textDecoration: "none",
  fontSize: "14px",
};

const navStyle = {
  display: "flex",
  gap: "20px",
  padding: "10px 16px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

const mobileMenu = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "16px",
  borderBottom: "1px solid #ddd",
  background: "#fafafa",
};

const footerStyle = {
  borderTop: "1px solid #eee",
  padding: "16px",
  fontSize: "14px",
  color: "#777",
  textAlign: "center",
};
