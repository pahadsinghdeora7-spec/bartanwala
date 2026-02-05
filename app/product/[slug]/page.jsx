import { supabase } from "@/lib/supabase";

/* =========================
   STATIC PARAMS
========================= */
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from("products")
    .select("slug");

  return products.map((p) => ({
    slug: p.slug,
  }));
}

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
    return { title: "Product Not Found | Bartanwala" };
  }

  return {
    title: `${product.name} Wholesale Price | Bartanwala`,
    description: product.description,
  };
}

/* =========================
   PAGE
========================= */
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
    <main style={{ padding: "16px" }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
