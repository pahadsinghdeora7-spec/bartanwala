import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  FaUser,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaClipboardList,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);

      // fetch customer profile
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setCustomer(data);
      setLoading(false);
    }

    loadUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return null;

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <>
      <Head>
        <title>My Account | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        {/* HEADER CARD */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            <FaUser />
          </div>

          <div>
            <h2 style={{ margin: 0 }}>
              {customer?.name || "Customer"}
            </h2>
            <p style={styles.muted}>{user.email}</p>

            {isAdmin && (
              <span style={styles.adminBadge}>
                <FaUserShield /> Admin
              </span>
            )}
          </div>
        </div>

        {/* INFO CARD */}
        <div style={styles.card}>
          <InfoRow
            icon={<FaStore />}
            label="Business / Shop"
            value={customer?.business_name || "Not added"}
          />

          <InfoRow
            icon={<FaPhone />}
            label="Mobile"
            value={customer?.mobile || "Not added"}
          />

          <InfoRow
            icon={<FaEnvelope />}
            label="Email"
            value={customer?.email || user.email}
          />
        </div>

        {/* ACTIONS */}
        <div style={styles.card}>
          <ActionRow
            icon={<FaClipboardList />}
            label="My Orders"
            onClick={() => router.push("/orders")}
          />

          {isAdmin && (
            <ActionRow
              icon={<FaUserShield />}
              label="Admin Dashboard"
              onClick={() => router.push("/admin")}
              highlight
            />
          )}

          <ActionRow
            icon={<FaSignOutAlt />}
            label="Logout"
            danger
            onClick={logout}
          />
        </div>

        {/* FOOTER NOTE */}
        <p style={styles.note}>
          ℹ️ Address & delivery details will be asked during checkout.
        </p>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function InfoRow({ icon, label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.icon}>{icon}</span>
      <div>
        <div style={styles.label}>{label}</div>
        <div style={styles.value}>{value}</div>
      </div>
    </div>
  );
}

function ActionRow({ icon, label, onClick, danger, highlight }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.actionRow,
        color: danger ? "#dc2626" : highlight ? "#2563eb" : "#111",
        fontWeight: highlight ? 600 : 500,
      }}
    >
      <span style={styles.icon}>{icon}</span>
      {label}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  profileCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 16,
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },

  muted: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  adminBadge: {
    display: "inline-flex",
    gap: 6,
    alignItems: "center",
    marginTop: 6,
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  infoRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
  },

  value: {
    fontSize: 15,
    fontWeight: 500,
  },

  actionRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
    cursor: "pointer",
  },

  icon: {
    width: 20,
    display: "flex",
    justifyContent: "center",
  },

  note: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
};
