import { supabase } from "../../lib/supabase";

export async function getServerSideProps({ params }) {
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) return { notFound: true };

  const { data: products } = await supabase
    .from("products")
    .select("id,name,slug,price,price_unit")
    .eq("category_id", category.id);

  return {
    props: { category, products: products || [] }
  };
}

export default function Category({ category, products }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <ul>
        {products.map(p => (
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
