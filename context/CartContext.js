import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  /* 🔹 LOAD CART FROM LOCALSTORAGE */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(saved);
    }
  }, []);

  /* 🔹 SAVE CART WHENEVER IT CHANGES */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  /* 🔥 ADD TO CART (FIXED + PROFESSIONAL) */
  const addToCart = (product, qty = 1, unit = "kg") => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: Number(qty),
          unit,
        },
      ];
    });
  };

  /* 🔹 UPDATE QTY */
  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Number(qty)) }
          : item
      )
    );
  };

  /* 🔹 REMOVE ITEM */
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* 🔥 LIVE CART COUNT */
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeItem,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
  }
