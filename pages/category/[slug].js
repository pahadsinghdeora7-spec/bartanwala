import Head from "next/head";
import Link from "next/link";
import { getSupabase } from "../../lib/supabase";
import { FaRupeeSign } from "react-icons/fa";

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", params.slug)
    .single();

  if (!category) {
    return { notFound: true };
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, price_unit, image")
    .eq("category_id", category.id)
    .eq("in_stock", true);

  return {
    props: {
      category,
      products: products || [],
    },
  };
}

export default function CategoryPage({ category, products }) {
  return (
    <>
      <Head>
        <title>{category.name} | Bartanwala</title>
        <meta
          name="description"
          content={
            category.description ||
            `Wholesale ${category.name} at factory price. All India delivery.`
          }
        />
      </Head>

      <main style={{ padding: 16 }}>
        <h1>{category.name}</h1>

        {products.length === 0 && (
          <p style={{ color: "#6B7280" }}>
            Is category me abhi products available nahi hain.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 14,
            marginTop: 16,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 6,
                padding: 10,
                background: "#fff",
              }}
            >
              <div style={{ height: 120 }}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9CA3AF",
                    }}
                  >
                    Image
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: 14, margin: "6px 0" }}>{p.name}</h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#0B5ED7",
                  fontSize: 14,
                }}
              >
                <FaRupeeSign size={12} />
                <strong>{p.price}</strong> / {p.price_unit}
              </div>

              <Link
                href={`/product/${p.slug}`}
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  fontSize: 13,
                  color: "#0B5ED7",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
