import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductCard({ product }) {

  function addToCart() {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const pcsPerCarton = product.pcs_per_carton || 1;

    let qty = 1;

    if (unit === "kg") qty = 40;
    if (unit === "pcs" || unit === "set") qty = pcsPerCarton;

    const existing = cart.find(i => i.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        ...product,
        qty,
        unit
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart");

  }

  const unit = product.unit_type || "kg";
  const pcsPerCarton = product.pcs_per_carton || 1;

  return (

    <div style={styles.card}>

      {/* IMAGE */}
      <Link href={`/product/${product.slug}`}>

        <div style={styles.imageSection}>

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.noImage}>
              No Image
            </div>
          )}

        </div>

      </Link>


      {/* DETAILS */}
      <div style={styles.detailsSection}>


        {/* ✅ MAIN CATEGORY */}
        <div style={styles.category}>
          {product.categories?.name}
        </div>


        {/* ✅ PRODUCT NAME */}
        <div style={styles.name}>
          {product.name}
        </div>


        {/* ✅ SUBCATEGORY */}
        <div style={styles.subcategory}>
          {product.subcategories?.name}
        </div>


        {/* ✅ SIZE AND GAUGE */}
        {(product.size || product.gauge) && (
          <div style={styles.meta}>
            {product.size && <span>Size: {product.size}</span>}
            {product.size && product.gauge && <span> | </span>}
            {product.gauge && <span>Gauge: {product.gauge}</span>}
          </div>
        )}


        {/* PRICE */}
        <div style={styles.price}>
          ₹ {product.price}
          <span style={styles.unit}>
            {" "} / {unit.toUpperCase()}
          </span>
        </div>


        {/* MIN ORDER */}
        {unit === "kg" && (
          <div style={styles.minBox}>
            Min Order: 40 KG
          </div>
        )}

        {(unit === "pcs" || unit === "set") && (
          <div style={styles.minBox}>
            1 Carton = {pcsPerCarton} {unit.toUpperCase()}
          </div>
        )}

      </div>


      {/* BUTTON */}
      <div style={styles.cartSection}>

        <button
          style={styles.cartBtn}
          onClick={addToCart}
        >
          <FaShoppingCart /> Add to Cart
        </button>

      </div>

    </div>

  );

}


/* ================= STYLES ================= */

const styles = {

  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  },

  imageSection: {
    height: 160,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  noImage: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  detailsSection: {
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },


  /* MAIN CATEGORY */
  category: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0B5ED7",
  },


  /* PRODUCT NAME 2 LINE */
  name: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.3,

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",

    minHeight: 36,
  },


  /* SUBCATEGORY */
  subcategory: {
    fontSize: 12,
    color: "#6b7280",
  },


  /* SIZE GAUGE */
  meta: {
    fontSize: 12,
    color: "#6b7280",
  },


  price: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0B5ED7",
    marginTop: 4,
  },

  unit: {
    fontSize: 12,
    color: "#6b7280",
  },


  minBox: {
    fontSize: 11,
    background: "#F3F4F6",
    padding: "6px 8px",
    borderRadius: 8,
    marginTop: 4,
  },


  cartSection: {
    padding: 12,
    borderTop: "1px solid #E5E7EB",
  },


  cartBtn: {
    width: "100%",
    background: "linear-gradient(135deg,#0B5ED7,#084298)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px",
    fontWeight: 700,
    cursor: "pointer",
  },

};
