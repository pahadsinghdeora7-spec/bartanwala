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

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (error || !product) {
      return { notFound: true };
    }

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
    console.error("PRODUCT PAGE ERROR:", err);
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

  const unit = product.unit_type || "kg";
  const cartonSize = product.carton_size || 1;

  let quantityOptions = [];

  if (unit === "kg") {
    quantityOptions = [
      { label: "40 KG (Minimum Order)", value: 40 },
      { label: "80 KG (1 Bundle)", value: 80 },
      { label: "160 KG (2 Bundle)", value: 160 },
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

  const addToCart = () => {
    if (typeof window === "undefined") return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, qty, unit });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
      </Head>

      <div style={{ paddingBottom: 90 }}>
        <div style={{ background: "#fff", padding: 16 }}>
          <img src={activeImg} style={{ width: "100%", height: 260 }} />
        </div>

        <div style={{ background: "#fff", margin: 12, padding: 18 }}>
          <h1>{product.name}</h1>

          <div>
            <FaRupeeSign /> {product.price} / {product.price_unit}
          </div>

          <div>
            <FaCheckCircle /> In Stock
          </div>

          <select
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          >
            {quantityOptions.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>

          <button onClick={addToCart}>
            <FaShoppingCart /> Add to Cart
          </button>

          <a
            href="https://wa.me/919873670361"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp /> Get Bulk Price
          </a>

          <p>{product.description}</p>
        </div>

        {related.length > 0 && (
          <div style={{ padding: 12 }}>
            <h3>Related Products</h3>
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`}>
                <a>{p.name}</a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = { ... }
        const styles = {
  page: {
    background: "#f4f6f8",
    paddingBottom: 90,
  },

  /* IMAGE SECTION */
  imageWrap: {
    background: "#fff",
    padding: 16,
    borderBottom: "1px solid #e5e7eb",
  },

  mainImage: {
    width: "100%",
    height: 260,
    objectFit: "contain",
    borderRadius: 12,
  },

  thumbRow: {
    display: "flex",
    gap: 10,
    marginTop: 12,
    overflowX: "auto",
  },

  thumb: {
    width: 64,
    height: 64,
    objectFit: "contain",
    borderRadius: 10,
    padding: 6,
    background: "#fff",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },

  /* PRODUCT CARD */
  card: {
    background: "#fff",
    margin: "12px",
    padding: 18,
    borderRadius: 18,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    lineHeight: 1.3,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#374151",
  },

  price: {
    color: "#0B5ED7",
    fontWeight: 700,
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },

  stock: {
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 600,
  },

  /* QUANTITY */
  qtyRow: {
    marginTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  select: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    background: "#fff",
  },

  /* ACTION BUTTONS */
  actionRow: {
    display: "flex",
    gap: 12,
    marginTop: 20,
  },

  cartBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "1.5px solid #0B5ED7",
    background: "#fff",
    color: "#0B5ED7",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },

  whatsappBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    background: "#25D366",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    textAlign: "center",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  /* DESCRIPTION */
  desc: {
    marginTop: 18,
    fontSize: 14,
    lineHeight: 1.7,
    color: "#4b5563",
    borderTop: "1px dashed #e5e7eb",
    paddingTop: 12,
  },

  /* RELATED */
  related: {
    padding: 12,
  },

  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    marginTop: 10,
  },

  relatedCard: {
    background: "#fff",
    padding: 12,
    borderRadius: 14,
    textDecoration: "none",
    color: "#111",
    fontSize: 14,
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },
};
