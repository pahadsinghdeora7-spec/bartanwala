import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaTimes,
  FaHome,
  FaThLarge,
  FaClipboardList,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaWhatsapp,
  FaInfoCircle,
  FaPhone,
  FaUserShield,
} from "react-icons/fa";
import { getSupabase } from "../lib/supabase";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function MenuDrawer({ open, onClose, user }) {
  if (!open) return null;

  const router = useRouter();
  const supabase = getSupabase();

  const isLoggedIn = !!user;
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    router.push("/login");
  };

  return (
    <>
      {/* OVERLAY */}
      <div style={styles.overlay} onClick={onClose} />

      {/* DRAWER */}
      <div
        style={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP */}
        <div style={styles.top}>
          <div>
            <strong>Bartanwala</strong>
            <div style={styles.sub}>
              {isLoggedIn ? user.email : "Guest User"}
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <FaTimes size={18} />
          </button>
        </div>

        {/* MAIN MENU */}
        <div style={styles.menu}>
          <MenuItem href="/" icon={<FaHome />} label="Home" />
          <MenuItem
            href="/categories"
            icon={<FaThLarge />}
            label="Categories"
          />

          {isLoggedIn && (
            <MenuItem
              href="/orders"
              icon={<FaClipboardList />}
              label="My Orders"
            />
          )}

          {isLoggedIn && (
            <MenuItem
              href="/account"
              icon={<FaUser />}
              label="My Account"
            />
          )}

          {/* 🔐 ADMIN ONLY */}
          {isAdmin && (
            <MenuItem
              href="/admin"
              icon={<FaUserShield />}
              label="Admin Dashboard"
            />
          )}

          {!isLoggedIn && (
            <MenuItem
              href="/login"
              icon={<FaSignInAlt />}
              label="Login / Register"
            />
          )}
        </div>

        {/* INFO */}
        <div style={styles.menu}>
          <MenuItem
            href="/about"
            icon={<FaInfoCircle />}
            label="About Us"
          />
          <MenuItem
            href="/contact"
            icon={<FaPhone />}
            label="Contact Us"
          />
        </div>

        {/* FOOTER */}
        <a
          href="https://wa.me/919873670361"
          target="_blank"
          rel="noreferrer"
          style={styles.whatsapp}
        >
          <FaWhatsapp /> WhatsApp Support
        </a>

        {isLoggedIn && (
          <button style={styles.logout} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </>
  );
}

function MenuItem({ href, icon, label }) {
  return (
    <Link href={href}>
      <a style={styles.item}>
        <span style={styles.icon}>{icon}</span>
        {label}
      </a>
    </Link>
  );
}

/* ================= STYLES ================= */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 9999,
  },

  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 270,
    height: "100vh",
    background: "#fff",
    zIndex: 10000,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 12,
  },

  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  sub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  menu: {
    marginTop: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 8px",
    borderRadius: 8,
    textDecoration: "none",
    color: "#111",
    fontSize: 15,
  },

  icon: {
    width: 18,
    display: "flex",
    justifyContent: "center",
  },

  whatsapp: {
    marginTop: "auto",
    background: "#25D366",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 600,
  },

  logout: {
    marginTop: 10,
    background: "#ef4444",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
};
