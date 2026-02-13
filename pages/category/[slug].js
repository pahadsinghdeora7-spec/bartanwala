import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

/* ================= SERVER ================= */

export async function getServerSideProps({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return { notFound: true };

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, price_unit, image, unit_type")
    .eq("category_id", category.id)
    .eq("in_stock", true)
    .order("id", { ascending: false });

  return {
    props: {
      category,
      products: products || [],
    },
  };
}

/* ================= PAGE ================= */

export default function CategoryPage({ category, products }) {
  const { addToCart } = useCart();
  const [qtyMap, setQtyMap] = useState({});

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
        <title>{category.name} | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <h1 style={styles.title}>{category.name}</h1>

        {products.length === 0 && (
          <div style={styles.empty}>
            No products found in this category.
          </div>
        )}

        <div style={styles.grid}>
          {products.map((p) => {
            const isKG = p.unit_type === "kg";
            const minQty = isKG ? 40 : 1;
            const dropdown = isKG
              ? [40, 80, 120, 160]
              : [1, 2, 3, 4, 5];

            return (
              <div key={p.id} style={styles.card}>

                <Link href={`/product/${p.slug}`}>
                  <div style={styles.imageWrap}>
                    <img
                      src={p.image || "/placeholder.png"}
                      style={styles.image}
                    />
                  </div>
                </Link>

                <div style={styles.name}>{p.name}</div>

                <div style={styles.price}>
                  ₹{p.price}
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
                  Add to Cart
                </button>

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "20px 16px 100px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 18,
  },

  empty: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  },

  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 14,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
  },

  imageWrap: {
    height: 120,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  name: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    fontWeight: 700,
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

  cartBtn: {
    marginTop: 8,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};
