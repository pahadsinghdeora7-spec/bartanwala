import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

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
          id,
          name,
          slug,
          price,
          image,
          unit_type,
          pcs_per_carton,
          categories(slug,name),
          subcategories(slug,name)
        `)
        .eq("category_id", cat.id)
        .eq("in_stock", true)
        .order("created_at", { ascending:false });

      setProducts(prods || []);

      setLoading(false);

    }

    loadData();

  }, [categorySlug]);


  /* ADD CART */

  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const pcs = product.pcs_per_carton || 1;

    const qty = unit === "kg" ? 40 : pcs;

    const existing = cart.find(i => i.id === product.id);

    if (existing) existing.qty += qty;
    else cart.push({ ...product, qty, unit });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");

  }


  if (loading) return <div style={{padding:20}}>Loading...</div>;


  return (

    <>
      <Head>
        <title>{category?.name} | Bartanwala</title>
      </Head>

      <main style={styles.main}>

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

            <div style={styles.grid}>

              {products.map(p => {

                const unit = p.unit_type || "kg";
                const pcs = p.pcs_per_carton || 1;

                return (

                  <div key={p.id} style={styles.card}>

                    <Link
                      href={`/category/${p.categories?.slug}/${p.subcategories?.slug}/${p.slug}`}
                    >

                      <div style={styles.imageSection}>

                        <img
                          src={p.image || "/placeholder.png"}
                          style={styles.image}
                        />

                      </div>

                    </Link>


                    <div style={styles.detailsSection}>

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

                      {/* PRICE */}
                      <div style={styles.price}>
                        ₹ {p.price} / {unit.toUpperCase()}
                      </div>

                      {/* MIN */}
                      <div style={styles.min}>
                        {unit==="kg"
                          ? "Min Order: 40 KG"
                          : `1 Carton = ${pcs}`
                        }
                      </div>

                    </div>


                    <div style={styles.cartSection}>

                      <button
                        style={styles.cartBtn}
                        onClick={()=>addToCart(p)}
                      >
                        <FaShoppingCart/> Add
                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          </>
        )}

      </main>

    </>
  );
}


/* STYLES */

const styles = {

  main:{ padding:16 },

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
    color:"#000"
  },

  card:{
    background:"#fff",
    borderRadius:12
  },

  imageSection:{
    height:140,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  image:{
    maxWidth:"100%",
    maxHeight:"100%"
  },

  detailsSection:{
    padding:10
  },

  category:{
    fontSize:12,
    color:"#0B5ED7"
  },

  subcategory:{
    fontSize:12,
    color:"#6b7280"
  },

  name:{
    fontWeight:700
  },

  price:{
    color:"#0B5ED7",
    fontWeight:700
  },

  min:{
    fontSize:12
  },

  cartSection:{
    padding:10
  },

  cartBtn:{
    width:"100%",
    padding:10,
    background:"#0B5ED7",
    color:"#fff",
    border:"none"
  }

};
