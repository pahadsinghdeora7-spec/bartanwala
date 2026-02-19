import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function ContactPage() {

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ================= LOAD CMS DATA ================= */

  useEffect(() => {
    loadPage();
  }, []);


  async function loadPage() {

    try {

      const { data, error } = await supabase
        .from("cms")
        .select("*")
        .eq("slug", "contact")
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
        Loading Contact Page...
      </div>
    );

  }


  /* ================= NOT FOUND ================= */

  if (!page) {

    return (
      <div style={styles.page}>
        Contact information not found.
      </div>
    );

  }


  /* ================= UI ================= */

  return (

    <>
      <Head>
        <title>{page.title || "Contact Us"} | Bartanwala</title>
      </Head>


      <div style={styles.page}>


        {/* CARD */}

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


          {/* QUICK ACTION BUTTON */}

          <a
            href="https://wa.me/919873670361"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.button}
          >
            Contact on WhatsApp
          </a>


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

    marginBottom: 20

  },


  text: {

    fontSize: 15,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 1.6

  },


  button: {

    display: "block",
    textAlign: "center",
    padding: 14,
    borderRadius: 10,
    background: "#25D366",
    color: "#fff",
    fontWeight: 700,
    textDecoration: "none"

  }

};
