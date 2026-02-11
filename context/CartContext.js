import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Load from localStorage ONCE
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  // ✅ Save whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1, unit = "kg") => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, qty: item.qty + Number(qty) }
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

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? { ...item, qty: Math.max(1, Number(qty)) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeItem, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
