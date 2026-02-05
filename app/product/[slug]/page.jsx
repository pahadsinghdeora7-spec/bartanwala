import { supabase } from "@/lib/supabase";

export async function generateStaticParams() {
  const { data } = await supabase
    .from("products")
    .select("slug");

  return (data || []).map(p => ({
    slug: p.slug
  }));
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
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
