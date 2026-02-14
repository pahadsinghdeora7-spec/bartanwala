import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

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

  /* STEP 1: GET SUBCATEGORY */
  const { data: subcat, error: subErr } = await supabase
    .from("subcategories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (subErr || !subcat) {

    console.log("Subcategory not found:", slug);

    setProducts([]);
    setLoading(false);
    return;
  }

  setSubcategory(subcat);

  /* STEP 2: GET PRODUCTS */
  const { data: prodData, error: prodErr } = await supabase
    .from("products")
    .select(`
      *,
      categories(name)
    `)
    .eq("subcategory_id", subcat.id)
    .eq("in_stock", true)
    .order("id", { ascending: false });

  if (prodErr) {

    console.log("Product error:", prodErr);
  }

  console.log("Products found:", prodData);

  setProducts(prodData || []);
  setLoading(false);
}

loadData();

}, [slug]);

function addToCart(product) {

const cart = JSON.parse(localStorage.getItem("cart") || "[]");

const unit = product.unit_type || "kg";
const carton = product.pcs_per_carton || 1;

let qty = unit === "kg" ? 40 : carton;

const existing = cart.find(i => i.id === product.id);

if (existing) existing.qty += qty;
else cart.push({ ...product, qty });

localStorage.setItem("cart", JSON.stringify(cart));

alert("Added to cart");

}

if (loading) {

return <div style={{ padding: 20 }}>Loading...</div>;

}

return (
<>
<Head>
<title>{subcategory?.name}</title>
</Head>

  <div style={{ padding: 16 }}>

    <h1>{subcategory?.name}</h1>

    {products.length === 0 && (
      <div>No products found</div>
    )}

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: 16
    }}>

      {products.map(p => (

        <div key={p.id}
          style={{
            background:"#fff",
            borderRadius:12,
            padding:10
          }}>

          <Link href={`/product/${p.slug}`}>

            <img
              src={p.image}
              style={{
                width:"100%",
                height:140,
                objectFit:"contain"
              }}
            />

          </Link>

          <div>{p.name}</div>

          <div>
            ₹{p.price}/{p.unit_type}
          </div>

          <button
            onClick={()=>addToCart(p)}
            style={{
              width:"100%",
              marginTop:10
            }}
          >
            Add to cart
          </button>

        </div>

      ))}

    </div>

  </div>
</>

);

}
