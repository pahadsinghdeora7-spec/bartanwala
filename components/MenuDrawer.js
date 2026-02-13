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
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function MenuDrawer({ open, onClose, user }) {
  if (!open) return null;

  const router = useRouter();
  const isLoggedIn = !!user;
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    router.push("/login");
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />

      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <div style={styles.brand}>Bartanwala</div>
            <div style={styles.user}>
              {isLoggedIn ? user.email : "Guest User"}
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <FaTimes size={18} />
          </button>
        </div>

        {/* MAIN MENU */}
        <div style={styles.section}>
          <MenuItem href="/" icon={<FaHome />} label="Home" router={router} />
          <MenuItem href="/categories" icon={<FaThLarge />} label="Categories" router={router} />

          {isLoggedIn && (
            <MenuItem href="/orders" icon={<FaClipboardList />} label="My Orders" router={router} />
          )}

          {isLoggedIn && (
            <MenuItem href="/account" icon={<FaUser />} label="My Account" router={router} />
          )}

          {isAdmin && (
            <MenuItem
              href="/admin"
              icon={<FaUserShield />}
              label="Admin Dashboard"
              router={router}
            />
          )}

          {!isLoggedIn && (
            <MenuItem
              href="/login"
              icon={<FaSignInAlt />}
              label="Login / Register"
              router={router}
            />
          )}
        </div>

        {/* DIVIDER */}
        <div style={styles.divider} />

        {/* SECOND MENU */}
        <div style={styles.section}>
          <MenuItem href="/about" icon={<FaInfoCircle />} label="About Us" router={router} />
          <MenuItem href="/contact" icon={<FaPhone />} label="Contact Us" router={router} />

          {/* ✅ NEW POLICIES OPTION */}
          <MenuItem href="/policies" icon={<FaClipboardList />} label="Policies" router={router} />
        </div>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/919873670361"
          target="_blank"
          rel="noreferrer"
          style={styles.whatsapp}
        >
          <FaWhatsapp /> WhatsApp Support
        </a>

        {/* LOGOUT */}
        {isLoggedIn && (
          <button style={styles.logout} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </>
  );
}

function MenuItem({ href, icon, label, router }) {
  const active = router.pathname === href;

  return (
    <Link
      href={href}
      style={{
        ...styles.item,
        ...(active && styles.activeItem),
      }}
    >
      <span style={styles.icon}>{icon}</span>
      {label}
    </Link>
  );
}

/* ================= STYLES ================= */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(2px)",
    zIndex: 9999,
  },

  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 280,
    height: "100vh",
    background: "#ffffff",
    zIndex: 10000,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottom: "1px solid #e5e7eb",
  },

  brand: {
    fontSize: 18,
    fontWeight: 700,
  },

  user: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  section: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  divider: {
    height: 1,
    background: "#e5e7eb",
    marginTop: 18,
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 10px",
    borderRadius: 8,
    textDecoration: "none",
    color: "#111",
    fontSize: 14,
    fontWeight: 500,
    transition: "0.2s",
  },

  activeItem: {
    background: "#eef2ff",
    color: "#0B5ED7",
  },

  icon: {
    width: 18,
  },

  whatsapp: {
    marginTop: "auto",
    background: "#25D366",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },

  logout: {
    marginTop: 10,
    background: "#ef4444",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
