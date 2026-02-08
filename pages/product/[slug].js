import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSupabase } from "../../lib/supabase";
import {
  FaWhatsapp,
  FaRupeeSign,
  FaShoppingCart,
  FaCheckCircle,
  FaBoxOpen,
} from "react-icons/fa";

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {
  try {
    const supabase = getSupabase();

    // ✅ MAIN PRODUCT
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (error || !product) {
      return { notFound: true };
    }

    // ✅ RELATED PRODUCTS
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
  } catch (err) {
    console.error("Product page error:", err);
    return { notFound: true };
  }
}

/* ================= PAGE ================= */

export default function ProductPage({ product, related }) {
  const images = [
    product.image,
    product.image1,
    product.image2,
    product.image3,
  ].filter(Boolean);

  const [activeImg, setActiveImg] = useState(images[0]);

  /* ================= QUANTITY LOGIC ================= */

  const unit = product.unit_type || "kg";
  const cartonSize = product.carton_size || 1;

  let quantityOptions = [];

  if (unit === "kg") {
    quantityOptions = [
      { label: "40 KG (Minimum Order)", value: 40 },
      { label: "80 KG (1 Bundle)", value: 80 },
      { label: "160 KG (2 Bundle)", value: 160 },
      { label: "240 KG (3 Bundle)", value: 240 },
      { label: "320 KG (4 Bundle)", value: 320 },
    ];
  }

  if (unit === "pcs" || unit === "set") {
    quantityOptions = Array.from({ length: 5 }).map((_, i) => {
      const cartons = i + 1;
      return {
        label: `${cartons} Carton`,
        value: cartons * cartonSize,
        cartons,
      };
    });
  }

  const [qty, setQty] = useState(quantityOptions[0]?.value || 1);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);

    const cartons =
      unit === "kg"
        ? qty >= 80
          ? qty / 80
          : 0
        : qty / cartonSize;

    const cartItem = {
      ...product,
      qty,
      unit,
      cartons,
      carton_size: unit === "kg" ? null : cartonSize,
    };

    if (existing) {
      existing.qty = qty;
      existing.cartons = cartons;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  return (
    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
      </Head>

      <div style={styles.page}>
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

        <div style={styles.card}>
          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.row}>
            <div style={styles.price}>
              <FaRupeeSign /> {product.price} / {product.price_unit}
            </div>
            <div style={styles.stock}>
              <FaCheckCircle /> In Stock
            </div>
          </div>

          <div style={styles.row}>
            <div>📦 Unit: {unit.toUpperCase()}</div>
            <div>
              <FaBoxOpen /> Bulk Available
            </div>
          </div>

          <div style={styles.qtyRow}>
            <span>Quantity</span>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={styles.select}
            >
              {quantityOptions.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.actionRow}>
            <button style={styles.cartBtn} onClick={addToCart}>
              <FaShoppingCart /> Add to Cart
            </button>
            <a
              href="https://wa.me/919873670361"
              target="_blank"
              rel="noreferrer"
              style={styles.whatsappBtn}
            >
              <FaWhatsapp /> Get Bulk Price
            </a>
          </div>

          <p style={styles.desc}>{product.description}</p>
        </div>

        {related.length > 0 && (
          <div style={styles.related}>
            <h3>Related Products</h3>
            <div style={styles.relatedGrid}>
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`}>
                  <a style={styles.relatedCard}>
                    <img src={p.image} />
                    <div>{p.name}</div>
                    <strong>
                      ₹{p.price}/{p.price_unit}
                    </strong>
                  </a>
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
  page: { background: "#f5f6f8", paddingBottom: 90 },
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
  select: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
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
