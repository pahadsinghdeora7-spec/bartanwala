import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/* =========================
   SEO METADATA
========================= */
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
      `Buy ${product.name} at wholesale price from Bartanwala. Bulk supply across India for hotels, restaurants & caterers.`,
  };
}

/* =========================
   PRODUCT PAGE
========================= */
export default async function ProductPage({ params }) {
  const { slug } = params;

  // 1️⃣ Fetch product
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      price,
      price_unit,
      category_id,
      categories ( name, slug )
    `
    )
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <main style={{ padding: "24px", maxWidth: "900px" }}>
      {/* BREADCRUMB */}
      <p style={{ fontSize: "14px" }}>
        <Link href="/">Home</Link> /{" "}
        <Link href={`/category/${product.categories.slug}`}>
          {product.categories.name}
        </Link>
      </p>

      {/* H1 – MOST IMPORTANT */}
      <h1>{product.name}</h1>

      {/* PRICE */}
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
        ₹{product.price} / {product.price_unit}
      </p>

      {/* DESCRIPTION */}
      <p style={{ maxWidth: "720px" }}>
        {product.description ||
          `${product.name} available at wholesale price from Bartanwala. Best quality for bulk buyers, hotels, restaurants and caterers.`}
      </p>

      <hr style={{ margin: "24px 0" }} />

      {/* BULK INFO */}
      <h2>Why Buy from Bartanwala?</h2>
      <ul>
        <li>✔ Wholesale & bulk pricing</li>
        <li>✔ PAN India supply</li>
        <li>✔ Trusted B2B supplier</li>
        <li>✔ Suitable for hotels & restaurants</li>
      </ul>

      <hr style={{ margin: "24px 0" }} />

      {/* WHATSAPP CTA */}
      <a
        href={`https://wa.me/919873670361?text=Hello%20Bartanwala,%20I%20want%20to%20buy%20${encodeURIComponent(
          product.name
        )}`}
        target="_blank"
        style={{
          display: "inline-block",
          background: "#25D366",
          color: "#fff",
          padding: "12px 18px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        📞 Enquire on WhatsApp
      </a>
    </main>
  );
}
