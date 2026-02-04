import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
      `Buy ${product.name} at wholesale price across India.`,
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
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    return <h1>Product not found</h1>;
  }

  // 2️⃣ Fetch prices
  const { data: prices } = await supabase
    .from("product_prices")
    .select("unit, price")
    .eq("product_id", product.id)
    .order("unit");

  // 3️⃣ Fetch images
  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("position");

  return (
    <main style={{ padding: "16px", maxWidth: "900px", margin: "auto" }}>
      {/* TITLE */}
      <h1>{product.name}</h1>

      {/* IMAGES */}
      <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
        {images?.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            alt={img.alt_text || product.name}
            width="180"
          />
        ))}
      </div>

      {/* DESCRIPTION */}
      <p>{product.description}</p>

      {/* PRICE TABLE */}
      <h2>Wholesale Prices</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {prices?.map((p, i) => (
            <tr key={i}>
              <td>{p.unit}</td>
              <td>{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* WHATSAPP CTA */}
      <a
        href={`https://wa.me/919873670361?text=I want wholesale price for ${product.name}`}
        target="_blank"
        style={{
          display: "inline-block",
          marginTop: "16px",
          padding: "12px 20px",
          background: "#25D366",
          color: "#fff",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Enquire on WhatsApp
      </a>

      {/* BACK LINK */}
      <p style={{ marginTop: "20px" }}>
        <Link href={`/category/${product.category_slug}`}>
          ← Back to Category
        </Link>
      </p>

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: images?.map((i) => i.image_url),
            offers: prices?.map((p) => ({
              "@type": "Offer",
              priceCurrency: "INR",
              price: p.price,
              availability: "https://schema.org/InStock",
            })),
          }),
        }}
      />
    </main>
  );
                        }
