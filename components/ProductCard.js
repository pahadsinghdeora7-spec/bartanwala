import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductCard({ product }) {

  function addToCart() {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const pcs = product.pcs_per_carton || 1;

    let qty = unit === "kg" ? 40 : pcs;

    const existing = cart.find(i => i.id === product.id);

    if (existing) existing.qty += qty;
    else cart.push({ ...product, qty, unit });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart");
  }

  const unit = product.unit_type || "kg";
  const pcs = product.pcs_per_carton || 1;

  const categorySlug = product.categories?.slug;
  const subcategorySlug = product.subcategories?.slug;

  const productUrl =
    categorySlug && subcategorySlug
      ? `/category/${categorySlug}/${subcategorySlug}/${product.slug}`
      : "#";

  return (
    <div style={styles.card}>

      {/* IMAGE */}
      <Link href={productUrl}>
        <div style={styles.imageSection}>
          <img
            src={product.image || "/placeholder.png"}
            style={styles.image}
          />
        </div>
      </Link>

      {/* DETAILS */}
      <div style={styles.details}>

        {/* CATEGORY */}
        <div style={styles.category}>
          {product.categories?.name}
        </div>

        {/* PRODUCT NAME */}
        <Link href={productUrl} style={{ textDecoration:"none", color:"#000" }}>
          <div style={styles.name}>
            {product.name}
          </div>
        </Link>

        {/* SUBCATEGORY */}
        <div style={styles.subcategory}>
          {product.subcategories?.name}
        </div>

        {/* SIZE / GAUGE */}
        {(product.size || product.gauge) && (
          <div style={styles.meta}>
            {product.size && `Size: ${product.size}`}
            {product.size && product.gauge && " | "}
            {product.gauge && `Gauge: ${product.gauge}`}
          </div>
        )}

        {/* PRICE */}
        <div style={styles.price}>
          ₹ {product.price}
          <span style={styles.unit}> / {unit.toUpperCase()}</span>
        </div>

        {/* MIN ORDER */}
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

      {/* BUTTON */}
      <div style={styles.cartWrap}>
        <button onClick={addToCart} style={styles.cartBtn}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>

    </div>
  );
}

const styles = {

  card:{
    background:"#fff",
    borderRadius:16,
    border:"1px solid #E5E7EB",
    display:"flex",
    flexDirection:"column",
    overflow:"hidden"
  },

  imageSection:{
    height:160,
    background:"#f9fafb",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },

  image:{
    maxWidth:"100%",
    maxHeight:"100%",
    objectFit:"contain"
  },

  details:{
    padding:12,
    display:"flex",
    flexDirection:"column",
    gap:4,
    flex:1
  },

  category:{
    fontSize:11,
    color:"#0B5ED7",
    fontWeight:600
  },

  name:{
    fontSize:14,
    fontWeight:700,
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
    color:"#0B5ED7"
  },

  unit:{
    fontSize:12,
    color:"#6b7280"
  },

  min:{
    fontSize:11,
    background:"#f3f4f6",
    padding:"4px 8px",
    borderRadius:6
  },

  cartWrap:{
    padding:10,
    borderTop:"1px solid #E5E7EB"
  },

  cartBtn:{
    width:"100%",
    padding:10,
    background:"#0B5ED7",
    color:"#fff",
    border:"none",
    borderRadius:8
  }

};
