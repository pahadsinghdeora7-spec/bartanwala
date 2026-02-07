import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabaseAdmin.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/adminpages/login");
      } else {
        setChecking(false);
      }
    });
  }, []);

  if (checking) return null;

  return (
    <div style={{ padding: 20, background: "#f5f6f8", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
