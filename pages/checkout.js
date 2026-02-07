import { useEffect, useState } from "react";
import Head from "next/head";
import { FaWhatsapp } from "react-icons/fa";
import styles from "../styles/checkout.module.css";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
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

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill required details");
      return;
    }

    const message = `
📦 *New B2B Order – Bartanwala*

🏪 Business: ${form.business || "N/A"}
👤 Name: ${form.name}
📞 Mobile: ${form.phone}
📍 City: ${form.city}
🏠 Address: ${form.address}

🚚 *Transport Details*
Transport: ${form.transportName || "Not provided"}

🛒 *Order Details*
${cart
  .map(
    (i) =>
      `• ${i.name}
  Qty: ${i.qty}
  Rate: ₹${i.price}/${i.price_unit}`
  )
  .join("\n")}

📦 Packing Charges: As applicable
💰 *Total Amount: ₹${subtotal}*
`;

    window.open(
      `https://wa.me/919873670361?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
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
            placeholder="Transport Name (eg: VRL Transport)"
            value={form.transportName}
            onChange={handleChange}
            className={styles.input}
          />

          <p className={styles.note}>
            Packing charges applicable. Transport charges will be paid
            by customer as per transporter rates.
          </p>
        </div>

        {/* ORDER SUMMARY */}
        <div className={styles.card}>
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div key={item.id} className={styles.row}>
              <span>
                {item.name} × {item.qty}
              </span>
              <strong>₹ {item.price * item.qty}</strong>
            </div>
          ))}

          <div className={styles.rowMuted}>
            <span>Packing Charges</span>
            <span>As applicable</span>
          </div>

          <hr />

          <div className={styles.totalRow}>
            <strong>Total</strong>
            <strong>₹ {subtotal}</strong>
          </div>
        </div>

        {/* CTA */}
        <button className={styles.whatsappBtn} onClick={placeOrder}>
          <FaWhatsapp /> Confirm & Send on WhatsApp
        </button>
      </div>
    </>
  );
              }
