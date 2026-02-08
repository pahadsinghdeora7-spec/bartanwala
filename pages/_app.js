import "../styles/globals.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import MainLayout from "../layouts/MainLayout";

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setLoading(false);
    });

    // 2️⃣ Listen auth changes (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ⛔ prevent flicker during auth load
  if (loading) return null;

  return (
    <MainLayout user={user}>
      <Component {...pageProps} />
    </MainLayout>
  );
}
