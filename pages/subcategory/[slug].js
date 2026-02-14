import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const slug = params.slug;

  /* GET SUBCATEGORY */
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!subcategory) {
    return { notFound: true };
  }

  /* GET PRODUCTS */
  const { data: products } = await supabase
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
      categories(name)
    `)
    .eq("subcategory_id", subcategory.id)
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

  return {
    props: {
      subcategory,
      products: products || [],
    },
  };
}

/* ================= PAGE ================= */

export default function SubcategoryPage({ subcategory, products }) {

  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const carton = product.pcs_per_carton || 1;

    let qty = 1;

    if (unit === "kg") qty = 40;
    if (unit === "pcs" || unit === "set") qty = carton;

    const existing = cart.find(i => i.id === product.id);

    if (existing) existing.qty += qty;
    else cart.push({ ...product, qty, unit });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");
  }

  return (
    <>
      <Head>
        <title>{subcategory.name} | Bartanwala</title>
      </Head>

      <div style={styles.page}>

        <h1 style={styles.title}>
          {subcategory.name}
        </h1>

        <div style={styles.grid}>

          {products.map(p => {

            const unit = p.unit_type || "kg";
            const carton = p.pcs_per_carton || 1;

            return (

              <div key={p.id} style={styles.card}>

                <Link href={`/product/${p.slug}`}>
                  <div style={styles.imageWrap}>
                    <img src={p.image} style={styles.image}/>
                  </div>
                </Link>

                <div style={styles.body}>

                  <div style={styles.badge}>
                    {p.categories?.name}
                  </div>

                  <div style={styles.name}>
                    {p.name}
                  </div>

                  <div style={styles.price}>
                    ₹ {p.price} / {unit.toUpperCase()}
                  </div>

                  {unit === "kg" && (
                    <div style={styles.min}>Min Order: 40 KG</div>
                  )}

                  {(unit === "pcs" || unit === "set") && (
                    <div style={styles.min}>
                      1 Carton = {carton} PCS
                    </div>
                  )}

                </div>

                <button
                  style={styles.btn}
                  onClick={() => addToCart(p)}
                >
                  <FaShoppingCart/> Add to Cart
                </button>

              </div>

            );

          })}

        </div>

      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {

page:{padding:16},

title:{
fontSize:20,
fontWeight:700,
marginBottom:14
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:16
},

card:{
background:"#fff",
borderRadius:14,
border:"1px solid #eee",
overflow:"hidden"
},

imageWrap:{
height:150,
display:"flex",
alignItems:"center",
justifyContent:"center"
},

image:{
maxWidth:"100%",
maxHeight:"100%"
},

body:{
padding:12
},

badge:{
fontSize:10,
background:"#E0EDFF",
color:"#0B5ED7",
padding:"4px 8px",
borderRadius:20,
display:"inline-block"
},

name:{
fontWeight:600,
fontSize:14,
marginTop:6,
minHeight:38
},

price:{
fontSize:16,
fontWeight:700,
color:"#0B5ED7",
marginTop:6
},

min:{
fontSize:11,
background:"#f3f3f3",
padding:6,
borderRadius:6,
marginTop:4
},

btn:{
width:"100%",
padding:10,
background:"#0B5ED7",
color:"#fff",
border:"none",
fontWeight:700
}

};
