import { supabase } from "../../../lib/supabase";
import Link from "next/link";

/* ===============================
   SEO METADATA (VERY IMPORTANT)
================================ */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found | Bartanwala",
    };
  }

  return {
    title: `${product.name} Wholesale Price | Bartanwala`,
    description:
      product.description ||
      `Buy ${product.name} at best wholesale price across India`,
  };
}

/* ===============================
   PRODUCT PAGE
================================ */
export default async function ProductPage({ params }) {
  const { slug } = params;

  /* 1️⃣ Fetch product */
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    return <h1>Product not found</h1>;
  }

  /* 2️⃣ Fetch prices (KG / PCS / DOZEN / SET) */
  const { data: prices } = await supabase
    .from("product_prices")
    .select("unit, price")
    .eq("product_id", product.id)
    .order("unit");

  return (
    <main style={{ padding: "16px" }}>
      {/* ===============================
          H1 – SEO GOLD
      =============================== */}
      <h1>{product.name}</h1>

      {/* ===============================
          BASIC DETAILS
      =============================== */}
      {product.size && <p><strong>Size:</strong> {product.size}</p>}
      {product.gauge && <p><strong>Gauge:</strong> {product.gauge}</p>}
      {product.weight && <p><strong>Weight:</strong> {product.weight}</p>}

      <hr />

      {/* ===============================
          PRICE TABLE
      =============================== */}
      <h2>Wholesale Prices</h2>

      {prices && prices.length > 0 ? (
        <ul>
          {prices.map((p) => (
            <li key={p.unit}>
              ₹ {p.price} / {p.unit}
            </li>
          ))}
        </ul>
      ) : (
        <p>Price not available</p>
      )}

      <hr />

      {/* ===============================
          DESCRIPTION (SEO CONTENT)
      =============================== */}
      <h2>Product Description</h2>
      <p>
        {product.description ||
          "High quality stainless steel product suitable for hotel, catering and bulk buyers across India."}
      </p>

      <hr />

      {/* ===============================
          INTERNAL LINKING (SEO BOOST)
      =============================== */}
      <Link href={`/category/${product.category_slug}`}>
        ← Back to Category
      </Link>
    </main>
  );
      }
