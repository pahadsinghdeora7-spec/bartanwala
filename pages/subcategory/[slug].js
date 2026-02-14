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

      /* STEP 1: get subcategory */
      const { data: subcat, error: subErr } = await supabase
        .from("subcategories")
        .select("id, name")
        .eq("slug", slug)
        .single();

      if (subErr || !subcat) {

        setProducts([]);
        setSubcategory(null);
        setLoading(false);
        return;
      }

      setSubcategory(subcat);

      /* STEP 2: get products using subcategory_id */
      const { data: prod, error: prodErr } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          image,
          unit_type,
          pcs_per_carton,
          categories(name)
        `)
        .eq("subcategory_id", subcat.id)
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (prodErr) console.log(prodErr);

      setProducts(prod || []);
      setLoading(false);
    }

    loadData();

  }, [slug]);

  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let qty = 1;

    if (product.unit_type === "kg") qty = 40;
    if (product.unit_type === "pcs") qty = product.pcs_per_carton || 1;

    const exist = cart.find(i => i.id === product.id);

    if (exist) exist.qty += qty;
    else cart.push({ ...product, qty });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added");
  }

  if (loading) return <div style={{padding:20}}>Loading...</div>;

  return (
    <>
      <Head>
        <title>{subcategory?.name}</title>
      </Head>

      <div style={{padding:16}}>

        <h2>{subcategory?.name}</h2>

        {products.length === 0 && (
          <div>No products found</div>
        )}

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(2,1fr)",
          gap:16
        }}>

          {products.map(p => (

            <div key={p.id}
              style={{
                border:"1px solid #eee",
                borderRadius:12,
                padding:10
              }}>

              <Link href={`/product/${p.slug}`}>

                <img src={p.image}
                  style={{width:"100%",height:120,objectFit:"contain"}}
                />

              </Link>

              <div>{p.name}</div>

              <div>₹{p.price}</div>

              <button onClick={()=>addToCart(p)}>
                Add
              </button>

            </div>

          ))}

        </div>

      </div>
    </>
  );

                }
