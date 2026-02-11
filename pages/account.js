import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { FaUser, FaEdit, FaSave } from "react-icons/fa";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    business_name: "",
    gst_number: "",
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
        router.push("/login");
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setForm({
          name: data.name || "",
          mobile: data.mobile || "",
          business_name: data.business_name || "",
          gst_number: data.gst_number || "",
          email: data.email || user.email,
          address: data.address || "",
          city: data.city || "",
          pin_code: data.pin_code || "",
        });
      } else {
        setForm((prev) => ({ ...prev, email: user.email }));
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);

    await supabase.from("customers").upsert({
      user_id: user.id,
      ...form,
    });

    setSaving(false);
    setEditMode(false);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <>
      <Head>
        <title>My Account | Bartanwala</title>
      </Head>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Account</h2>

        {/* PROFILE HEADER */}
        <div style={styles.headerCard}>
          <div style={styles.avatar}>
            <FaUser size={22} />
          </div>
          <div>
            <div style={styles.name}>
              {form.name || "Customer"}
            </div>
            <div style={styles.email}>{form.email}</div>
          </div>
        </div>

        {/* VIEW MODE */}
        {!editMode && (
          <div style={styles.card}>
            <Detail label="Mobile" value={form.mobile} />
            <Detail label="Business Name" value={form.business_name} />
            <Detail label="GST Number" value={form.gst_number} />
            <Detail label="Address" value={form.address} />
            <Detail label="City" value={form.city} />
            <Detail label="Pincode" value={form.pin_code} />

            <button
              style={styles.editBtn}
              onClick={() => setEditMode(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <div style={styles.card}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
            <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} />
            <Input label="GST Number" name="gst_number" value={form.gst_number} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
            <Input label="City" name="city" value={form.city} onChange={handleChange} />
            <Input label="Pincode" name="pin_code" value={form.pin_code} onChange={handleChange} />

            <button style={styles.saveBtn} onClick={handleSave}>
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value || "-"}</span>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.inputLabel}>{label}</label>
      <input style={styles.input} {...props} />
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
    marginBottom: 14,
  },
  headerCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#0B5ED7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontWeight: 600,
    fontSize: 16,
  },
  email: {
    fontSize: 13,
    color: "#6b7280",
  },
  card: {
    background: "#ffffff",
    padding: 18,
    borderRadius: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f1f1f1",
  },
  label: {
    color: "#6b7280",
    fontSize: 14,
  },
  value: {
    fontWeight: 500,
    maxWidth: "60%",
    textAlign: "right",
  },
  editBtn: {
    marginTop: 18,
    width: "100%",
    padding: 13,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
  },
  saveBtn: {
    marginTop: 12,
    width: "100%",
    padding: 13,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
  },
  inputLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  input: {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginTop: 5,
  },
};
