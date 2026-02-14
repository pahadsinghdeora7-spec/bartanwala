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

  const { categorySlug, subcategorySlug } = router.query;

  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!subcategorySlug) return;

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
        console.log(error);
        setProducts([]);
        setLoading(false);
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
          categories(name),
          subcategories(name)
        `)
        .eq("subcategory_id", subcat.id)
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (prodError) console.log(prodError);

      setProducts(prodData || []);

      setLoading(false);
    }

    loadData();

  }, [subcategorySlug]);



  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const pcs = product.pcs_per_carton || 1;

    let qty = 1;

    if (unit === "kg") qty = 40;
    else qty = pcs;

    const existing = cart.find(i => i.id === product.id);

    if (existing) existing.qty += qty;
    else cart.push({ ...product, qty });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");

  }



  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;


  return (

    <>

      <Head>
        <title>
          {subcategory?.name} | Bartanwala
        </title>
      </Head>


      <main style={{ padding: 16 }}>

        <h1>{subcategory?.name}</h1>


        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16
        }}>


          {products.map(p => (

            <div key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 10
              }}>


              <Link href={`/category/${categorySlug}/${subcategorySlug}/${p.slug}`}>

                <img
                  src={p.image}
                  style={{ width: "100%", height: 140, objectFit: "contain" }}
                />

              </Link>


              <div style={{ fontSize: 12, color: "#0B5ED7" }}>
                {p.categories?.name}
              </div>


              <div style={{ fontWeight: 700 }}>
                {p.name}
              </div>


              <div>
                ₹ {p.price} / {p.unit_type}
              </div>


              <button
                onClick={() => addToCart(p)}
                style={{
                  marginTop: 8,
                  width: "100%",
                  background: "#0B5ED7",
                  color: "#fff",
                  border: "none",
                  padding: 8,
                  borderRadius: 8
                }}
              >

                <FaShoppingCart /> Add to Cart

              </button>


            </div>

          ))}


        </div>


      </main>


    </>
  );
}
