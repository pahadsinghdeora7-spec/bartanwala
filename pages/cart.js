import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  return (
    <>
      <Head>
        <title>Cart | Bartanwala</title>
      </Head>

      <main style={{ padding: 16 }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Link href="/">
            <FaArrowLeft />
          </Link>
          <h1 style={{ fontSize: 18 }}>My Cart</h1>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 && (
          <p style={{ color: "#6B7280" }}>
            Your cart is empty. Please add products.
          </p>
        )}

        {/* CART ITEMS */}
        {cart.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #E5E7EB",
              borderRadius: 6,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <strong>{item.name}</strong>

            <div style={{ fontSize: 14, marginTop: 4 }}>
              ₹ {item.price} / {item.unit}
            </div>

            <div style={{ fontSize: 14, marginTop: 4 }}>
              Quantity: {item.qty}
            </div>
          </div>
        ))}

        {/* FOOTER INFO */}
        {cart.length > 0 && (
          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "#f9fafb",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FaShoppingCart />
            <span>{cart.length} items in cart</span>
          </div>
        )}
      </main>
    </>
  );
        }
