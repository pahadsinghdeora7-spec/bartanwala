import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubcategoryProductsPage() {

  const router = useRouter();

  const { categorySlug, subcategorySlug } = router.query;

  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ================= LOAD DATA ================= */

  useEffect(() => {

    if (!categorySlug || !subcategorySlug) return;

    async function loadData() {

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


      /* VALIDATE CATEGORY SLUG */
      if (subcat.categories.slug !== categorySlug) {

        router.replace("/404");

        return;
      }


      setSubcategory(subcat);


      /* GET PRODUCTS */

      const { data: prodData, error: prodError } = await supabase
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
          categories(name,slug),
          subcategories(name,slug)
        `)
        .eq("subcategory_id", subcat.id)
        .eq("in_stock", true)
        .order("created_at", { ascending:false });


      if (prodError)
        console.log("Product error:", prodError);


      setProducts(prodData || []);

      setLoading(false);

    }

    loadData();

  }, [categorySlug, subcategorySlug]);


  /* ================= ADD TO CART ================= */

  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const pcs = product.pcs_per_carton || 1;

    const qty = unit === "kg" ? 40 : pcs;

    const existing = cart.find(i => i.id === product.id);

    if (existing)
      existing.qty += qty;
    else
      cart.push({
        ...product,
        qty,
        unit
      });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");

  }


  /* ================= LOADING ================= */

  if (loading)
    return <div style={{ padding:20 }}>Loading...</div>;


  /* ================= UI ================= */

  return (

    <>
      <Head>

        <title>
          {subcategory?.name} | Bartanwala
        </title>

      </Head>


      <main style={styles.main}>


        {/* SUBCATEGORY NAME */}

        <h1 style={styles.heading}>
          {subcategory?.name}
        </h1>



        {/* PRODUCTS GRID */}

        <div style={styles.grid}>


          {products.map(p => {

            const unit = p.unit_type || "kg";
            const pcs = p.pcs_per_carton || 1;

            return (

              <div key={p.id} style={styles.card}>


                {/* IMAGE */}

                <Link
                  href={`/category/${categorySlug}/${subcategorySlug}/${p.slug}`}
                >

                  <div style={styles.imageWrap}>

                    <img
                      src={p.image || "/placeholder.png"}
                      style={styles.image}
                    />

                  </div>

                </Link>



                {/* DETAILS */}

                <div style={styles.details}>


                  {/* CATEGORY */}

                  <div style={styles.category}>
                    {p.categories?.name}
                  </div>


                  {/* PRODUCT NAME */}

                  <div style={styles.name}>
                    {p.name}
                  </div>


                  {/* SUBCATEGORY */}

                  <div style={styles.subcategory}>
                    {p.subcategories?.name}
                  </div>


                  {/* SIZE / GAUGE */}

                  {(p.size || p.gauge) && (

                    <div style={styles.meta}>

                      {p.size && `Size: ${p.size}`}

                      {p.size && p.gauge && " • "}

                      {p.gauge && `Gauge: ${p.gauge}`}

                    </div>

                  )}


                  {/* PRICE */}

                  <div style={styles.price}>
                    ₹ {p.price} / {unit.toUpperCase()}
                  </div>


                  {/* MIN */}

                  <div style={styles.min}>

                    {unit==="kg"
                      ? "Min Order: 40 KG"
                      : `1 Carton = ${pcs}`}

                  </div>


                </div>



                {/* CART BUTTON */}

                <div style={styles.cartWrap}>

                  <button
                    onClick={()=>addToCart(p)}
                    style={styles.cartBtn}
                  >

                    <FaShoppingCart/>

                    Add to Cart

                  </button>

                </div>


              </div>

            );

          })}


        </div>


      </main>


    </>

  );

}


/* ================= STYLES ================= */

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

  card:{
    background:"#fff",
    borderRadius:16,
    border:"1px solid #E5E7EB",
    overflow:"hidden"
  },

  imageWrap:{
    height:140,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"#f9fafb"
  },

  image:{
    maxWidth:"100%",
    maxHeight:"100%",
    objectFit:"contain"
  },

  details:{
    padding:12
  },

  category:{
    fontSize:12,
    color:"#0B5ED7"
  },

  name:{
    fontSize:14,
    fontWeight:700
  },

  subcategory:{
    fontSize:12,
    color:"#6b7280"
  },

  meta:{
    fontSize:12,
    color:"#6b7280"
  },

  price:{
    fontWeight:700,
    color:"#0B5ED7"
  },

  min:{
    fontSize:12
  },

  cartWrap:{
    padding:10
  },

  cartBtn:{
    width:"100%",
    padding:10,
    background:"#0B5ED7",
    color:"#fff",
    border:"none",
    borderRadius:8
  }

};
