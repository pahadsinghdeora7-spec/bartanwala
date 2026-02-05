import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ✅ STATIC PARAMS REQUIRED */
export async function generateStaticParams() {
  const { data } = await supabase
    .from("categories")
    .select("slug");

  if (!data) return [];

  return data.map((c) => ({
    slug: c.slug,
  }));
}

/* ✅ SEO */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  return {
    title: data?.name
      ? `${data.name} Wholesale | Bartanwala`
      : "Category | Bartanwala",
    description:
      data?.description ||
      "Wholesale utensils category",
  };
}

/* ✅ PAGE */
export default async function CategoryPage({ params }) {
  const { slug } = params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    return <h1>Category not found</h1>;
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, price_unit")
    .eq("category_id", category.id);

  return (
    <main style={{ padding: "24px" }}>
      <h1>{category.name}</h1>

      {category.description && (
        <p>{category.description}</p>
      )}

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
