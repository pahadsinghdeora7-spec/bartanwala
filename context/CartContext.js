import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [initialized, setInitialized] = useState(false);

  /* ================= LOAD FROM LOCALSTORAGE ================= */

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
      setInitialized(true);
    }
  }, []);

  /* ================= SAVE TO LOCALSTORAGE ================= */

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, initialized]);

  /* ================= ADD TO CART ================= */

  const addToCart = (product, qty = 1, unit = "kg") => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + Number(qty) }
            : item
        );
      }

      return [...prev, { ...product, qty: Number(qty), unit }];
    });
  };

  /* ================= UPDATE QTY ================= */

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Number(qty)) }
          : item
      )
    );
  };

  /* ================= REMOVE ITEM ================= */

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* ================= CLEAR CART (IMPORTANT FIX) ================= */

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  /* ================= COUNT ================= */

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeItem,
        clearCart,   // 👈 NEW
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
