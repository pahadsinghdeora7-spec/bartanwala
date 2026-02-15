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

  const images = [
    product.image,
    product.image1,
    product.image2,
    product.image3
  ].filter(Boolean);

  const [imgIndex,setImgIndex] = useState(0);
  const [viewer,setViewer] = useState(false);

  const startX = useRef(0);

  const activeImg = images[imgIndex] || "/placeholder.png";

  const unit = product.unit_type || "kg";

  const minQty = unit==="kg"?40:1;

  const [qty,setQty] = useState(minQty);

  const qtyOptions =
    unit==="kg"
    ? [40,80,120,160,200]
    : [1,2,3,4,5];



/* SWIPE */
function touchStart(e){
startX.current=e.touches[0].clientX;
}

function touchEnd(e){

const endX=e.changedTouches[0].clientX;

if(startX.current-endX>50)
next();

if(endX-startX.current>50)
prev();

}

function next(){
setImgIndex(prev=>prev===images.length-1?0:prev+1);
}

function prev(){
setImgIndex(prev=>prev===0?images.length-1:prev-1);
}



/* ================= UI ================= */

return(

<>
<Head>
<title>{product.name}</title>
</Head>


<div style={styles.page}>


{/* IMAGE CARD */}

<div style={styles.imageCard}>

<img
src={activeImg}
style={styles.image}
onClick={()=>setViewer(true)}
/>

</div>



{/* PRODUCT DETAILS */}

<div style={styles.detailsCard}>

<div style={styles.category}>
{product.categories?.name}
</div>

<h1 style={styles.title}>
{product.name}
</h1>

<div style={styles.priceRow}>
<FaRupeeSign/>
{product.price}
<span style={styles.unit}>
/ {unit.toUpperCase()}
</span>
</div>


{/* BADGES */}

<div style={styles.badges}>

<span style={styles.stock}>
<FaCheckCircle/> In Stock
</span>

<span style={styles.bulk}>
<FaBoxOpen/> Bulk Available
</span>

</div>



{/* SPECIFICATIONS */}

<div style={styles.specBox}>

{product.subcategories?.name &&
<Spec label="Subcategory" value={product.subcategories.name}/>
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



{/* QTY */}

<div style={styles.qtyBox}>

<select
value={qty}
onChange={(e)=>setQty(Number(e.target.value))}
style={styles.select}
>

{qtyOptions.map(q=>(
<option key={q} value={q}>
{unit==="kg"?`${q} KG`:`${q} Carton`}
</option>
))}

</select>

<div style={styles.minNote}>
Minimum Order: {unit==="kg"?"40 KG":"1 Carton"}
</div>

</div>



{/* BUTTONS */}

<div style={styles.btnRow}>

<button
style={styles.cartBtn}
onClick={()=>addToCart(product,qty,unit)}
>
<FaShoppingCart/>
Add to Cart
</button>

<a
href="https://wa.me/919873670361"
target="_blank"
style={styles.whatsappBtn}
>
<FaWhatsapp/>
WhatsApp
</a>

</div>

</div>



{/* RELATED */}

<div style={styles.relatedBox}>

<h3 style={styles.relatedTitle}>
Related Products
</h3>

<div style={styles.grid}>

{related.map(p=>(
<ProductCard key={p.id} product={p}/>
))}

</div>

</div>



{/* FULLSCREEN VIEWER */}

{viewer && (

<div
style={styles.viewer}
onTouchStart={touchStart}
onTouchEnd={touchEnd}
>

<button
style={styles.close}
onClick={()=>setViewer(false)}
>
<FaTimes/>
</button>

<img
src={activeImg}
style={styles.viewerImg}
/>

</div>

)}

</div>

</>

);

}



/* SPEC */

function Spec({label,value}){

return(
<div style={styles.specRow}>
<span>{label}</span>
<span>{value}</span>
</div>
);

}



/* ================= STYLES ================= */

const styles={

page:{
padding:16,
background:"#F3F4F6"
},

imageCard:{
background:"#fff",
padding:16,
borderRadius:16,
border:"1px solid #E5E7EB"
},

image:{
width:"100%",
height:280,
objectFit:"contain",
cursor:"zoom-in"
},

detailsCard:{
background:"#fff",
padding:16,
borderRadius:16,
marginTop:12,
border:"1px solid #E5E7EB"
},

category:{
color:"#0B5ED7",
fontWeight:600
},

title:{
fontSize:20,
fontWeight:700,
marginTop:6
},

priceRow:{
fontSize:24,
fontWeight:800,
color:"#0B5ED7",
display:"flex",
gap:6
},

unit:{
fontSize:14,
color:"#6b7280"
},

badges:{
display:"flex",
gap:14,
marginTop:10
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
marginTop:14,
borderTop:"1px solid #E5E7EB",
paddingTop:10
},

specRow:{
display:"flex",
justifyContent:"space-between",
padding:"6px 0"
},

qtyBox:{
marginTop:14
},

select:{
width:"100%",
padding:12,
borderRadius:10
},

minNote:{
fontSize:12,
color:"#6b7280",
marginTop:4
},

btnRow:{
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
fontWeight:700
},

whatsappBtn:{
flex:1,
padding:14,
background:"#25D366",
color:"#fff",
borderRadius:12,
textAlign:"center",
fontWeight:700
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
justifyContent:"center",
alignItems:"center",
zIndex:9999
},

viewerImg:{
maxWidth:"100%",
maxHeight:"100%"
},

close:{
position:"absolute",
top:20,
right:20,
background:"#000",
color:"#fff",
border:"none",
borderRadius:"50%",
width:40,
height:40
}

};
