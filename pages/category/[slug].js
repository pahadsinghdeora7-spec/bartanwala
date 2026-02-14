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

export default function CategoryPage() {

  const router = useRouter();
  const { slug } = router.query;

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    if (!slug) return;

    async function loadData() {

      setLoading(true);

      try {

        /* LOAD CATEGORY */
        const { data: cat, error: catError } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", slug)
          .single();

        if (catError || !cat) {
          console.log("Category error:", catError);
          setLoading(false);
          return;
        }

        setCategory(cat);

        /* LOAD SUBCATEGORIES */
        const { data: subs, error: subError } = await supabase
          .from("subcategories")
          .select("id, name, slug")
          .eq("category_id", cat.id)
          .order("name");

        if (subError) {
          console.log("Subcategory error:", subError);
        }

        setSubcategories(subs || []);

        /* LOAD PRODUCTS */
        const { data: prods, error: prodError } = await supabase
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
          .eq("category_id", cat.id)
          .eq("in_stock", true)
          .order("created_at", { ascending: false });

        if (prodError) {
          console.log("Product error:", prodError);
        }

        setProducts(prods || []);

      } catch (err) {

        console.log("Load error:", err);

      }

      setLoading(false);

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


  /* ================= UI ================= */

  return (
    <>
      <Head>
        <title>{category?.name || "Category"} | Bartanwala</title>
      </Head>

      <main style={styles.main}>

        <h2 style={styles.heading}>
          {category?.name}
        </h2>


        {/* ================= SUBCATEGORIES ================= */}

        {subcategories.length > 0 && (

          <>
            <h3 style={styles.subHeading}>Subcategories</h3>

            <div style={styles.grid}>

              {subcategories.map(sub => (

                <Link
                  key={sub.id}
                  href={`/subcategory/${sub.slug}`}   // ✅ FIXED HERE
                  style={styles.subCard}
                >
                  {sub.name}
                </Link>

              ))}

            </div>
          </>

        )}


        {/* ================= PRODUCTS ================= */}

        {products.length > 0 && (

          <>
            <h3 style={styles.subHeading}>All Products</h3>

            <div style={styles.grid}>

              {products.map(p => {

                const unit = p.unit_type || "kg";
                const cartonSize = p.pcs_per_carton || 1;

                return (

                  <div key={p.id} style={styles.card}>

                    <Link href={`/product/${p.slug}`}>

                      <div style={styles.imageSection}>

                        <img
                          src={p.image || "/placeholder.png"}
                          alt={p.name}
                          style={styles.image}
                        />

                      </div>

                    </Link>


                    <div style={styles.detailsSection}>

                      <div style={styles.badge}>
                        {p.categories?.name}
                      </div>

                      <div style={styles.name}>
                        {p.name}
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

          </>

        )}

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
    marginBottom: 16,
  },

  subHeading: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 16,
  },

  subCard: {
    padding: 16,
    background: "#fff",
    borderRadius: 12,
    textAlign: "center",
    textDecoration: "none",
    color: "#111",
    border: "1px solid #E5E7EB",
    fontWeight: 600,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
  },

  imageSection: {
    height: 140,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f9fafb",
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
