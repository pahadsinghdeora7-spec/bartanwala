import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/adminpages/dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Admin Login</h2>

          {error && <div style={styles.error}>{error}</div>}

          <input
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button onClick={login} style={styles.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6f8",
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 320,
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  btn: {
    width: "100%",
    marginTop: 14,
    padding: 12,
    borderRadius: 8,
    background: "#0B5ED7",
    color: "#fff",
    border: "none",
    fontWeight: 600,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    fontSize: 13,
  },
};
