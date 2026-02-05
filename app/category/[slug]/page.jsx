import { supabase } from "@/lib/supabase";

/* REQUIRED FOR STATIC EXPORT */
export async function generateStaticParams() {
  const { data } = await supabase
    .from("categories")
    .select("slug");

  return (data || []).map(cat => ({
    slug: cat.slug
  }));
}

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
    .select("id, name, slug")
    .eq("category_id", category.id);

  return (
    <main>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <ul>
        {products?.map(p => (
          <li key={p.id}>
            <a href={`/product/${p.slug}`}>{p.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
