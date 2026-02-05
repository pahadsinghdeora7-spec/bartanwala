import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/* =========================
   SEO METADATA (DYNAMIC)
========================= */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    return {
      title: "Category Not Found | Bartanwala",
    };
  }

  return {
    title: `${category.name} Wholesale | Bartanwala`,
    description:
      category.description ||
      `Buy ${category.name} at wholesale prices. Bulk supply across India for hotels, restaurants and caterers.`,
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
    notFound();
  }

  // 2️⃣ Fetch products of category
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, price_unit")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: "24px" }}>
      {/* H1 – MOST IMPORTANT */}
      <h1>{category.name} Wholesale Supplier</h1>

      {/* SEO Description */}
      <p style={{ maxWidth: "720px" }}>
        {category.description ||
          `Bartanwala supplies ${category.name} at wholesale prices across India. Ideal for hotels, restaurants, caterers and bulk buyers.`}
      </p>

      <hr style={{ margin: "24px 0" }} />

      {/* PRODUCTS */}
      <h2>Available Products</h2>

      {products && products.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                border: "1px solid #ddd",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <h3>{product.name}</h3>
              <p>
                Price: ₹{product.price} / {product.price_unit}
              </p>

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
