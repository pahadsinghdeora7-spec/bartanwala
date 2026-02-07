import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import {
  FaUser,
  FaBox,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }

    loadUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return null;

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <>
      <Head>
        <title>My Account | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        {/* PROFILE */}
        <div style={styles.card}>
          <div style={styles.profile}>
            <FaUser size={28} />
            <div>
              <strong>{user.email}</strong>
              <div style={styles.sub}>
                {isAdmin ? "Admin Account" : "Customer Account"}
              </div>
            </div>
          </div>
        </div>

        {/* USER OPTIONS */}
        <div style={styles.card}>
          <div style={styles.item} onClick={() => router.push("/orders")}>
            <FaBox /> My Orders
          </div>
        </div>

        {/* ADMIN SECTION */}
        {isAdmin && (
          <div style={styles.card}>
            <div style={styles.adminTitle}>
              <FaUserShield /> Admin Panel
            </div>

            <div
              style={styles.item}
              onClick={() => router.push("/admin")}
            >
              Dashboard
            </div>

            <div
              style={styles.item}
              onClick={() => router.push("/admin/products")}
            >
              Product Management
            </div>

            <div
              style={styles.item}
              onClick={() => router.push("/admin/orders")}
            >
              Orders Management
            </div>

            <div
              style={styles.item}
              onClick={() => router.push("/admin/customers")}
            >
              Customers
            </div>

            <div
              style={styles.item}
              onClick={() => router.push("/admin/policies")}
            >
              Policies
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <button style={styles.logout} onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  profile: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  sub: {
    fontSize: 13,
    color: "#6b7280",
  },

  item: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "10px 0",
    fontSize: 15,
    cursor: "pointer",
    borderBottom: "1px solid #e5e7eb",
  },

  adminTitle: {
    fontWeight: 700,
    marginBottom: 8,
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#0B5ED7",
  },

  logout: {
    width: "100%",
    marginTop: 10,
    padding: 14,
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 16,
  },
};
