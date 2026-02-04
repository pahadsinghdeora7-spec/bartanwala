import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

/* ============================
   SEO METADATA (VERY IMPORTANT)
============================ */
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
      description: "Wholesale kitchen utensils across India.",
    };
  }

  return {
    title: `${category.name} Wholesale Supplier in India | Bartanwala`,
    description:
      category.description ||
      `Buy ${category.name} at best wholesale price across India. Bulk supply for hotel, catering and restaurant use.`,
    alternates: {
      canonical: `https://bartanwala.in/category/${slug}`,
    },
    openGraph: {
      title: `${category.name} Wholesale | Bartanwala`,
      description:
        category.description ||
        `Best wholesale supplier of ${category.name} in India.`,
      url: `https://bartanwala.in/category/${slug}`,
      siteName: "Bartanwala",
      type: "website",
    },
  };
}

/* ============================
   CATEGORY PAGE
============================ */
export default async function CategoryPage({ params }) {
  const { slug } = params;

  /* ---------- Fetch Category ---------- */
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  /* ---------- Fetch Products with Min Price ---------- */
  const { data: products } = await supabase.rpc(
    "get_products_by_category",
    { cat_id: category.id }
  );

  return (
    <main className="container">
      {/* =========================
          SEO H1 (ONLY ONE H1)
      ========================== */}
      <h1 className="category-title">
        {category.h1 || `${category.name} Wholesale Supplier`}
      </h1>

      {/* =========================
          SEO DESCRIPTION
      ========================== */}
      <p className="category-description">
        {category.description ||
          `Buy ${category.name} at best wholesale price across India. Ideal for hotels, caterers, restaurants and bulk buyers.`}
      </p>

      <hr />

      {/* =========================
          PRODUCT LIST
      ========================== */}
      {products && products.length > 0 ? (
        <ul className="product-grid">
          {products.map((product) => (
            <li key={product.id} className="product-card">
              {/* H2 for SEO */}
              <h2 className="product-title">{product.name}</h2>

              {/* Price */}
              <p className="price">
                Starting from <strong>₹{product.min_price}</strong>
              </p>

              {/* Size / Gauge */}
              {(product.size || product.gauge) && (
                <p className="meta">
                  {product.size && <>Size: {product.size}</>}
                  {product.size && product.gauge && " | "}
                  {product.gauge && <>Gauge: {product.gauge}</>}
                </p>
              )}

              {/* Internal Link */}
              <Link
                href={`/product/${product.slug}`}
                className="view-link"
              >
                View Product →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available in this category.</p>
      )}

      {/* =========================
          SEO TEXT BLOCK (POWERFUL)
      ========================== */}
      <section className="seo-content">
        <h2>Why buy {category.name} from Bartanwala?</h2>
        <p>
          Bartanwala is a trusted B2B wholesale supplier of{" "}
          {category.name} across India. We supply hotels, catering
          businesses, restaurants and bulk buyers with consistent
          quality, competitive pricing and reliable delivery.
        </p>
      </section>
    </main>
  );
}
