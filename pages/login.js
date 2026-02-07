import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
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
    router.replace("/account");
  };

  return (
    <>
      <Head>
        <title>Login | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <form style={styles.card} onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p style={styles.sub}>Login to continue ordering</p>

          {error && <p style={styles.error}>{error}</p>}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button disabled={loading} style={styles.btn}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.link} onClick={() => router.push("/signup")}>
            New to Bartanwala? Create account
          </p>

          <p style={styles.note}>
            🔒 Your details are safe. Address required only at order time.
          </p>
        </form>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6f8",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  sub: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 18,
  },
  input: {
    width: "100%",
    padding: 14,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 15,
  },
  btn: {
    width: "100%",
    padding: 14,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginBottom: 12,
  },
  link: {
    marginTop: 14,
    color: "#2563eb",
    cursor: "pointer",
    fontSize: 14,
  },
  note: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
  },
};
