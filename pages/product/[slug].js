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
