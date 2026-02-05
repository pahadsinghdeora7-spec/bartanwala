import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function generateStaticParams() {
  const { data } = await supabase
    .from("products")
    .select("slug");

  if (!data) return [];

  return data.map((p) => ({
    slug: p.slug,
  }));
}

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
      "Wholesale utensils product",
  };
}

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
      <p>{product.description}</p>
      <strong>
        ₹{product.price} / {product.price_unit}
      </strong>
    </main>
  );
}
