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
    else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.price_unit,
        qty,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  const whatsappMessage = encodeURIComponent(
    `Hello Bartanwala,

Product: ${product.name}
Price: ₹${product.price}/${product.price_unit}
Quantity: ${qty}

Please share bulk price.`
  );

  return (
    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
      </Head>

      {/* PAGE */}
      <div style={styles.page}>
        {/* IMAGE SECTION */}
        <div style={styles.imageSection}>
          <img src={activeImg} alt={product.name} style={styles.mainImage} />

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

        {/* DETAILS */}
        <div style={styles.details}>
          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.priceRow}>
            <FaRupeeSign />
            <span style={styles.price}>{product.price}</span>
            <span style={styles.unit}>/ {product.price_unit}</span>
          </div>

          <div style={styles.stock}>
            <FaCheckCircle color="green" /> In Stock
          </div>

          {/* SPECS */}
          <div style={styles.specs}>
            {product.size && <div>📏 Size: {product.size}</div>}
            {product.gauge && <div>⚙️ Gauge: {product.gauge}</div>}
            {product.weight && <div>⚖️ Weight: {product.weight}</div>}
            <div>
              <FaBoxOpen /> Bulk Available
            </div>
          </div>

          {/* QUANTITY */}
          <div style={styles.qtyRow}>
            <span>Quantity</span>
            <div style={styles.qtyControl}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <strong>{qty}</strong>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <p style={styles.desc}>{product.description}</p>
          )}
        </div>

        {/* STICKY ACTION BAR (LIKE LAPKINGHUB) */}
        <div style={styles.stickyBar}>
          <button style={styles.cartBtn} onClick={addToCart}>
            <FaShoppingCart /> Add to Cart
          </button>

          <a
            href={`https://wa.me/919873670361?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.whatsappBtn}
          >
            <FaWhatsapp /> Get Bulk Price
          </a>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#f5f6f8",
    minHeight: "100vh",
    paddingBottom: 90,
  },

  imageSection: {
    background: "#fff",
    padding: 16,
  },

  mainImage: {
    width: "100%",
    height: 260,
    objectFit: "contain",
    borderRadius: 10,
  },

  thumbRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },

  thumb: {
    width: 60,
    height: 60,
    objectFit: "contain",
    borderRadius: 8,
    padding: 4,
    background: "#fff",
  },

  details: {
    background: "#fff",
    marginTop: 8,
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.3,
  },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 22,
    color: "#0B5ED7",
    marginTop: 8,
  },

  price: {
    fontWeight: 700,
  },

  unit: {
    fontSize: 14,
    color: "#6b7280",
  },

  stock: {
    marginTop: 6,
    fontSize: 14,
  },

  specs: {
    marginTop: 12,
    display: "grid",
    gap: 6,
    fontSize: 14,
    color: "#374151",
  },

  qtyRow: {
    marginTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  qtyControl: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  desc: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#4b5563",
  },

  stickyBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    gap: 10,
    padding: 12,
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
  },

  cartBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 600,
    fontSize: 15,
  },

  whatsappBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    background: "#25D366",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    textAlign: "center",
    textDecoration: "none",
  },
};
