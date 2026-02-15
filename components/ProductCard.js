import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductCard({ product }) {

  /* ================= ADD TO CART ================= */

  function addToCart(e) {

    e.stopPropagation();

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const pcs = product.pcs_per_carton || 1;

    const qty = unit === "kg" ? 40 : pcs;

    const existing = cart.find(i => i.id === product.id);

    if (existing)
      existing.qty += qty;
    else
      cart.push({
        ...product,
        qty,
        unit
      });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart");

  }


  /* ================= URL ================= */

  const categorySlug = product.categories?.slug;
  const subcategorySlug = product.subcategories?.slug;
  const productSlug = product.slug;

  const productUrl =
    categorySlug && subcategorySlug && productSlug
      ? `/category/${categorySlug}/${subcategorySlug}/${productSlug}`
      : "#";


  const unit = product.unit_type || "kg";
  const pcs = product.pcs_per_carton || 1;


  /* ================= UI ================= */

  return (

    <div style={styles.card}>


      {/* CLICKABLE AREA */}
      <Link href={productUrl} style={styles.link}>


        {/* IMAGE */}
        <div style={styles.imageSection}>

          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            style={styles.image}
          />

        </div>


        {/* DETAILS */}
        <div style={styles.details}>


          <div style={styles.category}>
            {product.categories?.name}
          </div>


          <div style={styles.name}>
            {product.name}
          </div>


          <div style={styles.subcategory}>
            {product.subcategories?.name}
          </div>


          {(product.size || product.gauge) && (

            <div style={styles.meta}>

              {product.size && `Size: ${product.size}`}

              {product.size && product.gauge && " | "}

              {product.gauge && `Gauge: ${product.gauge}`}

            </div>

          )}


          <div style={styles.price}>

            ₹ {product.price}

            <span style={styles.unit}>
              {" "} / {unit.toUpperCase()}
            </span>

          </div>


          {unit === "kg" && (
            <div style={styles.min}>
              Min Order: 40 KG
            </div>
          )}


          {(unit === "pcs" || unit === "set") && (
            <div style={styles.min}>
              1 Carton = {pcs}
            </div>
          )}


        </div>

      </Link>


      {/* CART BUTTON */}
      <div style={styles.cartWrap}>

        <button
          onClick={addToCart}
          style={styles.cartBtn}
        >
          <FaShoppingCart />
          Add to Cart
        </button>

      </div>


    </div>

  );

}


/* ================= STYLES ================= */

const styles = {

  card:{
    background:"#fff",
    borderRadius:18,
    border:"1px solid #E5E7EB",
    display:"flex",
    flexDirection:"column",
    overflow:"hidden",
    boxShadow:"0 6px 16px rgba(0,0,0,0.05)"
  },

  link:{
    textDecoration:"none",
    color:"inherit"
  },

  imageSection:{
    height:160,
    background:"#f9fafb",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    padding:12
  },

  image:{
    maxWidth:"100%",
    maxHeight:"100%",
    objectFit:"contain"
  },

  details:{
    padding:14,
    display:"flex",
    flexDirection:"column",
    gap:4,
    flex:1
  },

  category:{
    fontSize:11,
    fontWeight:600,
    color:"#0B5ED7"
  },

  name:{
    fontSize:14,
    fontWeight:700,
    lineHeight:1.3,
    display:"-webkit-box",
    WebkitLineClamp:2,
    WebkitBoxOrient:"vertical",
    overflow:"hidden",
    minHeight:36
  },

  subcategory:{
    fontSize:12,
    color:"#6b7280"
  },

  meta:{
    fontSize:12,
    color:"#6b7280"
  },

  price:{
    fontSize:18,
    fontWeight:800,
    color:"#0B5ED7",
    marginTop:4
  },

  unit:{
    fontSize:12,
    color:"#6b7280"
  },

  min:{
    fontSize:11,
    background:"#F3F4F6",
    padding:"6px 8px",
    borderRadius:8,
    marginTop:4
  },

  cartWrap:{
    padding:12,
    borderTop:"1px solid #E5E7EB"
  },

  cartBtn:{
    width:"100%",
    background:"linear-gradient(135deg,#0B5ED7,#084298)",
    color:"#fff",
    border:"none",
    borderRadius:12,
    padding:"10px",
    fontWeight:700,
    cursor:"pointer",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    gap:6
  }

};
