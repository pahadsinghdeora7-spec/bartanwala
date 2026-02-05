import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// SEO metadata (SSR)
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
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) return notFound();

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("position");

  return (
    <main style={{ maxWidth: "1100px", margin: "auto", padding: "24px" }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {images?.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            alt={img.alt_text || product.name}
            width="220"
          />
        ))}
      </div>

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
        href={`https://wa.me/919873670361?text=Need price for ${product.name}`}
        target="_blank"
      >
        WhatsApp Order
      </a>
    </main>
  );
}
