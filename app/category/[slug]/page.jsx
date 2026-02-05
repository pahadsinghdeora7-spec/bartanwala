import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// SEO (SSR)
export async function generateMetadata({ params }) {
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", params.slug)
    .single();

  if (!category) return {};

  return {
    title: `${category.name} Wholesale | Bartanwala`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) return notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, price_unit")
    .eq("category_id", category.id);

  return (
    <main style={{ padding: "24px" }}>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <ul>
        {products?.map((p) => (
          <li key={p.id}>
            <a href={`/product/${p.slug}`}>
              {p.name} – ₹{p.price}/{p.price_unit}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
