import { useState } from "react";
import Head from "next/head";
import { getSupabase } from "../../lib/supabase";
import {
  FaWhatsapp,
  FaRupeeSign,
  FaShoppingCart,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .limit(1);

  const product = data?.[0];

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
  };
}

export default function ProductPage({ product }) {
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
        <meta
          name="description"
          content={product.description || product.name}
        />
      </Head>

      <main style={styles.page}>
        <div style={styles.card}>
          {/* IMAGE */}
          <div style={styles.imageBox}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
            ) : (
              <div style={styles.noImage}>No Image</div>
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

            <div style={styles.badge}>
              <FaCheckCircle color="green" /> In Stock
            </div>

            <div style={styles.specs}>
              {product.size && <div>📏 Size: {product.size}</div>}
              {product.gauge && <div>⚙️ Gauge: {product.gauge}</div>}
              {product.weight && <div>⚖️ Weight: {product.weight}</div>}
              <div>
                <FaBoxOpen /> Bulk Available
              </div>
            </div>

            {/* QUANTITY */}
            <div style={styles.qtyBox}>
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

            {/* ACTIONS */}
            <div style={styles.actions}>
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
        </div>
      </main>
    </>
  );
}

const styles = {
  page: {
    padding: 16,
    maxWidth: 1100,
    margin: "0 auto",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: 24,
    background: "#fff",
    borderRadius: 10,
    padding: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  imageBox: {
    background: "#f9fafb",
    borderRadius: 8,
    height: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  noImage: {
    color: "#9CA3AF",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 20,
    color: "#0B5ED7",
  },
  price: {
    fontWeight: 700,
  },
  unit: {
    fontSize: 14,
    color: "#6B7280",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  },
  specs: {
    fontSize: 14,
    color: "#374151",
    display: "grid",
    gap: 4,
  },
  qtyBox: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  desc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 16,
  },
  cartBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    border: "1px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 600,
    cursor: "pointer",
  },
  whatsappBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    background: "#25D366",
    color: "#fff",
    fontWeight: 600,
    textAlign: "center",
    textDecoration: "none",
  },
};
