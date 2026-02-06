import { useState } from "react";
import Head from "next/head";
import { getSupabase } from "../../lib/supabase";
import {
  FaWhatsapp,
  FaRupeeSign,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, price_unit, image, moq, in_stock"
    )
    .eq("slug", params.slug)
    .single();

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
  };
}

export default function ProductPage({ product }) {
  const [qty, setQty] = useState(1);

  const whatsappMessage = encodeURIComponent(
    `Hello Bartanwala,

I want bulk price for:
${product.name}
Price: ₹${product.price}/${product.price_unit}
Quantity: ${qty} ${product.price_unit}`
  );

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.price_unit,
      qty,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
  }

  return (
    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
        <meta
          name="description"
          content={
            product.description ||
            `Wholesale ${product.name} at factory price.`
          }
        />
      </Head>

      <main style={{ padding: 16 }}>
        {/* IMAGE */}
        <div style={{ height: 220, marginBottom: 12 }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* NAME */}
        <h1>{product.name}</h1>

        {/* PRICE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#0B5ED7",
            fontSize: 18,
            marginTop: 6,
          }}
        >
          <FaRupeeSign />
          <strong>{product.price}</strong> / {product.price_unit}
        </div>

        {/* MOQ + STOCK */}
        <div style={{ marginTop: 8, fontSize: 13 }}>
          {product.moq && (
            <div>
              <FaBoxOpen /> MOQ: {product.moq}
            </div>
          )}
          <div>
            Status:{" "}
            {product.in_stock ? (
              <strong style={{ color: "green" }}>In Stock</strong>
            ) : (
              <strong style={{ color: "red" }}>Out of Stock</strong>
            )}
          </div>
        </div>

        {/* QUANTITY */}
        <div style={{ marginTop: 14 }}>
          <strong>Quantity</strong>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <strong>{qty}</strong>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>

        {/* DESCRIPTION */}
        {product.description && (
          <p style={{ marginTop: 12 }}>{product.description}</p>
        )}

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
          }}
        >
          {/* ADD TO CART */}
          <button
            onClick={addToCart}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              border: "1px solid #0B5ED7",
              background: "#fff",
              color: "#0B5ED7",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <FaShoppingCart /> Add to Cart
          </button>

          {/* BULK PRICE */}
          <a
            href={`https://wa.me/919873670361?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              background: "#25D366",
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <FaWhatsapp /> Get Bulk Price
          </a>
        </div>
      </main>
    </>
  );
          }
