import { getSupabase } from '../../lib/supabase';

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
  };
}

export default function ProductPage({ product }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>₹ {product.price}</p>
    </main>
  );
}
