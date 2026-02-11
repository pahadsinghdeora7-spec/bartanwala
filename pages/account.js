import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { FaSave } from "react-icons/fa";

export default function AccountPage() {
  const router = useRouter();

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

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login"); // 🔥 redirect if not logged in
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setForm({
          name: data.name || "",
          mobile: data.mobile || "",
          business_name: data.business_name || "",
          email: data.email || user.email,
          address: data.address || "",
          city: data.city || "",
          pin_code: data.pin_code || "",
        });
      } else {
        setForm((prev) => ({
          ...prev,
          email: user.email,
        }));
      }

      setLoading(false); // ✅ always stop loading
    }

    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Account | Bartanwala</title>
      </Head>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Account</h2>

        <div style={styles.card}>
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
          <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} disabled />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <Input label="City" name="city" value={form.city} onChange={handleChange} />
          <Input label="Pincode" name="pin_code" value={form.pin_code} onChange={handleChange} />
        </div>

        <button style={styles.saveBtn} onClick={handleSave}>
          <FaSave /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: "#6b7280" }}>{label}</label>
      <input
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ddd",
          marginTop: 4,
        }}
        {...props}
      />
    </div>
  );
}

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
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveBtn: {
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    padding: 14,
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
  },
};
