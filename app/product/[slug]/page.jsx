import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function ProductPage({ params }) {
  const supabase = getSupabase();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !product) return notFound();

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("position");

  return (
    <main style={{ maxWidth: 1000, margin: "auto", padding: 24 }}>
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
      <p style={{ color: product.in_stock ? "green" : "red" }}>
        {product.in_stock ? "In Stock" : "Out of Stock"}
      </p>

      <a
        href={`https://wa.me/919873670361?text=Need price for ${product.name}`}
        target="_blank"
      >
        Order on WhatsApp
      </a>
    </main>
  );
}
