import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const supabase = getSupabase();

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
      canonical: `https://bartanwala.vercel.app/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }) {
  const supabase = getSupabase();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) notFound();

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("position");

  return (
    <main style={{ maxWidth: 1100, margin: "auto", padding: 24 }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {images?.map(img => (
          <img
            key={img.id}
            src={img.image_url}
            alt={img.alt_text || product.name}
            width={220}
          />
        ))}
      </div>

      <p><b>Price:</b> ₹{product.price} / {product.price_unit}</p>

      {product.in_stock ? (
        <p style={{ color: "green" }}>In Stock</p>
      ) : (
        <p style={{ color: "red" }}>Out of Stock</p>
      )}
    </main>
  );
}
