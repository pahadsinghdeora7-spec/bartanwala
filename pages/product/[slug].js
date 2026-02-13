import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  FaWhatsapp,
  FaRupeeSign,
  FaShoppingCart,
  FaCheckCircle,
  FaBoxOpen,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: product } = await supabase
    .from("products")
    .select(`*, subcategories(name)`)
    .eq("slug", params.slug)
    .single();

  if (!product) return { notFound: true };

  const { data: related } = await supabase
    .from("products")
    .select("id,name,slug,image,price,price_unit")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(10);

  return {
    props: {
      product,
      related: related || [],
    },
  };
}

/* ================= PAGE ================= */

export default function ProductPage({ product, related }) {
  const { addToCart } = useCart();

  const images = [
    product.image,
    product.image1,
    product.image2,
    product.image3,
  ].filter(Boolean);

  const [activeImg, setActiveImg] = useState(images[0]);

  const unit = product.unit_type || "kg";
  const cartonSize = product.carton_size || 1;

  let quantityOptions = [];

  if (unit === "kg") {
    quantityOptions = [
      { label: "40 KG (Minimum Order)", value: 40 },
      { label: "80 KG (1 Bundle)", value: 80 },
      { label: "160 KG (2 Bundle)", value: 160 },
      { label: "240 KG (3 Bundle)", value: 240 },
    ];
  }

  if (unit === "pcs" || unit === "set") {
    quantityOptions = Array.from({ length: 5 }).map((_, i) => {
      const cartons = i + 1;
      return {
        label: `${cartons} Carton`,
        value: cartons * cartonSize,
      };
    });
  }

  const [qty, setQty] = useState(quantityOptions[0]?.value || 1);

  return (
    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        {/* IMAGE SECTION */}
        <div style={styles.imageWrap}>
          <img src={activeImg} style={styles.mainImage} />
        </div>

        {/* PRODUCT DETAILS */}
        <div style={styles.card}>
          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.priceRow}>
            <FaRupeeSign />
            <span>{product.price} / {product.price_unit}</span>
          </div>

          <div style={styles.badges}>
            <span style={styles.stock}>
              <FaCheckCircle /> In Stock
            </span>
            <span style={styles.bulk}>
              <FaBoxOpen /> Bulk Available
            </span>
          </div>

          <div style={styles.detailsBox}>
            {product.size && <Detail label="Size" value={product.size} />}
            {product.gauge && <Detail label="Gauge" value={product.gauge} />}
            {product.weight && <Detail label="Weight" value={product.weight} />}
            {product.subcategories?.name && (
              <Detail label="Sub Category" value={product.subcategories.name} />
            )}
            <Detail label="Unit Type" value={unit.toUpperCase()} />
          </div>

          <div style={styles.qtyRow}>
            <span>Quantity</span>
            <select
              style={styles.select}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {quantityOptions.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.actionRow}>
            <button
              style={styles.cartBtn}
              onClick={() => addToCart(product, qty, unit)}
            >
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
        </div>

        {/* ================= RELATED PRODUCTS ================= */}

        {related.length > 0 && (
          <div style={styles.relatedWrap}>
            <h3 style={styles.relatedTitle}>Related Products</h3>

            <div style={styles.relatedGrid}>
              {related.map((p) => (
                <div key={p.id} style={styles.relatedCardFull}>

                  <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                    <div style={styles.relatedImageSection}>
                      {p.image ? (
                        <img src={p.image} style={styles.relatedImage} />
                      ) : (
                        <div style={styles.noImage}>No Image</div>
                      )}
                    </div>
                  </Link>

                  <div style={styles.relatedDetails}>
                    <div style={styles.relatedName}>{p.name}</div>
                    <div style={styles.relatedPrice}>
                      ₹ {p.price} {p.price_unit && `/ ${p.price_unit}`}
                    </div>
                  </div>

                  <div style={styles.relatedCartSection}>
                    <Link
                      href={`/product/${p.slug}`}
                      style={styles.relatedBtn}
                    >
                      View Product
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= DETAIL COMPONENT ================= */

function Detail({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value}</span>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: { background: "#f4f6f8", paddingBottom: 100 },

  imageWrap: { background: "#fff", padding: 16 },

  mainImage: {
    width: "100%",
    height: 280,
    objectFit: "contain",
    borderRadius: 14,
    background: "#f9fafb",
  },

  card: {
    background: "#fff",
    margin: 12,
    padding: 18,
    borderRadius: 18,
  },

  title: { fontSize: 20, fontWeight: 700 },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 18,
    fontWeight: 800,
    color: "#0B5ED7",
    marginTop: 10,
  },

  badges: { display: "flex", gap: 12, marginTop: 10 },

  stock: { color: "#16a34a", fontSize: 13 },
  bulk: { color: "#2563eb", fontSize: 13 },

  detailsBox: {
    marginTop: 16,
    background: "#f9fafb",
    padding: 12,
    borderRadius: 12,
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 14,
  },

  detailLabel: { color: "#6b7280" },
  detailValue: { fontWeight: 600 },

  qtyRow: {
    marginTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  select: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },

  actionRow: { display: "flex", gap: 10, marginTop: 20 },

  cartBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "1.5px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 700,
  },

  whatsappBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    background: "#25D366",
    color: "#fff",
    fontWeight: 700,
    textAlign: "center",
    textDecoration: "none",
  },

  /* ===== RELATED SAME AS HOME ===== */

  relatedWrap: { padding: 16 },

  relatedTitle: { fontSize: 18, fontWeight: 700, marginBottom: 14 },

  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },

  relatedCardFull: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    height: 360,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  relatedImageSection: {
    height: 130,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  relatedImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  relatedDetails: {
    flex: 1,
    padding: 12,
    display: "flex",
    flexDirection: "column",
  },

  relatedName: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    minHeight: 36,
  },

  relatedPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0B5ED7",
    marginTop: "auto",
  },

  relatedCartSection: {
    padding: 10,
    borderTop: "1px solid #E5E7EB",
  },

  relatedBtn: {
    display: "block",
    textAlign: "center",
    background: "#0B5ED7",
    color: "#fff",
    padding: 8,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
  },
};
