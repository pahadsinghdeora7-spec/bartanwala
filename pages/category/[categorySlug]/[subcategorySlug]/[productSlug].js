import { useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  FaWhatsapp,
  FaRupeeSign,
  FaShoppingCart,
  FaCheckCircle,
  FaBoxOpen,
  FaTimes
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

  const { data: product } = await supabase
    .from("products")
    .select(`*,categories(name,slug),subcategories(name,slug)`)
    .eq("slug", productSlug)
    .single();

  if (!product) return { notFound:true };

  if (product.categories?.slug !== categorySlug)
    return { notFound:true };

  if (product.subcategories?.slug !== subcategorySlug)
    return { notFound:true };

  const { data: related } = await supabase
    .from("products")
    .select(`*,categories(name,slug),subcategories(name,slug)`)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .eq("in_stock", true)
    .limit(10);

  return {
    props:{
      product,
      related: related || [],
      categorySlug,
      subcategorySlug
    }
  };

}


/* ================= PAGE ================= */

export default function ProductPage({
  product,
  related,
  categorySlug,
  subcategorySlug
}){

  const { addToCart } = useCart();

  /* IMAGE LIST */
  const images = [
    product.image,
    product.image1,
    product.image2,
    product.image3
  ].filter(Boolean);

  const [index,setIndex] = useState(0);
  const [showViewer,setShowViewer] = useState(false);

  const startX = useRef(0);

  const activeImg = images[index] || "/placeholder.png";

  const unit = product.unit_type || "kg";

  const minQty = unit==="kg"?40:1;

  const [qty,setQty]=useState(minQty);

  const qtyOptions = unit==="kg"
    ? [40,80,120,160,200]
    : [1,2,3,4,5];


  /* SWIPE START */
  function touchStart(e){
    startX.current = e.touches[0].clientX;
  }

  /* SWIPE END */
  function touchEnd(e){

    const endX = e.changedTouches[0].clientX;

    if(startX.current - endX > 50){
      nextImage();
    }

    if(endX - startX.current > 50){
      prevImage();
    }

  }

  function nextImage(){
    setIndex((prev)=>
      prev === images.length-1 ? 0 : prev+1
    );
  }

  function prevImage(){
    setIndex((prev)=>
      prev === 0 ? images.length-1 : prev-1
    );
  }


  return(

<>
<Head>
<title>{product.name}</title>
</Head>


<div style={styles.page}>


{/* IMAGE */}

<div style={styles.imageBox}>

<img
src={activeImg}
style={styles.image}
onClick={()=>setShowViewer(true)}
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
<FaRupeeSign/>
{product.price}
<span style={styles.unit}>
/ {unit.toUpperCase()}
</span>
</div>

<div style={styles.badges}>
<span style={styles.stock}>
<FaCheckCircle/> In Stock
</span>
<span style={styles.bulk}>
<FaBoxOpen/> Bulk Available
</span>
</div>

</div>



{/* RELATED */}

<div style={styles.relatedBox}>

<h3>Related Products</h3>

<div style={styles.grid}>

{related.map(p=>(
<ProductCard key={p.id} product={p}/>
))}

</div>

</div>



{/* ================= IMAGE VIEWER ================= */}

{showViewer && (

<div
style={styles.viewer}
onTouchStart={touchStart}
onTouchEnd={touchEnd}
>

<button
style={styles.closeBtn}
onClick={()=>setShowViewer(false)}
>
<FaTimes/>
</button>

<img
src={activeImg}
style={styles.viewerImage}
/>

</div>

)}


</div>
</>
);
}



/* ================= STYLES ================= */

const styles={

page:{
padding:16,
background:"#F3F4F6",
minHeight:"100vh"
},

imageBox:{
background:"#fff",
padding:16,
borderRadius:16
},

image:{
width:"100%",
height:300,
objectFit:"contain",
cursor:"zoom-in"
},

card:{
background:"#fff",
padding:16,
borderRadius:16,
marginTop:12
},

category:{
color:"#0B5ED7",
fontWeight:600
},

title:{
fontSize:20,
fontWeight:700
},

price:{
fontSize:22,
fontWeight:800,
color:"#0B5ED7"
},

unit:{
fontSize:14,
color:"#6b7280"
},

badges:{
display:"flex",
gap:12,
marginTop:8
},

stock:{color:"green"},
bulk:{color:"#0B5ED7"},

relatedBox:{
marginTop:24
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:16
},



/* VIEWER */

viewer:{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"#fff",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:9999
},

viewerImage:{
maxWidth:"100%",
maxHeight:"100%",
objectFit:"contain"
},

closeBtn:{
position:"absolute",
top:20,
right:20,
background:"#000",
color:"#fff",
border:"none",
borderRadius:"50%",
width:40,
height:40,
fontSize:18
}

};
