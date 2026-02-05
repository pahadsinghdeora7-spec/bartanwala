import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  return {
    props: {
      categories: categories || [],
    },
  };
}

export default function Home({ categories }) {
  return (
    <main style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Bartanwala</h1>
        <p style={styles.subtitle}>
          Wholesale Steel & Aluminium Utensils – All India
        </p>
      </header>

      {/* Categories */}
      <section>
        <h2 style={styles.sectionTitle}>Product Categories</h2>

        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <div style={styles.grid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                style={styles.card}
              >
                <h3 style={styles.cardTitle}>{cat.name}</h3>
                {cat.description && (
                  <p style={styles.cardDesc}>{cat.description}</p>
                )}
                <span style={styles.cardLink}>View Products →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Bartanwala</p>
        <p>B2B Wholesale Platform</p>
      </footer>
    </main>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#555",
  },
  sectionTitle: {
    fontSize: "22px",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    display: "block",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#000",
    background: "#fafafa",
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "6px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  cardLink: {
    fontSize: "14px",
    color: "#0070f3",
    fontWeight: "bold",
  },
  footer: {
    marginTop: "40px",
    paddingTop: "16px",
    borderTop: "1px solid #eee",
    color: "#777",
    fontSize: "14px",
  },
};
