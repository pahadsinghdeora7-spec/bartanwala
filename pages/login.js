import { useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push("/account");
    }
  };

  return (
    <>
      <Head>
        <title>Login | Bartanwala</title>
      </Head>

      <div style={styles.page}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.link} onClick={() => router.push("/signup")}>
          New user? Create account
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
    background: "#0B5ED7",
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
