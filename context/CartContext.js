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


  /* LOAD FROM LOCALSTORAGE */

  useEffect(() => {

    const stored =
      localStorage.getItem("cart");

    if (stored) {

      setCart(JSON.parse(stored));

    }

    setInitialized(true);

  }, []);


  /* SAVE */

  useEffect(() => {

    if (initialized) {

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

    }

  }, [cart, initialized]);


  /* ADD */

  function addToCart(product, qty = 1, unit = "kg") {

    setCart(prev => {

      const existing =
        prev.find(i => i.id === product.id);

      if (existing) {

        return prev.map(i =>
          i.id === product.id
            ? {
                ...i,
                qty:
                  i.qty +
                  Number(qty)
              }
            : i
        );

      }

      return [
        ...prev,
        {
          ...product,
          qty: Number(qty),
          unit
        }
      ];

    });

  }


  /* UPDATE */

  function updateQty(id, qty) {

    setCart(prev =>
      prev.map(i =>
        i.id === id
          ? {
              ...i,
              qty: Math.max(
                1,
                Number(qty)
              )
            }
          : i
      )
    );

  }


  /* REMOVE */

  function removeItem(id) {

    setCart(prev =>
      prev.filter(i => i.id !== id)
    );

  }


  /* CLEAR */

  function clearCart() {

    setCart([]);

    localStorage.removeItem("cart");

  }


  /* COUNT */

  const cartCount = useMemo(() => {

    return cart.reduce(
      (sum, i) =>
        sum + i.qty,
      0
    );

  }, [cart]);


  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        cartCount,
        initialized   // ⭐ IMPORTANT
      }}
    >

      {children}

    </CartContext.Provider>

  );

}


export function useCart() {

  return useContext(CartContext);

}
