import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

/* SUPABASE */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubcategoryProductsPage() {

  const router = useRouter();
  const { slug } = router.query;

  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!slug) return;

    async function loadData() {

      setLoading(true);

      /* DIRECT JOIN QUERY */
      const { data, error } = await supabase
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
          subcategories (
            id,
            name,
            slug
          ),
          categories (
            name
          )
        `)
        .eq("subcategories.slug", slug)
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }

      setProducts(data || []);

      if (data && data.length > 0) {
        setSubcategory(data[0].subcategories);
      }

      setLoading(false);
    }

    loadData();

  }, [slug]);

  /* ADD TO CART */
  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const carton = product.pcs_per_carton || 1;

    let qty = 1;

    if (unit === "kg") qty = 40;
    if (unit === "pcs" || unit === "set") qty = carton;

    const exist = cart.find(i => i.id === product.id);

    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({ ...product, qty, unit });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");

  }

  if (loading) return <div style={{padding:20}}>Loading...</div>;

  return (
    <>
      <Head>
        <title>{subcategory?.name || "Products"} | Bartanwala</title>
      </Head>

      <main style={styles.main}>

        <h1 style={styles.heading}>
          {subcategory?.name}
        </h1>

        {products.length === 0 && (
          <div>No products found</div>
        )}

        <div style={styles.grid}>

          {products.map(p => {

            const unit = p.unit_type || "kg";

            return (

              <div key={p.id} style={styles.card}>

                <Link href={`/product/${p.slug}`}>

                  <div style={styles.imageSection}>

                    {p.image ? (
                      <img src={p.image} style={styles.image} />
                    ) : (
                      <div>No Image</div>
                    )}

                  </div>

                </Link>

                <div style={styles.detailsSection}>

                  <div style={styles.badge}>
                    {p.categories?.name}
                  </div>

                  <div style={styles.name}>
                    {p.name}
                  </div>

                  <div style={styles.price}>
                    ₹ {p.price} / {unit}
                  </div>

                </div>

                <div style={styles.cartSection}>
                  <button
                    style={styles.cartBtn}
                    onClick={() => addToCart(p)}
                  >
                    <FaShoppingCart /> Add
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

/* STYLES */

const styles = {

main:{padding:16},

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
border:"1px solid #eee",
borderRadius:12,
overflow:"hidden"
},

imageSection:{
height:150,
display:"flex",
alignItems:"center",
justifyContent:"center"
},

image:{
maxWidth:"100%",
maxHeight:"100%"
},

detailsSection:{
padding:12
},

badge:{
fontSize:11,
color:"#0B5ED7"
},

name:{
fontWeight:600
},

price:{
fontWeight:700
},

cartSection:{
padding:10
},

cartBtn:{
width:"100%",
background:"#0B5ED7",
color:"#fff",
border:"none",
padding:10,
borderRadius:8
}

};
