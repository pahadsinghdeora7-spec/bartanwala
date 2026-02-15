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
  FaTruck,
  FaShieldAlt
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

  if (product.categories?.slug !== categorySlug)
    return { notFound: true };

  if (product.subcategories?.slug !== subcategorySlug)
    return { notFound: true };


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



        {/* IMAGE CARD */}

        <div style={styles.imageCard}>

          <img
            src={activeImg}
            style={styles.image}
            onError={(e)=>{
              e.target.src="/placeholder.png";
            }}
          />

        </div>



        {/* PRODUCT INFO CARD */}

        <div style={styles.infoCard}>


          <div style={styles.category}>
            {product.categories?.name}
          </div>


          <h1 style={styles.title}>
            {product.name}
          </h1>



          {/* PRICE BOX */}

          <div style={styles.priceBox}>

            <div style={styles.price}>

              <FaRupeeSign />

              {product.price}

              <span style={styles.unit}>
                / {unit.toUpperCase()}
              </span>

            </div>


            <div style={styles.taxNote}>
              GST Included
            </div>

          </div>



          {/* BADGES */}

          <div style={styles.badges}>

            <div style={styles.badgeGreen}>
              <FaCheckCircle />
              In Stock
            </div>

            <div style={styles.badgeBlue}>
              <FaBoxOpen />
              Bulk Available
            </div>

            <div style={styles.badgeGray}>
              <FaTruck />
              All India Delivery
            </div>

            <div style={styles.badgeGray}>
              <FaShieldAlt />
              Trusted Supplier
            </div>

          </div>



          {/* SPEC TABLE */}

          <div style={styles.specCard}>

            <div style={styles.specTitle}>
              Product Details
            </div>


            {product.subcategories?.name &&
              <SpecRow label="Subcategory" value={product.subcategories.name}/>
            }

            {product.size &&
              <SpecRow label="Size" value={product.size}/>
            }

            {product.gauge &&
              <SpecRow label="Gauge" value={product.gauge}/>
            }

            {product.weight &&
              <SpecRow label="Weight" value={product.weight}/>
            }

          </div>



          {/* QTY */}

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

function SpecRow({label,value}) {

  return (
    <div style={styles.specRow}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

}



/* ================= PREMIUM STYLES ================= */

const styles = {


page:{
padding:16,
paddingBottom:100
},


breadcrumb:{
fontSize:13,
marginBottom:14,
color:"#6b7280",
display:"flex",
gap:6,
flexWrap:"wrap"
},


imageCard:{
background:"#fff",
padding:20,
borderRadius:16,
boxShadow:"0 4px 20px rgba(0,0,0,0.08)"
},


image:{
width:"100%",
height:300,
objectFit:"contain"
},


infoCard:{
background:"#fff",
padding:18,
borderRadius:16,
marginTop:14,
boxShadow:"0 4px 20px rgba(0,0,0,0.08)"
},


category:{
color:"#0B5ED7",
fontWeight:600,
fontSize:13
},


title:{
fontSize:22,
fontWeight:700,
marginTop:4,
lineHeight:1.3
},


priceBox:{
marginTop:10
},


price:{
fontSize:26,
fontWeight:800,
color:"#0B5ED7",
display:"flex",
alignItems:"center",
gap:4
},


unit:{
fontSize:14,
color:"#6b7280"
},


taxNote:{
fontSize:12,
color:"#16a34a"
},


badges:{
display:"flex",
flexWrap:"wrap",
gap:8,
marginTop:12
},


badgeGreen:{
background:"#dcfce7",
color:"#166534",
padding:"6px 10px",
borderRadius:8,
fontSize:12,
display:"flex",
gap:6,
alignItems:"center"
},


badgeBlue:{
background:"#dbeafe",
color:"#1e40af",
padding:"6px 10px",
borderRadius:8,
fontSize:12,
display:"flex",
gap:6,
alignItems:"center"
},


badgeGray:{
background:"#f3f4f6",
color:"#374151",
padding:"6px 10px",
borderRadius:8,
fontSize:12,
display:"flex",
gap:6,
alignItems:"center"
},


specCard:{
marginTop:14,
borderTop:"1px solid #E5E7EB",
paddingTop:10
},


specTitle:{
fontWeight:700,
marginBottom:6
},


specRow:{
display:"flex",
justifyContent:"space-between",
padding:"6px 0",
fontSize:14
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
marginTop:26
},


relatedTitle:{
marginBottom:12
},


grid:{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:16
}


};
