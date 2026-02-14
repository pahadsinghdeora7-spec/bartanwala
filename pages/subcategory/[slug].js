import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {
  const slug = params.slug;

  /* 🔹 GET SUBCATEGORY */
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!subcategory) {
    return { notFound: true };
  }

  /* 🔹 GET PRODUCTS */
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      image,
      size,
      gauge,
      unit_type,
      carton_size,
      categories(name),
      subcategories(name)
    `)
    .eq("subcategory_id", subcategory.id)
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

  return {
    props: {
      subcategory,
      products: products || [],
    },
  };
}

/* ================= PAGE ================= */

export default function SubcategoryPage({ subcategory, products }) {

  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const cartonSize = product.carton_size || 1;

    let qty = 1;

    if (unit === "kg") qty = 40;
    if (unit === "pcs" || unit === "set") qty = cartonSize;

    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        ...product,
        qty,
        unit,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart");
  }

  return (
    <>
      <Head>
        <title>{subcategory.name} | Bartanwala</title>
      </Head>

      <main style={styles.main}>

        <h1 style={styles.title}>
          {subcategory.name}
        </h1>

        {products.length === 0 && (
          <div style={styles.empty}>
            No products found
          </div>
        )}

        <div style={styles.grid}>

          {products.map((p) => {

            const unit = p.unit_type || "kg";
            const cartonSize = p.carton_size || 1;

            return (

              <div key={p.id} style={styles.card}>

                {/* IMAGE */}
                <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={styles.imageSection}>
                    {p.image ? (
                      <img src={p.image} style={styles.image} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                  </div>
                </Link>

                {/* DETAILS */}
                <div style={styles.detailsSection}>

                  <div style={styles.badge}>
                    {p.categories?.name}
                  </div>

                  <div style={styles.name}>
                    {p.name}
                  </div>

                  <div style={styles.metaRow}>
                    {p.size && <span>Size: {p.size}</span>}
                    {p.gauge && <span>Gauge: {p.gauge}</span>}
                  </div>

                  <div style={styles.price}>
                    ₹ {p.price}
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
                    onClick={() => addToCart(p)}
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>

              </div>

            );

          })}

        </div>

      </main>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {

  main: {
    padding: 16,
    paddingBottom: 100,
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 14,
  },

  empty: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 16,
  },

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
    flex: 1,
  },

  badge: {
    fontSize: 10,
    background: "#E0EDFF",
    color: "#0B5ED7",
    padding: "4px 8px",
    borderRadius: 20,
    width: "fit-content",
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
    marginTop: 4,
  },

  metaRow: {
    fontSize: 12,
    color: "#6b7280",
  },

  price: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0B5ED7",
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
    padding: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

};
