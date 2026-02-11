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
    .select("*")
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
  const { addToCart } = useCart(); // ✅ CONTEXT

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
        <div style={styles.imageWrap}>
          <img src={activeImg} style={styles.mainImage} />
          <div style={styles.thumbRow}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                style={{
                  ...styles.thumb,
                  border:
                    img === activeImg
                      ? "2px solid #0B5ED7"
                      : "1px solid #e5e7eb",
                }}
                onClick={() => setActiveImg(img)}
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
              onClick={() => addToCart(product, qty, unit)} // ✅ FIXED
            >
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

          <p style={styles.desc}>{product.description}</p>
        </div>

        {related.length > 0 && (
          <div style={styles.related}>
            <h3 style={styles.relatedTitle}>Related Products</h3>
            <div style={styles.relatedGrid}>
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`}>
                  <a style={styles.relatedCard}>
                    <img src={p.image} style={styles.relatedImg} />
                    <div style={styles.relatedName}>{p.name}</div>
                    <div style={styles.relatedPrice}>
                      ₹{p.price}/{p.price_unit}
                    </div>
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
