import { getSupabase } from '../../lib/supabase';

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    return { notFound: true };
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id);

  return {
    props: {
      category,
      products: products || [],
    },
  };
}

export default function CategoryPage({ category, products }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{category.name}</h1>

      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </main>
  );
}
