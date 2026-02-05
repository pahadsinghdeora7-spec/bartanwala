import { useState, useEffect } from "react";
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
  FaBox,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

/* SUPABASE */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [slide, setSlide] = useState(0);

  const banners = [
    "Wholesale Steel Utensils – All India",
    "Aluminium Deg & Dabba – Factory Price",
    "Hotel & Catering Bartan Supplier",
  ];

  /* SLIDER */
  useEffect(() => {
    const t = setInterval(
      () => setSlide((p) => (p + 1) % banners.length),
      3000
    );
    return () => clearInterval(t);
  }, []);

  /* FETCH PRODUCTS */
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, price, price_unit, image_url")
      .order("id", { ascending: false })
      .limit(12);

    if (data) setProducts(data);
  }

  return (
    <>
      <Head>
        <title>Bartanwala | B2B Wholesale Utensils</title>
        <meta
          name="description"
          content="Buy steel & aluminium utensils in bulk at wholesale prices across India."
        />
      </Head>

      {/* HEADER */}
      <header style={styles.header}>
        <FaBars size={20} onClick={() => setMenuOpen(!menuOpen)} />
        <b>Bartanwala</b>
        <a
          href="https://wa.me/919873670361"
          target="_blank"
          style={styles.whatsapp}
        >
          <FaWhatsapp /> WhatsApp
        </a>
      </header>

      {/* DRAWER */}
      {menuOpen && (
        <div style={styles.drawer}>
          <Link href="/">Home</Link>
          <Link href="/category/steel-bartan">Steel Bartan</Link>
          <Link href="/category/aluminium-bartan">Aluminium Bartan</Link>
          <Link href="/orders">Orders</Link>
        </div>
      )}

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <FaSearch />
        <input
          placeholder="Search steel bartan, aluminium deg, thali..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SLIDER */}
      <div style={styles.slider}>
        <h2>{banners[slide]}</h2>
        <div style={styles.features}>
          <span><FaBox /> Bulk Supply</span>
          <span><FaRupeeSign /> Factory Price</span>
          <span><FaTruck /> All India Delivery</span>
        </div>
      </div>

      {/* PRODUCTS */}
      <main style={styles.main}>
        <h2>Products</h2>

        <div style={styles.grid}>
          {products
            .filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((p) => (
              <div key={p.id} style={styles.card}>
                <img
                  src={p.image_url || "https://via.placeholder.com/200"}
                  alt={p.name}
                />
                <h3>{p.name}</h3>

                <p style={styles.price}>
                  <FaRupeeSign /> {p.price} / {p.price_unit}
                </p>

                <span style={styles.verified}>
                  <FaCheckCircle /> Verified Supplier
                </span>

                <Link href={`/product/${p.slug}`} style={styles.viewBtn}>
                  View Details
                </Link>

                <a
                  href={`https://wa.me/919873670361?text=Need price for ${p.name}`}
                  target="_blank"
                  style={styles.enquiry}
                >
                  <FaWhatsapp /> Enquiry
                </a>
              </div>
            ))}
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav style={styles.bottomNav}>
        <NavItem href="/" icon={<FaHome />} label="Home" />
        <NavItem href="/category/steel-bartan" icon={<FaThLarge />} label="Category" />
        <NavItem href="/cart" icon={<FaShoppingCart />} label="Cart" />
        <NavItem href="/orders" icon={<FaClipboardList />} label="Orders" />
        <NavItem href="/account" icon={<FaUser />} label="Account" />
      </nav>
    </>
  );
}

/* COMPONENT */
function NavItem({ href, icon, label }) {
  return (
    <Link href={href} style={styles.navItem}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

/* STYLES */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  whatsapp: {
    background: "#25D366",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 4,
    textDecoration: "none",
    display: "flex",
    gap: 5,
  },
  drawer: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#f7f7f7",
  },
  searchBox: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderBottom: "1px solid #eee",
  },
  slider: {
    background: "#f2f6ff",
    padding: 20,
    textAlign: "center",
  },
  features: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    marginTop: 10,
    fontSize: 14,
  },
  main: {
    padding: 16,
    paddingBottom: 90,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
  },
  card: {
    border: "1px solid #ddd",
    padding: 12,
    borderRadius: 6,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  price: {
    fontWeight: "bold",
  },
  verified: {
    fontSize: 12,
    color: "green",
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  viewBtn: {
    textDecoration: "none",
    color: "#0070f3",
    fontWeight: "bold",
  },
  enquiry: {
    background: "#25D366",
    color: "#fff",
    padding: 6,
    textAlign: "center",
    borderRadius: 4,
    textDecoration: "none",
    marginTop: 4,
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    borderTop: "1px solid #ddd",
    background: "#fff",
    padding: "8px 0",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 12,
    color: "#000",
    textDecoration: "none",
  },
};
