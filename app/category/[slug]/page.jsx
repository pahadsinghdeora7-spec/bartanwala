import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function CategoryPage({ params }) {
  const supabase = getSupabase();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) return notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id,name,slug,price,price_unit")
    .eq("category_id", category.id);

  return (
    <main style={{ padding: 24 }}>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <ul>
        {products?.map(p => (
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
