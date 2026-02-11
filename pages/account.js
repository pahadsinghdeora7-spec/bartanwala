import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import {
  FaUser,
  FaPhone,
  FaStore,
  FaMapMarkerAlt,
  FaSave,
} from "react-icons/fa";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    business_name: "",
    email: "",
    address: "",
    city: "",
    pin_code: "",
  });

  /* LOAD USER + CUSTOMER DATA */
  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;
      if (!currentUser) return;

      setUser(currentUser);

      const { data: customer } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (customer) {
        setForm({
          name: customer.name || "",
          mobile: customer.mobile || "",
          business_name: customer.business_name || "",
          email: customer.email || currentUser.email,
          address: customer.address || "",
          city: customer.city || "",
          pin_code: customer.pin_code || "",
        });
      } else {
        setForm((prev) => ({
          ...prev,
          email: currentUser.email,
        }));
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SAVE DATA */
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    await supabase.from("customers").upsert({
      user_id: user.id,
      name: form.name,
      mobile: form.mobile,
      business_name: form.business_name,
      email: form.email,
      address: form.address,
      city: form.city,
      pin_code: form.pin_code,
    });

    alert("Profile Updated Successfully ✅");
    setSaving(false);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <>
      <Head>
        <title>My Account | Bartanwala</title>
      </Head>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Account</h2>

        <div style={styles.card}>
          <Input
            icon={<FaUser />}
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            icon={<FaPhone />}
            label="Mobile Number"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
          />

          <Input
            icon={<FaStore />}
            label="Business / Shop Name"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={form.email}
            disabled
          />
        </div>

        <h3 style={styles.subHeading}>Delivery Address</h3>

        <div style={styles.card}>
          <Input
            icon={<FaMapMarkerAlt />}
            label="Full Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <Input
            label="Pincode"
            name="pin_code"
            value={form.pin_code}
            onChange={handleChange}
          />
        </div>

        <button style={styles.saveBtn} onClick={handleSave}>
          <FaSave /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}

/* INPUT COMPONENT */
function Input({ icon, label, ...props }) {
  return (
    <div style={styles.inputWrap}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputBox}>
        {icon && <span style={styles.icon}>{icon}</span>}
        <input style={styles.input} {...props} />
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    padding: 16,
    paddingBottom: 100,
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 600,
    margin: "16px 0 8px",
  },
  card: {
    background: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    border: "1px solid #E5E7EB",
  },
  inputWrap: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "8px 10px",
    marginTop: 4,
  },
  icon: {
    marginRight: 8,
    color: "#6b7280",
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 14,
    background: "transparent",
  },
  saveBtn: {
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    padding: 14,
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
  },
  loading: {
    padding: 20,
    textAlign: "center",
  },
};
