import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  FaWhatsapp,
  FaRupeeSign,
  FaShoppingCart,
  FaCheckCircle,
  FaBoxOpen,
} from "react-icons/fa";

import { useCart } from "../../../../context/CartContext";
import ProductCard from "../../../../components/ProductCard";


/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { categorySlug, subcategorySlug, productSlug } = params;

  /* GET PRODUCT */
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name, slug),
      subcategories(name, slug)
    `)
    .eq("slug", productSlug)
    .single();

  if (error || !product)
    return { notFound: true };

  /* VALIDATE URL */
  if (product.categories?.slug !== categorySlug)
    return { notFound: true };

  if (product.subcategories?.slug !== subcategorySlug)
    return { notFound: true };


  /* GET RELATED PRODUCTS */
  const { data: related } = await supabase
    .from("products")
    .select(`
      *,
      categories(name, slug),
      subcategories(name, slug)
    `)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .eq("in_stock", true)
    .limit(10);

  return {
    props: {
      product,
      related: related || [],
      categorySlug,
      subcategorySlug,
    },
  };

}


/* ================= PAGE ================= */

export default function ProductPage({
  product,
  related,
  categorySlug,
  subcategorySlug,
}) {

  const { addToCart } = useCart();

  /* IMAGE LIST */
  const images = [
    product.image,
    product.image1,
    product.image2,
    product.image3,
  ].filter(Boolean);

  const [activeImg, setActiveImg] = useState(
    images[0] || "/placeholder.png"
  );

  const unit = product.unit_type || "kg";

  const minQty = unit === "kg" ? 40 : 1;

  const [qty, setQty] = useState(minQty);

  const qtyOptions =
    unit === "kg"
      ? [40, 80, 120, 160, 200]
      : [1, 2, 3, 4, 5];


  function changeQty(val) {

    const num = Number(val);

    setQty(num < minQty ? minQty : num);

  }


  /* ================= UI ================= */

  return (

    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
      </Head>


      <div style={styles.page}>


        {/* BREADCRUMB */}

        <div style={styles.breadcrumb}>

          <Link href="/">Home</Link>

          <span>/</span>

          <Link href={`/category/${categorySlug}`}>
            {product.categories?.name}
          </Link>

          <span>/</span>

          <Link href={`/category/${categorySlug}/${subcategorySlug}`}>
            {product.subcategories?.name}
          </Link>

        </div>



        {/* IMAGE */}

        <div style={styles.imageBox}>

          <img
            src={activeImg}
            style={styles.image}
            onError={(e)=>{
              e.target.src="/placeholder.png";
            }}
          />

        </div>



        {/* DETAILS */}

        <div style={styles.card}>


          <div style={styles.category}>
            {product.categories?.name}
          </div>


          <h1 style={styles.title}>
            {product.name}
          </h1>


          <div style={styles.price}>
            <FaRupeeSign />
            {product.price}
            <span style={styles.unit}>
              / {unit.toUpperCase()}
            </span>
          </div>



          {/* BADGES */}

          <div style={styles.badges}>

            <span style={styles.stock}>
              <FaCheckCircle /> In Stock
            </span>

            <span style={styles.bulk}>
              <FaBoxOpen /> Bulk Available
            </span>

          </div>



          {/* SPECIFICATIONS */}

          <div style={styles.specBox}>

            {product.subcategories?.name &&
              <Spec value={product.subcategories.name}/>
            }

            {product.size &&
              <Spec label="Size" value={product.size}/>
            }

            {product.gauge &&
              <Spec label="Gauge" value={product.gauge}/>
            }

            {product.weight &&
              <Spec label="Weight" value={product.weight}/>
            }

          </div>



          {/* QUANTITY */}

          <div style={styles.qtyBox}>

            <select
              value={qty}
              onChange={(e)=>changeQty(e.target.value)}
              style={styles.select}
            >

              {qtyOptions.map(q=>(
                <option key={q} value={q}>
                  {unit==="kg"
                    ? `${q} KG`
                    : `${q} Carton`}
                </option>
              ))}

            </select>

            <div style={styles.minNote}>
              Minimum Order:
              {" "}
              {unit==="kg"
                ? "40 KG"
                : "1 Carton"}
            </div>

          </div>



          {/* BUTTONS */}

          <div style={styles.buttonRow}>

            <button
              style={styles.cartBtn}
              onClick={()=>
                addToCart(product, qty, unit)
              }
            >

              <FaShoppingCart />

              Add to Cart

            </button>


            <a
              href="https://wa.me/919873670361"
              target="_blank"
              rel="noreferrer"
              style={styles.whatsappBtn}
            >

              <FaWhatsapp />

              WhatsApp

            </a>

          </div>

        </div>



        {/* RELATED PRODUCTS */}

        {related.length > 0 && (

          <div style={styles.relatedBox}>

            <h3 style={styles.relatedTitle}>
              Related Products
            </h3>

            <div style={styles.grid}>

              {related.map(p=>(
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}

            </div>

          </div>

        )}


      </div>

    </>

  );

}


/* SPEC ROW */

function Spec({label,value}) {

  if (!label)
    return (
      <div style={styles.specSingle}>
        {value}
      </div>
    );

  return (
    <div style={styles.specRow}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

}



/* ================= STYLES ================= */

const styles = {


  page:{
    padding:16,
    paddingBottom:100
  },


  breadcrumb:{
    fontSize:13,
    marginBottom:12,
    color:"#6b7280",
    display:"flex",
    gap:6,
    flexWrap:"wrap"
  },


  imageBox:{
    background:"#fff",
    padding:14,
    borderRadius:14,
    border:"1px solid #E5E7EB"
  },


  image:{
    width:"100%",
    height:280,
    objectFit:"contain"
  },


  card:{
    background:"#fff",
    padding:16,
    borderRadius:14,
    marginTop:12,
    border:"1px solid #E5E7EB"
  },


  category:{
    color:"#0B5ED7",
    fontSize:12,
    fontWeight:600
  },


  title:{
    fontSize:20,
    fontWeight:700,
    marginTop:4,
    lineHeight:1.3
  },


  price:{
    fontSize:22,
    fontWeight:800,
    color:"#0B5ED7",
    display:"flex",
    alignItems:"center",
    gap:4,
    marginTop:6
  },


  unit:{
    fontSize:14,
    color:"#6b7280"
  },


  badges:{
    display:"flex",
    gap:14,
    marginTop:8,
    fontSize:13
  },


  stock:{
    color:"green",
    fontWeight:600
  },


  bulk:{
    color:"#0B5ED7",
    fontWeight:600
  },


  specBox:{
    marginTop:12,
    borderTop:"1px solid #E5E7EB",
    paddingTop:10
  },


  specRow:{
    display:"flex",
    justifyContent:"space-between",
    padding:"4px 0",
    fontSize:14
  },


  specSingle:{
    fontSize:14,
    fontWeight:600
  },


  qtyBox:{
    marginTop:14
  },


  select:{
    width:"100%",
    padding:12,
    borderRadius:10,
    border:"1px solid #E5E7EB"
  },


  minNote:{
    fontSize:12,
    color:"#6b7280",
    marginTop:4
  },


  buttonRow:{
    display:"flex",
    gap:12,
    marginTop:16
  },


  cartBtn:{
    flex:1,
    padding:14,
    background:"linear-gradient(135deg,#0B5ED7,#084298)",
    color:"#fff",
    border:"none",
    borderRadius:12,
    fontWeight:700,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    gap:6
  },


  whatsappBtn:{
    flex:1,
    padding:14,
    background:"#25D366",
    color:"#fff",
    borderRadius:12,
    textDecoration:"none",
    fontWeight:700,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    gap:6
  },


  relatedBox:{
    marginTop:24
  },


  relatedTitle:{
    marginBottom:12
  },


  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:16,
    alignItems:"stretch"
  }


};
