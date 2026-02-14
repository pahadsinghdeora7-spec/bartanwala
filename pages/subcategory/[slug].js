import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function SubcategoryProductsPage() {

  const router = useRouter();
  const { slug } = router.query;

  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    if (!slug) return;

    async function loadData() {

      try {

        setLoading(true);

        /* GET SUBCATEGORY USING SLUG */
        const { data: subcat, error: subError } = await supabase
          .from("subcategories")
          .select("id, name, slug")
          .eq("slug", slug)
          .single();

        if (subError || !subcat) {
          console.log("Subcategory error:", subError);
          setProducts([]);
          setSubcategory(null);
          setLoading(false);
          return;
        }

        setSubcategory(subcat);

        /* GET PRODUCTS USING subcategory_id */
        const { data: productsData, error: prodError } = await supabase
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
            pcs_per_carton,
            categories(name)
          `)
          .eq("subcategory_id", Number(subcat.id)) // FIXED
          .eq("in_stock", true)
          .order("created_at", { ascending: false });

        if (prodError) {
          console.log("Products error:", prodError);
        }

        setProducts(productsData || []);

      } catch (err) {

        console.log("Load error:", err);
        setProducts([]);

      } finally {

        setLoading(false);

      }

    }

    loadData();

  }, [slug]);

  /* ================= ADD TO CART ================= */

  function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const unit = product.unit_type || "kg";
    const cartonSize = product.pcs_per_carton || 1;

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

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div style={{ padding: 20 }}>
        Loading...
      </div>
    );

  }

  /* ================= PAGE ================= */

  return (
    <>

      <Head>
        <title>
          {subcategory?.name || "Products"} | Bartanwala
        </title>
      </Head>

      <main style={styles.main}>

        <h1 style={styles.heading}>
          {subcategory?.name}
        </h1>

        {products.length === 0 && (
          <div style={styles.empty}>
            No products found
          </div>
        )}

        <div style={styles.grid}>

          {products.map((p) => {

            const unit = p.unit_type || "kg";
            const cartonSize = p.pcs_per_carton || 1;

            return (

              <div key={p.id} style={styles.card}>

                <Link href={`/product/${p.slug}`}>

                  <div style={styles.imageSection}>

                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={styles.image}
                      />
                    ) : (
                      <div style={styles.noImage}>
                        No Image
                      </div>
                    )}

                  </div>

                </Link>

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

  heading: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 14,
  },

  empty: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
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
    gap: 6,
    flex: 1,
  },

  badge: {
    fontSize: 10,
    fontWeight: 600,
    background: "#E0EDFF",
    color: "#0B5ED7",
    padding: "4px 8px",
    borderRadius: 20,
    width: "fit-content",
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.3,
    minHeight: 38,
  },

  metaRow: {
    display: "flex",
    gap: 10,
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
    display: "flex",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  }

};
