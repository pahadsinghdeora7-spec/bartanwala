import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import styles from "../styles/checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  /* ================= AUTO FILL PROFILE ================= */

  useEffect(() => {
    async function fetchProfile() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setLoading(false);
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

    fetchProfile();
  }, []);

  /* ================= TOTAL ================= */

  const subtotal = cart.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty),
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
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill required details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      const orderNumber =
        "ORD-" + Math.floor(100000 + Math.random() * 900000);

      /* 1️⃣ SAVE ORDER */
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: user?.id || null,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_city: form.city,
          customer_address: form.address,
          transport_name: form.transportName,
          total_amount: subtotal,
          order_status: "Processing",
          payment_status: "Pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      /* 2️⃣ SAVE ORDER ITEMS */
      const items = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        qty: item.qty,
        price_unit: item.price_unit || "pcs",
      }));

      const { error: itemError } = await supabase
        .from("order_items")
        .insert(items);

      if (itemError) throw itemError;

      /* 3️⃣ CLEAR CART */
      localStorage.removeItem("cart");

      /* 4️⃣ WHATSAPP MESSAGE */
      const message = `
📦 *New Order – Bartanwala*

Order No: ${orderNumber}

👤 ${form.name}
📞 ${form.phone}
📍 ${form.city}

🛒 Items:
${cart
  .map(
    (i) =>
      `• ${i.name}
Qty: ${i.qty}
Rate: ₹${i.price}/${i.price_unit}`
  )
  .join("\n\n")}

💰 Total: ₹${subtotal}
`;

      window.open(
        `https://wa.me/919873670361?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );

      /* 5️⃣ REDIRECT TO SUCCESS */
      router.push(`/order-success?order=${orderNumber}`);

    } catch (error) {
      console.error(error);
      alert("Order failed. Please try again.");
    }

    setSubmitting(false);
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

        {/* Buyer */}
        <div className={styles.card}>
          <h3>Buyer Details</h3>

          <input name="business" value={form.business} placeholder="Business Name" onChange={handleChange} className={styles.input} />
          <input name="name" value={form.name} placeholder="Contact Name *" onChange={handleChange} className={styles.input} />
          <input name="phone" value={form.phone} placeholder="Mobile *" onChange={handleChange} className={styles.input} />
          <input name="city" value={form.city} placeholder="City" onChange={handleChange} className={styles.input} />
          <textarea name="address" value={form.address} placeholder="Full Address *" onChange={handleChange} className={styles.textarea} />
        </div>

        {/* Transport */}
        <div className={styles.card}>
          <h3>Transport Details</h3>

          <select className={styles.input} value={form.transportSelect} onChange={handleTransportChange}>
            <option value="">Select Transport</option>
            <option value="VRL Logistics">VRL Logistics</option>
            <option value="GATI">GATI</option>
            <option value="TCI Express">TCI Express</option>
            <option value="SafeExpress">SafeExpress</option>
            <option value="Local Transport">Local Transport</option>
            <option value="Other">Other</option>
          </select>

          <input name="transportName" value={form.transportName} placeholder="Transport Name" onChange={handleChange} className={styles.input} />
        </div>

        {/* Summary */}
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
          disabled={submitting}
          style={{
            opacity: submitting ? 0.6 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          <FaWhatsapp />
          {submitting ? " Placing Order..." : " Confirm Order"}
        </button>
      </div>
    </>
  );
}
