import { supabase } from "@/lib/supabase";
import Link from "next/link";

/* =========================
   SEO METADATA (VERY IMPORTANT)
========================= */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data: category } = await supabase
    .from("categories")
    .select("name, description, h1")
    .eq("slug", slug)
    .single();

  if (!category) {
    return {
      title: "Category Not Found | Bartanwala",
    };
  }

  return {
    title: `${category.name} Wholesale Price | Bartanwala`,
    description:
      category.description ||
      `Buy ${category.name} at wholesale price across India.`,
  };
}

/* =========================
   CATEGORY PAGE
========================= */
export default async function CategoryPage({ params }) {
  const { slug } = params;

  // 1️⃣ Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    return <h1>Category not found</h1>;
  }

  // 2️⃣ Fetch products of category
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, price_unit")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: "16px" }}>
      {/* H1 – SEO GOLD */}
      <h1>{category.h1 || category.name}</h1>

      <p>{category.description}</p>

      <hr />

      {/* PRODUCTS LIST */}
      {products && products.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "12px",
              }}
            >
              <h2>{product.name}</h2>

              <p>
                Price: ₹{product.price} / {product.price_unit}
              </p>

              {/* Future Product Page */}
              <Link href={`/product/${product.slug}`}>
                View Product →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available in this category.</p>
      )}
    </main>
  );
              }
