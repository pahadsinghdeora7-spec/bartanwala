import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import styles from "../styles/checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    business: "",
    name: "",
    phone: "",
    city: "",
    address: "",
    transportSelect: "",
    transportName: "",
  });

  /* ================= LOAD CART ================= */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  /* ================= CHECK LOGIN + AUTO FILL ================= */

  useEffect(() => {
    async function checkUser() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        router.replace("/login?redirect=checkout");
        return;
      }

      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setForm((prev) => ({
          ...prev,
          business: data.business_name || "",
          name: data.name || "",
          phone: data.mobile || "",
          city: data.city || "",
          address: data.address || "",
        }));
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  /* ================= TOTAL ================= */

  const subtotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTransportChange = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      transportSelect: value,
      transportName: value === "Other" ? "" : value,
    });
  };

  /* ================= PLACE ORDER ================= */

  const placeOrder = async () => {
    try {
      if (!form.name || !form.phone || !form.address) {
        alert("Please fill required details");
        return;
      }

      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      setPlacing(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        throw new Error("User session expired");
      }

      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (customerError || !customer) {
        throw new Error("Customer record not found");
      }

      const orderNumber = "ORD-" + Date.now();

      /* 🔹 INSERT ORDER */
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_id: customer.id,
            order_number: orderNumber,
            total_amount: subtotal,
            status: "Processing",
            payment_status: "Pending",
            payment_method: "COD",
            customer_business: form.business,
            customer_name: form.name,
            customer_phone: form.phone,
            customer_city: form.city,
            customer_address: form.address,
            transport_name: form.transportName,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      /* 🔹 INSERT ITEMS */
      const itemsToInsert = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.qty,
        unit: item.price_unit || "",
      }));

      const { error: itemError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemError) throw itemError;

      /* 🔹 CLEAR CART PROPERLY (IMPORTANT FIX) */
      const { clearCart } = useCart();
clearCart(); // 👈 THIS FIXES RELOAD ISSUE

      /* 🔹 REDIRECT */
      router.replace(`/order-success?id=${order.id}`);

    } catch (error) {
      console.error("ORDER ERROR:", error);
      alert(error.message || "Order failed. Please try again.");
      setPlacing(false);
    }
  };

  /* ================= UI ================= */

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <>
      <Head>
        <title>Checkout | Bartanwala</title>
      </Head>

      <div className={styles.page}>
        <h2 className={styles.title}>Checkout</h2>

        {/* BUYER DETAILS */}
        <div className={styles.card}>
          <h3>Buyer Details</h3>

          <input
            name="business"
            value={form.business}
            placeholder="Business Name"
            onChange={handleChange}
            className={styles.input}
          />

          <input
            name="name"
            value={form.name}
            placeholder="Contact Person Name *"
            onChange={handleChange}
            className={styles.input}
          />

          <input
            name="phone"
            value={form.phone}
            placeholder="Mobile Number *"
            onChange={handleChange}
            className={styles.input}
          />

          <input
            name="city"
            value={form.city}
            placeholder="City"
            onChange={handleChange}
            className={styles.input}
          />

          <textarea
            name="address"
            value={form.address}
            placeholder="Full Delivery Address *"
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>

        {/* TRANSPORT */}
        <div className={styles.card}>
          <h3>Transport Details</h3>

          <select
            className={styles.input}
            value={form.transportSelect}
            onChange={handleTransportChange}
          >
            <option value="">Select Your Transport</option>
            <option value="VRL Logistics">VRL Logistics</option>
            <option value="GATI">GATI</option>
            <option value="TCI Express">TCI Express</option>
            <option value="SafeExpress">SafeExpress</option>
            <option value="Local Transport">Local Transport</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="transportName"
            value={form.transportName}
            placeholder="Transport Name"
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* SUMMARY */}
        <div className={styles.card}>
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div key={item.id} className={styles.row}>
              <span>{item.name} × {item.qty}</span>
              <strong>₹ {item.price * item.qty}</strong>
            </div>
          ))}

          <hr />

          <div className={styles.totalRow}>
            <strong>Total</strong>
            <strong>₹ {subtotal}</strong>
          </div>
        </div>

        <button
          className={styles.whatsappBtn}
          onClick={placeOrder}
          disabled={placing}
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </>
  );
}
