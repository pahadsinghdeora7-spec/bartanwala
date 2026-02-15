import { useCart } from "../context/CartContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import styles from "../styles/cart.module.css";

export default function CartPage() {

  const router = useRouter();

  const {
    cart,
    updateQty,
    removeItem
  } = useCart();


  /* ================= CALCULATE TOTAL ================= */

  const subtotal = cart.reduce((sum, item) => {

    const price = Number(item.price) || 0;
    const qty   = Number(item.qty) || 0;

    return sum + price * qty;

  }, 0);


  /* ================= HANDLERS ================= */

  function increase(item) {

    updateQty(item.id, item.qty + 1);

  }


  function decrease(item) {

    if (item.qty > 1) {

      updateQty(item.id, item.qty - 1);

    }

  }


  function remove(item) {

    if (confirm("Remove item from cart?")) {

      removeItem(item.id);

    }

  }


  /* ================= UI ================= */

  return (

    <>
      <Head>
        <title>Shopping Cart | Bartanwala</title>
      </Head>


      <div className={styles.page}>


        {/* HEADER */}

        <div className={styles.header}>

          <h2>Shopping Cart</h2>

          <span>
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </span>

        </div>



        {/* EMPTY */}

        {cart.length === 0 && (

          <div className={styles.empty}>

            🛒 Your cart is empty

          </div>

        )}



        {/* CART ITEMS */}

        {cart.map(item => (

          <div key={item.id} className={styles.card}>


            {/* IMAGE */}

            <img
              src={item.image || "/placeholder.png"}
              className={styles.image}
              alt={item.name}
            />


            {/* INFO */}

            <div className={styles.info}>


              <div className={styles.name}>
                {item.name}
              </div>


              <div className={styles.price}>

                ₹ {item.price}

                <span className={styles.unit}>
                  / {item.unit_type?.toUpperCase()}
                </span>

              </div>


              {/* QTY CONTROL */}

              <div className={styles.qtyRow}>


                <button
                  className={styles.qtyBtn}
                  onClick={() => decrease(item)}
                >
                  <FaMinus />
                </button>


                <span className={styles.qty}>
                  {item.qty}
                </span>


                <button
                  className={styles.qtyBtn}
                  onClick={() => increase(item)}
                >
                  <FaPlus />
                </button>


              </div>


            </div>


            {/* DELETE */}

            <button
              className={styles.delete}
              onClick={() => remove(item)}
            >
              <FaTrash />
            </button>


          </div>

        ))}



        {/* SUMMARY */}

        {cart.length > 0 && (

          <div className={styles.summary}>


            <h3>Order Summary</h3>


            <div className={styles.row}>

              <span>Subtotal</span>

              <span>
                ₹ {subtotal}
              </span>

            </div>


            <div className={styles.rowMuted}>

              <span>Courier Charges</span>

              <span>
                As applicable
              </span>

            </div>


            <hr />


            <div className={styles.totalRow}>

              <strong>Total</strong>

              <strong>
                ₹ {subtotal}
              </strong>

            </div>



            {/* CHECKOUT BUTTON */}

            <button
              className={styles.checkout}
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout →
            </button>


          </div>

        )}


      </div>

    </>

  );

              }
