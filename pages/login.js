import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSupabase } from "../lib/supabase";

export default function LoginPage() {
  const supabase = getSupabase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
        <title>Login | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <form style={styles.card} onSubmit={handleLogin}>
          <h1 style={styles.title}>Login to Bartanwala</h1>
          <p style={styles.subtitle}>
            Wholesale utensils | B2B bulk ordering
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.footer}>
            New customer?{" "}
            <Link href="/signup">
              <a style={styles.link}>Create Account</a>
            </Link>
          </p>

          <p style={styles.lock}>🔒 Secure B2B Login</p>
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
    maxWidth: 400,
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
    marginBottom: 12,
    fontSize: 14,
  },

  button: {
    width: "100%",
    padding: 14,
    background: "#2563eb",
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
