import { useState } from "react";
import Head from "next/head";
import { getSupabase } from "../../lib/supabase";
import {
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

  return { props: { product } };
}

export default function ProductPage({ product }) {
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

      <div style={styles.page}>
        {/* IMAGE */}
        <div style={styles.imageWrap}>
          <img src={activeImg} style={styles.mainImage} />

          {images.length > 1 && (
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
          )}
        </div>

        {/* PRODUCT CARD */}
        <div style={styles.card}>
          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.priceRow}>
            <FaRupeeSign />
            <strong>{product.price}</strong>
            <span>/ {product.price_unit}</span>
          </div>

          <div style={styles.stock}>
            <FaCheckCircle color="green" /> In Stock
          </div>

          <div style={styles.specs}>
            <div>📏 Size: {product.size}</div>
            <div>⚙️ Gauge: {product.gauge}</div>
            <div>⚖️ Weight: {product.weight}</div>
            <div>
              <FaBoxOpen /> Bulk Available
            </div>
          </div>

          {/* QUANTITY */}
          <div style={styles.qtyRow}>
            <span>Quantity</span>
            <div style={styles.qty}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <strong>{qty}</strong>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <p style={styles.desc}>{product.description}</p>

          {/* ACTION BUTTONS (NOT TOO LOW) */}
          <div style={styles.actionRow}>
            <button style={styles.cartBtn} onClick={addToCart}>
              <FaShoppingCart /> Add to Cart
            </button>

            <a
              href={`https://wa.me/919873670361`}
              target="_blank"
              style={styles.whatsappBtn}
            >
              <FaWhatsapp /> Get Bulk Price
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#f5f6f8",
    paddingBottom: 30,
  },

  imageWrap: {
    background: "#fff",
    padding: 16,
  },

  mainImage: {
    width: "100%",
    height: 260,
    objectFit: "contain",
    borderRadius: 12,
  },

  thumbRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    justifyContent: "center",
  },

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
    margin: "12px",
    padding: "18px",
    borderRadius: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.3,
    textAlign: "center",
  },

  priceRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    fontSize: 22,
    color: "#0B5ED7",
    marginTop: 8,
  },

  stock: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 14,
  },

  specs: {
    marginTop: 14,
    display: "grid",
    gap: 6,
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
  },

  qtyRow: {
    marginTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  qty: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  desc: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#4b5563",
    textAlign: "center",
  },

  actionRow: {
    display: "flex",
    gap: 10,
    marginTop: 18,
  },

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
};
