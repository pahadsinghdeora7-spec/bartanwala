import { getSupabase } from '../lib/supabase';

export async function getServerSideProps() {
  const supabase = getSupabase();

  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  return {
    props: { categories: categories || [] },
  };
}

export default function Home({ categories }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Bartanwala</h1>

      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </main>
  );
}
