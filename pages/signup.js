import { useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Account created. Please login.");
      router.push("/login");
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <h2>Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={signup} style={styles.btn} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p style={styles.link} onClick={() => router.push("/login")}>
          Already have account? Login
        </p>
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: 20,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  btn: {
    padding: 14,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
  },
  link: {
    marginTop: 10,
    textAlign: "center",
    color: "#0B5ED7",
    cursor: "pointer",
  },
};
