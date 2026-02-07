import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSupabase } from "../../lib/supabase";
import {
  FaBars,
  FaSearch,
  FaWhatsapp,
  FaRupeeSign,
  FaShoppingCart,
  FaCheckCircle,
  FaBoxOpen,
} from "react-icons/fa";

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .limit(1);

  const product = data?.[0];
  if (!product) return { notFound: true };

  const { data: related } = await supabase
    .from("products")
    .select("id,name,slug,image,price,price_unit")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(6);

  return {
    props: {
      product,
      related: related || [],
    },
  };
}

export default function ProductPage({ product, related }) {
  const images = [
    product.image,
    product.image1,
    product.image2,
    product.image3,
  ].filter(Boolean);

  const [activeImg, setActiveImg] = useState(images[0]);
  const [qty, setQty] = useState(1);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.qty += qty;
    else cart.push({ ...product, qty });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  return (
    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
      </Head>

      {/* HEADER */}
      <header style={styles.header}>
        <FaBars />
        <strong>Bartanwala</strong>
        <a href="https://wa.me/919873670361" style={styles.whatsappTop}>
          <FaWhatsapp /> WhatsApp
        </a>
      </header>

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <FaSearch />
        <input placeholder="Search steel bartan, thali, deg..." />
      </div>

      {/* PAGE */}
      <div style={styles.page}>
        {/* IMAGE */}
        <div style={styles.imageWrap}>
          <img src={activeImg} style={styles.mainImage} />
          <div style={styles.thumbRow}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImg(img)}
                style={{
                  ...styles.thumb,
                  border:
                    img === activeImg
                      ? "2px solid #0B5ED7"
                      : "1px solid #e5e7eb",
                }}
              />
            ))}
          </div>
        </div>

        {/* PRODUCT CARD */}
        <div style={styles.card}>
          <h1 style={styles.title}>{product.name}</h1>

          {/* PRICE + STOCK */}
          <div style={styles.row}>
            <div style={styles.price}>
              <FaRupeeSign /> {product.price} / {product.price_unit}
            </div>
            <div style={styles.stock}>
              <FaCheckCircle /> In Stock
            </div>
          </div>

          {/* SPECS */}
          <div style={styles.row}>
            <div>📏 Size: {product.size}</div>
            <div>⚙️ Gauge: {product.gauge}</div>
          </div>

          <div style={styles.row}>
            <div>⚖️ Weight: {product.weight}</div>
            <div>
              <FaBoxOpen /> Bulk Available
            </div>
          </div>

          {/* QUANTITY */}
          <div style={styles.qtyRow}>
            <span>Quantity</span>
            <div style={styles.qtyBox}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <input
                type="number"
                value={qty}
                min="1"
                onChange={(e) => setQty(Number(e.target.value) || 1)}
              />
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          {/* BUTTONS */}
          <div style={styles.actionRow}>
            <button style={styles.cartBtn} onClick={addToCart}>
              <FaShoppingCart /> Add to Cart
            </button>
            <a
              href="https://wa.me/919873670361"
              target="_blank"
              style={styles.whatsappBtn}
            >
              <FaWhatsapp /> Get Bulk Price
            </a>
          </div>

          {/* DESCRIPTION */}
          <p style={styles.desc}>{product.description}</p>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div style={styles.related}>
            <h3>Related Products</h3>
            <div style={styles.relatedGrid}>
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  style={styles.relatedCard}
                >
                  <img src={p.image} />
                  <div>{p.name}</div>
                  <strong>
                    ₹{p.price}/{p.price_unit}
                  </strong>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
  },

  whatsappTop: {
    background: "#25D366",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: 13,
  },

  searchBox: {
    display: "flex",
    gap: 8,
    padding: 10,
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
  },

  page: { background: "#f5f6f8", paddingBottom: 30 },

  imageWrap: { background: "#fff", padding: 16 },

  mainImage: {
    width: "100%",
    height: 260,
    objectFit: "contain",
    borderRadius: 12,
  },

  thumbRow: { display: "flex", gap: 8, marginTop: 10 },

  thumb: {
    width: 56,
    height: 56,
    objectFit: "contain",
    borderRadius: 8,
    padding: 4,
    background: "#fff",
  },

  card: {
    background: "#fff",
    margin: 12,
    padding: 18,
    borderRadius: 16,
  },

  title: { textAlign: "center", fontSize: 20, fontWeight: 700 },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    fontSize: 14,
  },

  price: { color: "#0B5ED7", fontWeight: 700 },

  stock: { color: "green", display: "flex", gap: 4 },

  qtyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  qtyBox: { display: "flex", gap: 6 },

  actionRow: { display: "flex", gap: 10, marginTop: 18 },

  cartBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 600,
  },

  whatsappBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    background: "#25D366",
    color: "#fff",
    fontWeight: 600,
    textAlign: "center",
    textDecoration: "none",
  },

  desc: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#4b5563",
  },

  related: { padding: 12 },

  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },

  relatedCard: {
    background: "#fff",
    padding: 10,
    borderRadius: 12,
    textDecoration: "none",
    color: "#000",
  },
};
