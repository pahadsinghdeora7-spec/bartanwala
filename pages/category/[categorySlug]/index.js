import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/* PRODUCT CARD */
import ProductCard from "../../../components/ProductCard";

/* SUPABASE */

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

    if (!router.isReady) return;
    if (!categorySlug) return;

    async function loadData() {

      try {

        setLoading(true);

        /* GET CATEGORY */

        const { data: cat, error: catError } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", categorySlug)
          .single();

        if (catError || !cat) {

          console.log("Category error:", catError);

          setCategory(null);
          setSubcategories([]);
          setProducts([]);
          setLoading(false);

          return;
        }

        setCategory(cat);


        /* GET SUBCATEGORIES */

        const { data: subs, error: subError } = await supabase
          .from("subcategories")
          .select("id, name, slug")
          .eq("category_id", cat.id)
          .order("name");

        if (subError)
          console.log("Subcategory error:", subError);

        setSubcategories(subs || []);


        /* GET PRODUCTS */

        const { data: prods, error: prodError } = await supabase
          .from("products")
          .select(`
            *,
            categories(name,slug),
            subcategories(name,slug)
          `)
          .eq("category_id", cat.id)
          .eq("in_stock", true)
          .order("created_at", { ascending:false });

        if (prodError)
          console.log("Product error:", prodError);

        setProducts(prods || []);

      }
      catch (err) {

        console.log("Load error:", err);

      }
      finally {

        setLoading(false);

      }

    }

    loadData();

  }, [router.isReady, categorySlug]);


  /* LOADING */

  if (loading)
    return <div style={{ padding:20 }}>Loading...</div>;


  /* NO CATEGORY FOUND */

  if (!category)
    return <div style={{ padding:20 }}>Category not found</div>;


  /* UI */

  return (

    <>
      <Head>
        <title>{category.name} | Bartanwala</title>
      </Head>

      <main style={styles.main}>


        {/* CATEGORY TITLE */}

        <h1 style={styles.heading}>
          {category.name}
        </h1>



        {/* SUBCATEGORIES */}

        {subcategories.length > 0 && (

          <>
            <h3 style={styles.subHeading}>
              Subcategories
            </h3>

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
            <h3 style={styles.subHeading}>
              All Products
            </h3>

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



        {/* NO PRODUCTS */}

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
    marginBottom:10
  },

  subHeading:{
    marginTop:20,
    marginBottom:10,
    fontSize:16,
    fontWeight:600
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
  },

  empty:{
    padding:20,
    textAlign:"center",
    color:"#6b7280"
  }

};
