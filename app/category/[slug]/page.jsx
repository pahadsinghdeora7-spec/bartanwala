import { supabase } from "@/lib/supabase";

/* 🔹 REQUIRED FOR STATIC EXPORT */
export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

/* 🔹 SEO */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    return { title: "Category Not Found | Bartanwala" };
  }

  return {
    title: `${category.name} Wholesale Price | Bartanwala`,
    description:
      category.description ||
      `Buy ${category.name} at wholesale price across India`,
  };
}

/* 🔹 PAGE */
export default async function CategoryPage({ params }) {
  const { slug } = params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug")
    .eq("category_id", category.id);

  return (
    <main style={{ padding: "16px" }}>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <ul>
        {products?.map((p) => (
          <li key={p.id}>
            <a href={`/product/${p.slug}`}>{p.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
