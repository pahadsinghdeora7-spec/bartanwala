import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { FaSave, FaEdit, FaUser } from "react-icons/fa";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

      setLoading(false);
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

    setSaving(false);
    setEditMode(false);
  };

  if (loading) {
    return <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>My Account | Bartanwala</title>
      </Head>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Account</h2>

        <div style={styles.profileCard}>
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
            <Detail label="Business" value={form.business_name} />
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
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value || "-"}</span>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
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
    marginBottom: 12,
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#0B5ED7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontWeight: 600,
  },
  email: {
    fontSize: 13,
    color: "#6b7280",
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f1f1f1",
  },
  detailLabel: {
    color: "#6b7280",
    fontSize: 13,
  },
  detailValue: {
    fontWeight: 500,
  },
  editBtn: {
    marginTop: 16,
    width: "100%",
    padding: 12,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
  },
  saveBtn: {
    marginTop: 12,
    width: "100%",
    padding: 12,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
  },
  inputLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginTop: 4,
  },
};
