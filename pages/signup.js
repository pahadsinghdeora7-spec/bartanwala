import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 👇 Insert into customers table
    await supabase.from("customers").insert({
      user_id: data.user.id,
      name: form.name,
      mobile: form.mobile,
      email: form.email,
    });

    setLoading(false);
    router.replace("/account");
  };

  return (
    <>
      <Head>
        <title>Create Account | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <form style={styles.card} onSubmit={handleSignup}>
          <h2>Create Account</h2>
          <p style={styles.sub}>B2B wholesale ordering made easy</p>

          {error && <p style={styles.error}>{error}</p>}

          <input
            name="name"
            placeholder="Full Name *"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="mobile"
            placeholder="Mobile Number *"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address *"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password *"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button disabled={loading} style={styles.btn}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p style={styles.link} onClick={() => router.push("/login")}>
            Already have an account? Login
          </p>

          <p style={styles.note}>
            🔐 Address & GST details required only during checkout.
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
    maxWidth: 400,
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
