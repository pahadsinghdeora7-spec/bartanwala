import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/* ✅ IMPORT PRODUCT CARD */
import ProductCard from "../../../components/ProductCard";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CategoryPage() {

  const router = useRouter();

  const { categorySlug } = router.query;

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  /* LOAD DATA */

  useEffect(() => {

    if (!categorySlug) return;

    async function loadData() {

      setLoading(true);

      /* CATEGORY */
      const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .single();

      if (!cat) {
        setLoading(false);
        return;
      }

      setCategory(cat);


      /* SUBCATEGORIES */
      const { data: subs } = await supabase
        .from("subcategories")
        .select("id,name,slug")
        .eq("category_id", cat.id)
        .order("name");

      setSubcategories(subs || []);


      /* PRODUCTS */
      const { data: prods } = await supabase
        .from("products")
        .select(`
          *,
          categories(name,slug),
          subcategories(name,slug)
        `)
        .eq("category_id", cat.id)
        .eq("in_stock", true)
        .order("created_at", { ascending:false });

      setProducts(prods || []);

      setLoading(false);

    }

    loadData();

  }, [categorySlug]);


  /* LOADING */

  if (loading)
    return <div style={{padding:20}}>Loading...</div>;


  /* UI */

  return (

    <>
      <Head>
        <title>{category?.name} | Bartanwala</title>
      </Head>

      <main style={styles.main}>

        {/* CATEGORY NAME */}
        <h1 style={styles.heading}>
          {category?.name}
        </h1>


        {/* SUBCATEGORIES */}

        {subcategories.length > 0 && (

          <>
            <h3 style={styles.subHeading}>Subcategories</h3>

            <div style={styles.grid}>

              {subcategories.map(sub => (

                <Link
                  key={sub.id}
                  href={`/category/${category.slug}/${sub.slug}`}
                  style={styles.subCard}
                >
                  {sub.name}
                </Link>

              ))}

            </div>

          </>
        )}


        {/* PRODUCTS */}

        {products.length > 0 && (

          <>
            <h3 style={styles.subHeading}>All Products</h3>

            {/* ✅ USE SAME PRODUCT CARD */}
            <div style={styles.grid}>

              {products.map(product => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          </>
        )}

      </main>

    </>
  );
}


/* STYLES */

const styles = {

  main:{
    padding:16,
    paddingBottom:100
  },

  heading:{
    fontSize:22,
    fontWeight:700
  },

  subHeading:{
    marginTop:20,
    marginBottom:10
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:16
  },

  subCard:{
    padding:14,
    background:"#fff",
    borderRadius:10,
    textAlign:"center",
    textDecoration:"none",
    color:"#000",
    border:"1px solid #E5E7EB",
    fontWeight:600
  }

};
