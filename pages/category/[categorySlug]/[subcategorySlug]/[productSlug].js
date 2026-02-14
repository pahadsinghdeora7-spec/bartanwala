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
import { useCart } from "../../../context/CartContext";

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { categorySlug, subcategorySlug, productSlug } = params;

  /* GET PRODUCT */
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      categories(name, slug),
      subcategories(name, slug)
    `)
    .eq("slug", productSlug)
    .single();

  if (!product) return { notFound: true };

  /* GET RELATED */
  const { data: related } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      image,
      price,
      unit_type,
      categories(slug),
      subcategories(slug)
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
  const isKG = unit === "kg";
  const isCarton = unit === "pcs" || unit === "set";

  const minQty = isKG ? 40 : 1;
  const [qty, setQty] = useState(minQty);

  const dropdownOptions = isKG
    ? [40, 80, 120, 160, 200]
    : [1, 2, 3, 4, 5];

  function handleQtyChange(val) {
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
          <Link href="/">Home</Link> /
          <Link href={`/category/${categorySlug}`}>
            {product.categories?.name}
          </Link> /
          <Link href={`/category/${categorySlug}/${subcategorySlug}`}>
            {product.subcategories?.name}
          </Link> /
          <span>{product.name}</span>
        </div>

        {/* IMAGE */}
        <div style={styles.imageWrap}>
          <img src={activeImg} style={styles.mainImage} />
        </div>

        {/* DETAILS */}
        <div style={styles.card}>

          <div style={styles.category}>
            {product.categories?.name}
          </div>

          <h1 style={styles.title}>
            {product.name}
          </h1>

          <div style={styles.priceRow}>
            <FaRupeeSign />
            {product.price} / {unit.toUpperCase()}
          </div>

          <div style={styles.badges}>
            <span style={styles.stock}>
              <FaCheckCircle /> In Stock
            </span>
            <span style={styles.bulk}>
              <FaBoxOpen /> Bulk Available
            </span>
          </div>

          <div style={styles.detailsBox}>

            {product.subcategories?.name && (
              <Detail label="Subcategory" value={product.subcategories.name} />
            )}

            {product.size && (
              <Detail label="Size" value={product.size} />
            )}

            {product.gauge && (
              <Detail label="Gauge" value={product.gauge} />
            )}

            {product.weight && (
              <Detail label="Weight" value={product.weight} />
            )}

          </div>

          {/* QUANTITY */}
          <div style={styles.qtySection}>

            <select
              value={qty}
              onChange={(e) => handleQtyChange(e.target.value)}
              style={styles.select}
            >
              {dropdownOptions.map(q => (
                <option key={q} value={q}>
                  {isKG ? `${q} KG` : `${q} Carton`}
                </option>
              ))}
            </select>

            <div style={styles.minNote}>
              Minimum Order: {isKG ? "40 KG" : "1 Carton"}
            </div>

          </div>

          {/* BUTTONS */}
          <div style={styles.actionRow}>

            <button
              style={styles.cartBtn}
              onClick={() => addToCart(product, qty, unit)}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <a
              href="https://wa.me/919873670361"
              style={styles.whatsappBtn}
              target="_blank"
            >
              <FaWhatsapp /> WhatsApp
            </a>

          </div>

        </div>

        {/* RELATED */}
        {related.length > 0 && (

          <div style={styles.relatedWrap}>

            <h3>Related Products</h3>

            <div style={styles.relatedGrid}>

              {related.map(p => (

                <Link
                  key={p.id}
                  href={`/category/${p.categories?.slug}/${p.subcategories?.slug}/${p.slug}`}
                  style={styles.relatedCard}
                >
                  <img src={p.image} style={styles.relatedImage}/>
                  <div>{p.name}</div>
                </Link>

              ))}

            </div>

          </div>

        )}

      </div>
    </>
  );
}

/* DETAIL */
function Detail({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* STYLES */

const styles = {

  page:{ padding:16 },

  breadcrumb:{
    fontSize:12,
    marginBottom:10,
    color:"#6b7280"
  },

  imageWrap:{
    background:"#fff",
    padding:10,
    borderRadius:12
  },

  mainImage:{
    width:"100%",
    height:280,
    objectFit:"contain"
  },

  card:{
    background:"#fff",
    padding:16,
    borderRadius:12,
    marginTop:10
  },

  category:{
    color:"#0B5ED7",
    fontSize:12,
    fontWeight:600
  },

  title:{
    fontSize:20,
    fontWeight:700
  },

  priceRow:{
    fontSize:20,
    fontWeight:800,
    color:"#0B5ED7"
  },

  badges:{
    display:"flex",
    gap:10,
    marginTop:6
  },

  stock:{ color:"green" },
  bulk:{ color:"blue" },

  detailsBox:{
    marginTop:10
  },

  detailRow:{
    display:"flex",
    justifyContent:"space-between"
  },

  qtySection:{
    marginTop:10
  },

  select:{
    width:"100%",
    padding:10
  },

  minNote:{
    fontSize:12,
    color:"#6b7280"
  },

  actionRow:{
    display:"flex",
    gap:10,
    marginTop:10
  },

  cartBtn:{
    flex:1,
    padding:12,
    background:"#0B5ED7",
    color:"#fff",
    border:"none",
    borderRadius:8
  },

  whatsappBtn:{
    flex:1,
    padding:12,
    background:"#25D366",
    color:"#fff",
    textAlign:"center",
    borderRadius:8,
    textDecoration:"none"
  },

  relatedWrap:{
    marginTop:20
  },

  relatedGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:10
  },

  relatedCard:{
    background:"#fff",
    padding:10,
    borderRadius:10,
    textDecoration:"none",
    color:"#000"
  },

  relatedImage:{
    width:"100%",
    height:120,
    objectFit:"contain"
  }

};
