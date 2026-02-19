import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function PoliciesPage() {

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ================= LOAD CMS DATA ================= */

  useEffect(() => {
    loadPolicies();
  }, []);


  async function loadPolicies() {

    try {

      const { data, error } = await supabase
        .from("cms")
        .select("*")
        .eq("slug", "policies")
        .single();

      if (error) {
        console.error(error);
      }

      setPage(data);

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  }


  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div style={styles.page}>
        Loading Policies...
      </div>
    );

  }


  /* ================= NOT FOUND ================= */

  if (!page) {

    return (
      <div style={styles.page}>
        Policies not available.
      </div>
    );

  }


  /* ================= UI ================= */

  return (

    <>
      <Head>
        <title>{page.title || "Policies"} | Bartanwala</title>
      </Head>


      <div style={styles.page}>


        <div style={styles.card}>


          {/* TITLE */}

          <h1 style={styles.title}>
            {page.title}
          </h1>


          {/* CONTENT */}

          <div style={styles.content}>

            {page.content?.split("\n").map((line, index) => (

              <p key={index} style={styles.text}>
                {line}
              </p>

            ))}

          </div>


        </div>


      </div>

    </>

  );

}



/* ================= STYLES ================= */

const styles = {

  page: {

    padding: 16,
    background: "#F3F4F6",
    minHeight: "100vh"

  },


  card: {

    background: "#fff",
    borderRadius: 14,
    padding: 20,
    border: "1px solid #E5E7EB"

  },


  title: {

    fontSize: 22,
    fontWeight: 700,
    marginBottom: 16,
    color: "#111827"

  },


  content: {

    marginBottom: 10

  },


  text: {

    fontSize: 15,
    color: "#374151",
    marginBottom: 10,
    lineHeight: 1.7

  }

};
