import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    business_name: "",
    address: "",
    city: "",
    pin_code: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setForm(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!user) return;

    await supabase.from("customers").upsert({
      user_id: user.id,
      ...form,
      email: user.email,
    });

    setProfile({ ...form, email: user.email });
    setEditOpen(false);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <>
      <Head>
        <title>My Account | Bartanwala</title>
      </Head>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Profile</h2>

        {/* PROFILE CARD */}
        <div style={styles.card}>
          <div style={styles.row}><strong>Name:</strong> {profile?.name || "-"}</div>
          <div style={styles.row}><strong>Email:</strong> {user?.email}</div>
          <div style={styles.row}><strong>Mobile:</strong> {profile?.mobile || "-"}</div>
          <div style={styles.row}><strong>Business:</strong> {profile?.business_name || "-"}</div>
          <div style={styles.row}><strong>Address:</strong> {profile?.address || "-"}</div>
          <div style={styles.row}><strong>City:</strong> {profile?.city || "-"}</div>
          <div style={styles.row}><strong>Pincode:</strong> {profile?.pin_code || "-"}</div>

          <button style={styles.editBtn} onClick={() => setEditOpen(true)}>
            <FaEdit /> Edit Profile
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Edit Profile</h3>
              <FaTimes onClick={() => setEditOpen(false)} />
            </div>

            {["name", "mobile", "business_name", "address", "city", "pin_code"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={field.replace("_", " ").toUpperCase()}
                style={styles.input}
              />
            ))}

            <button style={styles.saveBtn} onClick={handleSave}>
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 16,
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
  },
  row: {
    marginBottom: 8,
    fontSize: 14,
  },
  editBtn: {
    marginTop: 12,
    width: "100%",
    background: "#0B5ED7",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    border: "none",
  },

  /* MODAL */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    width: "90%",
    padding: 16,
    borderRadius: 12,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginBottom: 8,
  },
  saveBtn: {
    width: "100%",
    background: "#16a34a",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    border: "none",
  },
};
