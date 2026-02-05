import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// SEO metadata (SSR safe)
export async function generateMetadata({ params }) {
  const { data: product } = await supabase
    .from("products")
    .select("name, description, slug")
    .eq("slug", params.slug)
    .single();

  if (!product) return {};

  return {
    title: `${product.name} | Bartanwala`,
    description: product.description,
    alternates: {
      canonical: `https://bartanwala.pages.dev/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }) {
  // Product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) return notFound();

  // Images
  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("position", { ascending: true });

  return (
    <main style={{ maxWidth: "1000px", margin: "auto", padding: "24px" }}>
      <h1>{product.name}</h1>

      <p>{product.description}</p>

      {/* Images */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images?.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            alt={img.alt_text || product.name}
            width="220"
          />
        ))}
      </div>

      <hr />

      <p><b>Size:</b> {product.size}</p>
      <p><b>Gauge:</b> {product.gauge}</p>
      <p><b>Weight:</b> {product.weight}</p>
      <p>
        <b>Price:</b> ₹{product.price} / {product.price_unit}
      </p>

      {product.in_stock ? (
        <p style={{ color: "green" }}>In Stock</p>
      ) : (
        <p style={{ color: "red" }}>Out of Stock</p>
      )}

      <a
        href={`https://wa.me/919873670361?text=Need%20price%20for%20${product.name}`}
        target="_blank"
        style={{
          display: "inline-block",
          marginTop: "20px",
          background: "#128C7E",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Order on WhatsApp
      </a>

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.price,
              availability: product.in_stock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
    </main>
  );
      }
