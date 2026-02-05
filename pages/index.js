import Head from "next/head";
import { supabase } from "../lib/supabase";

export async function getServerSideProps() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description");

  return {
    props: {
      categories: categories || []
    }
  };
}

export default function Home({ categories }) {
  return (
    <>
      <Head>
        <title>Bartanwala | B2B Wholesale Steel & Aluminium Utensils</title>
        <meta
          name="description"
          content="Bartanwala – All India B2B wholesale steel & aluminium bartan supplier. Bulk orders on WhatsApp."
        />
      </Head>

      <main style={{ padding: 24 }}>
        <h1>Bartanwala</h1>
        <p>B2B Wholesale Steel & Aluminium Utensils – All India</p>

        <h2>Categories</h2>

        <ul>
          {categories.map(cat => (
            <li key={cat.id}>
              <a href={`/category/${cat.slug}`}>
                <strong>{cat.name}</strong>
              </a>
              <br />
              <small>{cat.description}</small>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
  }
