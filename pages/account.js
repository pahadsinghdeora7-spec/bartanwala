import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

/* ================= PAGE ================= */

export default function Account() {
  const router = useRouter();

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

  /* ================= LOAD USER ================= */

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      await loadProfile(data.user.id);
    }

    loadUser();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      setProfile(data);
      setForm({
        name: data.name || "",
        mobile: data.mobile || "",
        business_name: data.business_name || "",
        address: data.address || "",
        city: data.city || "",
        pin_code: data.pin_code || "",
      });
    }

    setLoading(false);
  }

  /* ================= SAVE PROFILE ================= */

  async function saveProfile() {
    if (!user) return;

    await supabase.from("customers").upsert({
      user_id: user.id,
      email: user.email,
      ...form,
    });

    setEditOpen(false);
    await loadProfile(user.id);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  /* ================= UI ================= */

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>My Account</h2>

      {/* PROFILE HEADER */}
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          {profile?.name
            ? profile.name.charAt(0).toUpperCase()
            : user.email.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <div style={styles.profileName}>
            {profile?.name || "Customer"}
          </div>
          <div style={styles.profileEmail}>{user.email}</div>
        </div>

        <button style={styles.editSmall} onClick={() => setEditOpen(true)}>
          Edit
        </button>
      </div>

      {/* PERSONAL */}
      <Section title="Personal Details">
        <Info label="Mobile" value={profile?.mobile} />
      </Section>

      {/* BUSINESS */}
      <Section title="Business Details">
        <Info label="Business Name" value={profile?.business_name} />
      </Section>

      {/* ADDRESS */}
      <Section title="Address Details">
        <Info label="Address" value={profile?.address} />
        <Info label="City" value={profile?.city} />
        <Info label="Pincode" value={profile?.pin_code} />
      </Section>

      {/* EDIT MODAL */}
      {editOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Profile</h3>

            <Input label="Full Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <Input label="Mobile"
              value={form.mobile}
              onChange={(v) => setForm({ ...form, mobile: v })}
            />

            <Input label="Business Name"
              value={form.business_name}
              onChange={(v) => setForm({ ...form, business_name: v })}
            />

            <Input label="Address"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
            />

            <Input label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
            />

            <Input label="Pincode"
              value={form.pin_code}
              onChange={(v) => setForm({ ...form, pin_code: v })}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button style={styles.saveBtn} onClick={saveProfile}>
                Save
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value || "-"}</div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 16,
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 16,
  },

  profileHeader: {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: "50%",
    background: "#0B5ED7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 600,
  },

  profileName: { fontSize: 16, fontWeight: 600 },
  profileEmail: { fontSize: 13, color: "#6b7280" },

  editSmall: {
    background: "#eef2ff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    cursor: "pointer",
  },

  section: {
    background: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    color: "#6b7280",
  },

  infoRow: { marginBottom: 8 },
  infoLabel: { fontSize: 12, color: "#9ca3af" },
  infoValue: { fontSize: 14, fontWeight: 500 },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
  },

  input: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ddd",
  },

  saveBtn: {
    flex: 1,
    background: "#0B5ED7",
    color: "#fff",
    padding: 8,
    border: "none",
    borderRadius: 6,
  },

  cancelBtn: {
    flex: 1,
    background: "#e5e7eb",
    padding: 8,
    border: "none",
    borderRadius: 6,
  },
};
