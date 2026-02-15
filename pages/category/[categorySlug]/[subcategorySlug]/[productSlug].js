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
      categories(name,slug),
      subcategories(name,slug)
    `)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
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

  const [activeImg, setActiveImg] = useState(images[0]);

  const unit = product.unit_type || "kg";

  const minQty = unit === "kg" ? 40 : 1;

  const [qty, setQty] = useState(minQty);

  const options =
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

        {/* ✅ PROFESSIONAL BREADCRUMB */}
        <div style={styles.breadcrumb}>

          <Link href="/">Home</Link>

          {" / "}

          <Link href={`/category/${categorySlug}`}>
            {product.categories?.name}
          </Link>

          {" / "}

          <Link href={`/category/${categorySlug}/${subcategorySlug}`}>
            {product.subcategories?.name}
          </Link>

        </div>


        {/* IMAGE */}
        <div style={styles.imageBox}>
          <img
            src={activeImg || "/placeholder.png"}
            style={styles.image}
          />
        </div>


        {/* DETAILS */}
        <div style={styles.card}>

          {/* CATEGORY */}
          <div style={styles.category}>
            {product.categories?.name}
          </div>

          {/* PRODUCT NAME */}
          <h1 style={styles.title}>
            {product.name}
          </h1>

          {/* PRICE */}
          <div style={styles.price}>
            <FaRupeeSign />
            {product.price} / {unit.toUpperCase()}
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
          <div style={styles.details}>

            {product.subcategories?.name &&
              <Row value={product.subcategories.name} />
            }

            {product.size &&
              <Row label="Size" value={product.size} />
            }

            {product.gauge &&
              <Row label="Gauge" value={product.gauge} />
            }

            {product.weight &&
              <Row label="Weight" value={product.weight} />
            }

          </div>


          {/* QTY */}
          <div style={styles.qtyBox}>

            <select
              value={qty}
              onChange={(e)=>changeQty(e.target.value)}
              style={styles.select}
            >
              {options.map(o=>(
                <option key={o} value={o}>
                  {unit==="kg" ? `${o} KG` : `${o} Carton`}
                </option>
              ))}
            </select>

            <div style={styles.min}>
              Minimum Order: {unit==="kg" ? "40 KG" : "1 Carton"}
            </div>

          </div>


          {/* BUTTONS */}
          <div style={styles.buttons}>

            <button
              style={styles.cartBtn}
              onClick={()=>addToCart(product, qty, unit)}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <a
              href="https://wa.me/919873670361"
              target="_blank"
              rel="noreferrer"
              style={styles.whatsapp}
            >
              <FaWhatsapp /> WhatsApp
            </a>

          </div>

        </div>


        {/* ✅ PROFESSIONAL RELATED PRODUCTS */}
        {related.length > 0 && (

          <div style={styles.relatedBox}>

            <h3>Related Products</h3>

            <div style={styles.grid}>

              {related.map(product => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          </div>

        )}

      </div>
    </>
  );
}

/* ROW */

function Row({label,value}) {

  if (!label)
    return (
      <div style={styles.rowSingle}>
        {value}
      </div>
    );

  return (
    <div style={styles.row}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* STYLES */

const styles = {

  page:{
    padding:16,
    paddingBottom:90
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
    padding:12,
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
    fontWeight:600,
    marginBottom:4
  },

  title:{
    fontSize:20,
    fontWeight:700,
    lineHeight:1.3,
    marginBottom:6
  },

  price:{
    fontSize:22,
    fontWeight:800,
    color:"#0B5ED7",
    display:"flex",
    alignItems:"center",
    gap:4
  },

  badges:{
    display:"flex",
    gap:12,
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

  details:{
    marginTop:12,
    borderTop:"1px solid #E5E7EB",
    paddingTop:10
  },

  row:{
    display:"flex",
    justifyContent:"space-between",
    padding:"4px 0",
    fontSize:14
  },

  rowSingle:{
    fontSize:14,
    fontWeight:600,
    paddingBottom:4
  },

  qtyBox:{
    marginTop:14
  },

  select:{
    width:"100%",
    padding:12,
    borderRadius:10,
    border:"1px solid #E5E7EB",
    fontSize:14
  },

  min:{
    fontSize:12,
    color:"#6b7280",
    marginTop:4
  },

  buttons:{
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
    fontSize:15,
    cursor:"pointer"
  },

  whatsapp:{
    flex:1,
    padding:14,
    background:"#25D366",
    color:"#fff",
    borderRadius:12,
    textAlign:"center",
    textDecoration:"none",
    fontWeight:700,
    fontSize:15
  },

  relatedBox:{
    marginTop:24
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:16,
    alignItems:"stretch"   // ✅ important fix
  }

};

};
