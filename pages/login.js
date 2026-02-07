import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Email & password required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/account");
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async () => {
    if (!form.name || !form.mobile || !form.email || !form.password) {
      alert("All fields required");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    // 👉 create basic customer record
    await supabase.from("customers").insert([
      {
        user_id: user.id,
        name: form.name,
        mobile: form.mobile,
        email: form.email,
      },
    ]);

    setLoading(false);
    router.push("/account");
  };

  return (
    <>
      <Head>
        <title>{mode === "login" ? "Login" : "Create Account"} | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <p style={styles.subtitle}>
            {mode === "login"
              ? "Login to continue ordering"
              : "Register once, order easily on WhatsApp"}
          </p>

          {mode === "signup" && (
            <>
              <input
                name="name"
                placeholder="Full Name *"
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="mobile"
                placeholder="Mobile Number *"
                onChange={handleChange}
                style={styles.input}
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address *"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password *"
            onChange={handleChange}
            style={styles.input}
          />

          {mode === "login" ? (
            <button
              onClick={handleLogin}
              style={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          ) : (
            <button
              onClick={handleSignup}
              style={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          )}

          <div style={styles.switch}>
            {mode === "login" ? (
              <>
                New to Bartanwala?{" "}
                <span onClick={() => setMode("signup")}>
                  Create account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setMode("login")}>Login</span>
              </>
            )}
          </div>

          <p style={styles.note}>
            🔒 Your details are safe. Address is required only at order time.
          </p>
        </div>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    background: "#fff",
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    marginBottom: 12,
    fontSize: 15,
  },

  primaryBtn: {
    width: "100%",
    padding: 14,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 6,
  },

  switch: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 14,
  },

  note: {
    marginTop: 14,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
};
