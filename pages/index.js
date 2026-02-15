import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import ProductCard from "../components/ProductCard"; // ✅ IMPORT

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    async function loadProducts() {

      const { data } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          image,
          size,
          gauge,
          unit_type,
          pcs_per_carton,

          /* ✅ FIX: SLUG ADDED */
          categories(
            name,
            slug
          ),

          subcategories(
            name,
            slug
          )
        `)
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      setProducts(data || []);

    }

    loadProducts();

  }, []);


  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Steel & Aluminium Utensils</title>
      </Head>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Wholesale Steel & Aluminium Utensils
        </h1>

        <p style={styles.heroSub}>
          B2B Wholesale · Factory Price · All India Delivery
        </p>
      </section>


      {/* CATEGORY */}
      <section style={styles.categorySection}>

        <h2 style={styles.categoryHeading}>
          Shop By Category
        </h2>

        <div style={styles.categoryRow}>

          <Link href="/category/stainless-steel-utensils" style={styles.categoryCard}>
            Stainless Steel Utensils
          </Link>

          <Link href="/category/aluminium-utensils" style={styles.categoryCard}>
            Aluminium Utensils
          </Link>

        </div>

        <div style={styles.viewAllWrap}>

          <Link href="/categories" style={styles.viewAll}>
            View All Categories →
          </Link>

        </div>

      </section>


      {/* PRODUCTS */}
      <main style={styles.main}>

        <h2 style={styles.heading}>
          Products
        </h2>

        {/* ✅ PRODUCT CARD */}
        <div style={styles.grid}>

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </main>

    </>
  );

}


const styles = {

  hero: {
    background: "#f8fafc",
    padding: "28px 16px",
    textAlign: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    border: "1px solid #E5E7EB",
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 6
  },

  heroSub: {
    fontSize: 13,
    color: "#6b7280"
  },

  categorySection: {
    padding: 16
  },

  categoryHeading: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12
  },

  categoryRow: {
    display: "flex",
    gap: 12
  },

  categoryCard: {
    flex: 1,
    padding: 14,
    background: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    textDecoration: "none",
    color: "#111",
    textAlign: "center",
    fontWeight: 600,
  },

  viewAllWrap: {
    marginTop: 10,
    textAlign: "right"
  },

  viewAll: {
    fontSize: 12,
    fontWeight: 600,
    color: "#0B5ED7"
  },

  main: {
    padding: 16,
    paddingBottom: 100
  },

  heading: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },

};
