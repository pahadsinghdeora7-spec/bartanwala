import { supabase } from "@/lib/supabase";

/* REQUIRED FOR STATIC EXPORT */
export async function generateStaticParams() {
  const { data } = await supabase
    .from("categories")
    .select("slug");

  return data.map((c) => ({
    slug: c.slug,
  }));
}

/* SEO */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  return {
    title: `${data.name} Wholesale | Bartanwala`,
    description:
      data.description ||
      `Buy ${data.name} at wholesale price`,
  };
}

/* PAGE */
export default async function CategoryPage({ params }) {
  const { slug } = params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id);

  return (
    <main style={{ padding: "24px" }}>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <hr />

      {products?.length ? (
        products.map((p) => (
          <div key={p.id} style={{ marginBottom: "16px" }}>
            <h2>{p.name}</h2>
            <p>
              ₹{p.price} / {p.price_unit}
            </p>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </main>
  );
}
