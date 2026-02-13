import { useEffect, useState } from "react";
import Head from "next/head";
import { FaWhatsapp } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import styles from "../styles/checkout.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    business: "",
    name: "",
    phone: "",
    city: "",
    address: "",
    transportSelect: "",
    transportName: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const subtotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

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

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill required details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      /* ================= GET AUTH USER ================= */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first");
        return;
      }

      /* ================= CREATE / GET CUSTOMER ================= */
      let { data: customer } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!customer) {
        const { data: newCustomer } = await supabase
          .from("customers")
          .insert([
            {
              user_id: user.id,
              business_name: form.business,
              name: form.name,
              mobile: form.phone,
              address: form.address,
              city: form.city,
            },
          ])
          .select()
          .single();

        customer = newCustomer;
      }

      /* ================= CREATE ORDER ================= */
      const orderNumber = "ORD-" + Date.now();

      const { data: order } = await supabase
        .from("orders")
        .insert([
          {
            order_number: orderNumber,
            customer_id: customer.id,
            total_amount: subtotal,
            status: "processing",
            payment_method: "COD",
            transport_name: form.transportName,
          },
        ])
        .select()
        .single();

      /* ================= INSERT ORDER ITEMS ================= */
      const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.qty,
        unit: item.price_unit || "kg",
      }));

      await supabase.from("order_items").insert(items);

      /* ================= CLEAR CART ================= */
      localStorage.removeItem("cart");

      /* ================= WHATSAPP MESSAGE ================= */
      const message = `
📦 *New B2B Order – Bartanwala*

Order No: ${orderNumber}

🏪 Business: ${form.business || "N/A"}
👤 Name: ${form.name}
📞 Mobile: ${form.phone}
📍 City: ${form.city}
🏠 Address: ${form.address}

🚚 Transport: ${form.transportName || "Not provided"}

🛒 *Order Details*
${cart
  .map(
    (i) =>
      `• ${i.name}
  Qty: ${i.qty}
  Rate: ₹${i.price}/${i.price_unit}`
  )
  .join("\n")}

💰 *Total Amount: ₹${subtotal}*
`;

      window.open(
        `https://wa.me/919873670361?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      alert("Order placed successfully!");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="Business / Shop Name (optional)"
            onChange={handleChange}
            className={styles.input}
          />

          <input
            name="name"
            placeholder="Contact Person Name *"
            onChange={handleChange}
            className={styles.input}
          />

          <input
            name="phone"
            placeholder="Mobile Number *"
            onChange={handleChange}
            className={styles.input}
          />

          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className={styles.input}
          />

          <textarea
            name="address"
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
            <option value="Other">Other (Type manually)</option>
          </select>

          <input
            name="transportName"
            placeholder="Transport Name"
            value={form.transportName}
            onChange={handleChange}
            className={styles.input}
          />

          <p className={styles.note}>
            Packing charges applicable. Transport charges paid by customer.
          </p>
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
          disabled={loading}
        >
          <FaWhatsapp /> {loading ? "Placing Order..." : "Confirm & Send on WhatsApp"}
        </button>
      </div>
    </>
  );
    }
