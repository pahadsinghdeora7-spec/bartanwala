   import { createClient } from "@supabase/supabase-js";

/* 🔑 Supabase client (NO alias) */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ✅ REQUIRED FOR STATIC EXPORT */
export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("products")
    .select("slug");

  if (error || !data) return [];

  return data.map((item) => ({
    slug: item.slug,
  }));
}

/* ✅ SEO METADATA */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single();

  return {
    title: data?.name
      ? `${data.name} Wholesale | Bartanwala`
      : "Product | Bartanwala",
    description:
      data?.description ||
      "Wholesale steel & aluminium utensils",
  };
}

/* ✅ PAGE */
export default async function ProductPage({ params }) {
  const { slug } = params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>{product.name}</h1>

      {product.description && (
        <p>{product.description}</p>
      )}

      <p>
        <strong>
          ₹{product.price} / {product.price_unit}
        </strong>
      </p>
    </main>
  );
}
