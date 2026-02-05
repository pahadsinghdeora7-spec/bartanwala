export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

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
    <main style={{ padding: 24 }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {images?.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            alt={img.alt_text || product.name}
            width="200"
          />
        ))}
      </div>

      <p><b>Price:</b> {product.price} {product.price_unit}</p>
    </main>
  );
}
