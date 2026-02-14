import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductCard({ product }) {

  const unit = product.unit_type || "kg";
  const cartonSize = product.pcs_per_carton || 1;

  function addToCart() {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let qty = 1;

    if (unit === "kg") qty = 40;
    if (unit === "pcs" || unit === "set") qty = cartonSize;

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

  return (

    <div style={styles.card}>

      {/* IMAGE */}
      <Link href={`/product/${product.slug}`}>

        <div style={styles.imageSection}>

          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            style={styles.image}
          />

        </div>

      </Link>


      {/* DETAILS */}
      <div style={styles.detailsSection}>

        <div style={styles.badge}>
          {product.categories?.name}
        </div>

        <div style={styles.name}>
          {product.name}
        </div>

        <div style={styles.price}>
          ₹ {product.price}
          <span style={styles.unit}>
            {" "} / {unit.toUpperCase()}
          </span>
        </div>

        {unit === "kg" && (
          <div style={styles.minBox}>
            Min Order: 40 KG
          </div>
        )}

        {(unit === "pcs" || unit === "set") && (
          <div style={styles.minBox}>
            1 Carton = {cartonSize} {unit.toUpperCase()}
          </div>
        )}

      </div>


      {/* BUTTON */}
      <div style={styles.cartSection}>

        <button
          style={styles.cartBtn}
          onClick={addToCart}
        >
          <FaShoppingCart />
          Add to Cart
        </button>

      </div>

    </div>

  );

}


/* STYLES */

const styles = {

  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  imageSection: {
    height: 150,
    background: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  detailsSection: {
    padding: 12,
  },

  badge: {
    fontSize: 10,
    color: "#0B5ED7",
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
  },

  price: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0B5ED7",
  },

  unit: {
    fontSize: 12,
  },

  minBox: {
    fontSize: 11,
    background: "#f3f4f6",
    padding: 4,
    borderRadius: 6,
    marginTop: 4,
  },

  cartSection: {
    padding: 10,
  },

  cartBtn: {
    width: "100%",
    padding: 10,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  }

};
