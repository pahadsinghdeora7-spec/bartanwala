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
  const router = useRouter();

  if (!open) return null;

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

        {/* MENU */}
        <div style={styles.menu}>
          <MenuItem href="/" icon={<FaHome />} label="Home" />
          <MenuItem href="/categories" icon={<FaThLarge />} label="Categories" />

          {isLoggedIn && (
            <>
              <MenuItem href="/orders" icon={<FaClipboardList />} label="My Orders" />
              <MenuItem href="/account" icon={<FaUser />} label="My Account" />
            </>
          )}

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
          <MenuItem href="/about" icon={<FaInfoCircle />} label="About Us" />
          <MenuItem href="/contact" icon={<FaPhone />} label="Contact Us" />
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
    <Link href={href} legacyBehavior>
      <a style={styles.item}>
        <span style={styles.icon}>{icon}</span>
        {label}
      </a>
    </Link>
  );
}

/* STYLES SAME AS BEFORE */
