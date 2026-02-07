import Link from "next/link";
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
} from "react-icons/fa";

export default function MenuDrawer({ open, onClose, user }) {
  if (!open) return null;

  const isLoggedIn = !!user;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />

      <div style={styles.drawer}>
        {/* TOP */}
        <div style={styles.top}>
          <div>
            <strong>Bartanwala</strong>
            <div style={styles.sub}>
              {isLoggedIn ? `Hi, ${user.name || "Customer"}` : "Guest User"}
            </div>
          </div>
          <FaTimes onClick={onClose} />
        </div>

        {/* MAIN MENU */}
        <div style={styles.menu}>
          <MenuItem href="/" icon={<FaHome />} label="Home" />
          <MenuItem href="/categories" icon={<FaThLarge />} label="Categories" />

          {isLoggedIn && (
            <MenuItem
              href="/orders"
              icon={<FaClipboardList />}
              label="My Orders"
            />
          )}

          {isLoggedIn && (
            <MenuItem href="/account" icon={<FaUser />} label="My Account" />
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
          <MenuItem href="/about" icon={<FaInfoCircle />} label="About Us" />
          <MenuItem href="/contact" icon={<FaPhone />} label="Contact Us" />
        </div>

        {/* FOOTER */}
        <a
          href="https://wa.me/919873670361"
          target="_blank"
          style={styles.whatsapp}
        >
          <FaWhatsapp /> WhatsApp Support
        </a>

        {isLoggedIn && (
          <button style={styles.logout}>
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
        <span>{icon}</span>
        {label}
      </a>
    </Link>
  );
}

/* STYLES */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 999,
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 270,
    height: "100vh",
    background: "#fff",
    zIndex: 1000,
    padding: 16,
    display: "flex",
    flexDirection: "column",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 12,
  },
  sub: { fontSize: 12, color: "#6b7280" },
  menu: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  item: {
    display: "flex",
    gap: 12,
    padding: 10,
    borderRadius: 8,
    textDecoration: "none",
    color: "#111",
    fontSize: 15,
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
  },
};
