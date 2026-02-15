import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/* ✅ USE SAME PRODUCT CARD */
import ProductCard from "../../../../components/ProductCard";

/* SUPABASE */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function SubcategoryProductsPage() {

  const router = useRouter();

  const { categorySlug, subcategorySlug } = router.query;

  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);


  /* LOAD DATA */

  useEffect(() => {

    if (!router.isReady) return;
    if (!categorySlug || !subcategorySlug) return;

    async function loadData() {

      try {

        setLoading(true);

        /* GET SUBCATEGORY */

        const { data: subcat, error } = await supabase
          .from("subcategories")
          .select(`
            id,
            name,
            slug,
            categories (
              id,
              name,
              slug
            )
          `)
          .eq("slug", subcategorySlug)
          .single();


        if (error || !subcat) {

          console.log("Subcategory error:", error);

          setProducts([]);
          setLoading(false);

          return;

        }


        /* VALIDATE CATEGORY */

        if (subcat.categories.slug !== categorySlug) {

          router.replace("/404");

          return;

        }


        setSubcategory(subcat);


        /* GET PRODUCTS */

        const { data: prodData, error: prodError } = await supabase
          .from("products")
          .select(`
            *,
            categories(name,slug),
            subcategories(name,slug)
          `)
          .eq("subcategory_id", subcat.id)
          .eq("in_stock", true)
          .order("created_at", { ascending:false });


        if (prodError)
          console.log("Product error:", prodError);


        setProducts(prodData || []);

      }
      catch (err) {

        console.log("Load error:", err);

      }
      finally {

        setLoading(false);

      }

    }

    loadData();

  }, [router.isReady, categorySlug, subcategorySlug]);


  /* LOADING */

  if (loading)
    return <div style={{ padding:20 }}>Loading...</div>;


  /* UI */

  return (

    <>
      <Head>
        <title>{subcategory?.name} | Bartanwala</title>
      </Head>


      <main style={styles.main}>


        {/* SUBCATEGORY TITLE */}

        <h1 style={styles.heading}>
          {subcategory?.name}
        </h1>


        {/* PRODUCTS */}

        <div style={styles.grid}>

          {products.map(product => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>


        {/* EMPTY */}

        {products.length === 0 && (

          <div style={styles.empty}>
            No products found
          </div>

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
    fontWeight:700,
    marginBottom:16
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:16
  },

  empty:{
    padding:20,
    textAlign:"center",
    color:"#6b7280"
  }

};
