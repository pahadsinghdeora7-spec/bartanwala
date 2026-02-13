import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

/* ================= SUPABASE ================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [qtyMap, setQtyMap] = useState({});

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          slug,
          price,
          price_unit,
          image,
          size,
          gauge,
          unit_type,
          categories(name),
          subcategories(name)
        `
        )
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      setProducts(data || []);

      // default qty setup
      const initialQty = {};
      data?.forEach((p) => {
        initialQty[p.id] =
          p.unit_type === "kg" ? 40 : 1;
      });
      setQtyMap(initialQty);
    }

    loadProducts();
  }, []);

  const handleQtyChange = (id, value, unitType) => {
    const min = unitType === "kg" ? 40 : 1;
    const num = Number(value);

    setQtyMap((prev) => ({
      ...prev,
      [id]: num < min ? min : num,
    }));
  };

  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Steel & Aluminium Utensils</title>
      </Head>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Wholesale Steel & Aluminium Utensils
        </h1>
        <p style={styles.heroSub}>
          B2B Wholesale · Factory Price · All India Delivery
        </p>
      </section>

      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        <div style={styles.grid}>
          {products.map((p) => {
            const isKG = p.unit_type === "kg";
            const minQty = isKG ? 40 : 1;
            const dropdown = isKG
              ? [40, 80, 120, 160]
              : [1, 2, 3, 4, 5];

            return (
              <div key={p.id} style={styles.card}>

                <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={styles.imageSection}>
                    {p.image ? (
                      <img src={p.image} style={styles.image} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                  </div>
                </Link>

                <div style={styles.detailsSection}>
                  <div style={styles.category}>
                    {p.categories?.name}
                  </div>

                  <div style={styles.name}>
                    {p.name}
                  </div>

                  <div style={styles.price}>
                    ₹ {p.price}
                    {p.price_unit && (
                      <span style={styles.unit}>
                        {" "} / {p.price_unit.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* 🔥 QUANTITY SECTION */}
                  <div style={styles.qtyBox}>
                    <select
                      value={qtyMap[p.id] || minQty}
                      onChange={(e) =>
                        handleQtyChange(p.id, e.target.value, p.unit_type)
                      }
                      style={styles.select}
                    >
                      {dropdown.map((val) => (
                        <option key={val} value={val}>
                          {isKG ? `${val} KGS` : `${val} Carton`}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={minQty}
                      value={qtyMap[p.id] || minQty}
                      onChange={(e) =>
                        handleQtyChange(p.id, e.target.value, p.unit_type)
                      }
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.cartSection}>
                  <button
                    style={styles.cartBtn}
                    onClick={() =>
                      addToCart(
                        p,
                        qtyMap[p.id] || minQty,
                        p.unit_type
                      )
                    }
                  >
                    <FaShoppingCart /> Add to Cart
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
  hero: {
    background: "#f8fafc",
    padding: "28px 16px",
    textAlign: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    border: "1px solid #E5E7EB",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  heroSub: {
    fontSize: 13,
    color: "#6b7280",
  },
  main: {
    padding: 16,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  imageSection: {
    height: 140,
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
    padding: 12,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  category: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0B5ED7",
  },
  name: {
    fontSize: 14,
    fontWeight: 700,
    margin: "6px 0",
  },
  price: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0B5ED7",
  },
  unit: {
    fontSize: 12,
    color: "#6b7280",
  },

  qtyBox: {
    marginTop: 8,
    display: "flex",
    gap: 6,
  },
  select: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #d1d5db",
  },
  input: {
    width: 70,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #d1d5db",
  },

  cartSection: {
    padding: 10,
    borderTop: "1px solid #E5E7EB",
  },
  cartBtn: {
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};
