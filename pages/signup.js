import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSupabase } from "../lib/supabase";

export default function SignupPage() {
  const supabase = getSupabase();
  const router = useRouter();

  const [form, setForm] = useState({
    business: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.mobile || !form.password) {
      setError("Please fill all required fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          business: form.business,
          name: form.name,
          mobile: form.mobile,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/account");
  }

  return (
    <>
      <Head>
        <title>Create Account | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <form style={styles.card} onSubmit={handleSignup}>
          <h1 style={styles.title}>Create Your Bartanwala Account</h1>
          <p style={styles.subtitle}>
            Wholesale steel & aluminium utensils for bulk buyers
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <input
            name="business"
            placeholder="Business / Shop Name (optional)"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="name"
            placeholder="Contact Person Name (optional)"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email Address *"
            type="email"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="mobile"
            placeholder="Mobile Number *"
            type="tel"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="password"
            placeholder="Create Password *"
            type="password"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <small style={styles.hint}>
            Password must be at least 6 characters
          </small>

          <button style={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p style={styles.footer}>
            Already have an account?{" "}
            <Link href="/login">
              <a style={styles.link}>Login</a>
            </Link>
          </p>

          <p style={styles.lock}>🔒 Your details are safe & secure</p>
        </form>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f6f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 14,
    maxWidth: 420,
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    marginBottom: 10,
    fontSize: 14,
  },

  hint: {
    fontSize: 12,
    color: "#6b7280",
  },

  button: {
    width: "100%",
    marginTop: 14,
    padding: 14,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
  },

  footer: {
    marginTop: 14,
    fontSize: 14,
    textAlign: "center",
  },

  link: {
    color: "#2563eb",
    fontWeight: 600,
    textDecoration: "none",
  },

  lock: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
};
