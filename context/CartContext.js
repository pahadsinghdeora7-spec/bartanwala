import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";


/* ================= CONTEXT ================= */

const CartContext = createContext();


/* ================= PROVIDER ================= */

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const [initialized, setInitialized] = useState(false);



  /* ================= LOAD ================= */

  useEffect(() => {

    try {

      const stored = localStorage.getItem("cart");

      if (stored) {

        setCart(JSON.parse(stored));

      }

    } catch {

      setCart([]);

    }

    setInitialized(true);

  }, []);



  /* ================= SAVE ================= */

  useEffect(() => {

    if (initialized) {

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

    }

  }, [cart, initialized]);



  /* ================= ADD TO CART ================= */

  const addToCart = (product, qty = 1, unit_type = "kg") => {

    qty = Number(qty);

    if (!qty || qty <= 0) qty = 1;

    setCart(prev => {

      const existing = prev.find(
        item =>
          item.id === product.id &&
          item.unit_type === unit_type
      );


      /* UPDATE EXISTING */

      if (existing) {

        return prev.map(item =>

          item.id === product.id &&
          item.unit_type === unit_type

            ? {
                ...item,
                qty: item.qty + qty
              }

            : item

        );

      }


      /* ADD NEW */

      return [

        ...prev,

        {
          id: product.id,

          name: product.name,

          price: Number(product.price),

          image: product.image,

          slug: product.slug,

          unit_type: unit_type,

          qty: qty,

          category: product.categories?.name,

          subcategory: product.subcategories?.name

        }

      ];

    });

  };



  /* ================= UPDATE QTY ================= */

  const updateQty = (id, qty) => {

    qty = Number(qty);

    if (!qty || qty < 1) qty = 1;

    setCart(prev =>

      prev.map(item =>

        item.id === id

          ? {
              ...item,
              qty: qty
            }

          : item

      )

    );

  };



  /* ================= REMOVE ================= */

  const removeItem = (id) => {

    setCart(prev =>
      prev.filter(item => item.id !== id)
    );

  };



  /* ================= CLEAR ================= */

  const clearCart = () => {

    setCart([]);

    localStorage.removeItem("cart");

  };



  /* ================= COUNT ================= */

  const cartCount = useMemo(() => {

    return cart.reduce(

      (sum, item) => sum + Number(item.qty),

      0

    );

  }, [cart]);



  /* ================= TOTAL ================= */

  const cartTotal = useMemo(() => {

    return cart.reduce(

      (sum, item) =>
        sum + Number(item.price) * Number(item.qty),

      0

    );

  }, [cart]);



  /* ================= EXPORT ================= */

  return (

    <CartContext.Provider
      value={{

        cart,

        addToCart,

        updateQty,

        removeItem,

        clearCart,

        cartCount,

        cartTotal

      }}
    >

      {children}

    </CartContext.Provider>

  );

}



/* ================= HOOK ================= */

export function useCart() {

  return useContext(CartContext);

}
