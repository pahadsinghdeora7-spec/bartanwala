import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Bartanwala | Wholesale Steel & Aluminium Utensils</title>
        <meta
          name="description"
          content="Wholesale steel and aluminium utensils supplier for hotels, restaurants, caterers and bulk buyers across India."
        />
      </Head>

      <main style={{ maxWidth: "1100px", margin: "auto", padding: "24px" }}>
        {/* HEADER */}
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ marginBottom: "8px" }}>Bartanwala</h1>
          <p style={{ color: "#555" }}>
            Wholesale Steel & Aluminium Utensils – All India
          </p>

          <a
            href="https://wa.me/919873670361"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "10px 16px",
              background: "#25D366",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            WhatsApp Order
          </a>
        </header>

        {/* HERO / INTRO */}
        <section style={{ marginBottom: "40px" }}>
          <h2>Wholesale Steel & Aluminium Utensils Supplier</h2>
          <p style={{ maxWidth: "700px", color: "#444" }}>
            Supplying hotels, restaurants, caterers and bulk buyers with premium
            quality stainless steel and aluminium utensils at wholesale prices
            across India.
          </p>

          <ul style={{ marginTop: "12px", paddingLeft: "18px" }}>
            <li>Bulk orders accepted</li>
            <li>Multiple sizes & gauges available</li>
            <li>Suitable for hotel & catering use</li>
            <li>Pan India supply</li>
          </ul>
        </section>

        {/* CATEGORIES */}
        <section style={{ marginBottom: "40px" }}>
          <h2>Product Categories</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {/* CATEGORY CARD */}
            <div style={cardStyle}>
              <h3>Aluminium Bartan</h3>
              <p style={cardText}>
                Aluminium deg, dabba, patila and cookware for hotels, caterers
                and bulk buyers.
              </p>
              <Link href="/category/aluminium-bartan">View Products →</Link>
            </div>

            <div style={cardStyle}>
              <h3>Aluminium Deg & Dabba</h3>
              <p style={cardText}>
                Heavy duty aluminium degs and dabbas suitable for commercial
                kitchen and bulk cooking.
              </p>
              <Link href="/category/aluminium-deg-dabba">View Products →</Link>
            </div>

            <div style={cardStyle}>
              <h3>Steel Bartan</h3>
              <p style={cardText}>
                Stainless steel utensils, patila, paraat and bulk items for
                hotels and retail stores.
              </p>
              <Link href="/category/steel-bartan">View Products →</Link>
            </div>

            <div style={cardStyle}>
              <h3>Steel Thali & Parat</h3>
              <p style={cardText}>
                Premium quality steel thali and parat available in multiple
                sizes and gauges.
              </p>
              <Link href="/category/steel-thali-parat">View Products →</Link>
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section style={{ marginBottom: "40px" }}>
          <h2>Why Buy From Bartanwala?</h2>
          <ul style={{ paddingLeft: "18px", color: "#444" }}>
            <li>Wholesale pricing for bulk buyers</li>
            <li>Products suitable for hotels & catering businesses</li>
            <li>Consistent quality supply</li>
            <li>Direct WhatsApp ordering – no middleman</li>
          </ul>
        </section>

        {/* CTA */}
        <section
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h2>Need Bulk Utensils at Wholesale Price?</h2>
          <p style={{ color: "#444" }}>
            Contact us on WhatsApp for latest prices and availability.
          </p>

          <a
            href="https://wa.me/919873670361"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "12px 20px",
              background: "#25D366",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Chat on WhatsApp
          </a>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid #eee", paddingTop: "16px" }}>
          <p style={{ fontSize: "14px", color: "#777" }}>
            © 2026 Bartanwala
            <br />
            B2B Wholesale Utensils Platform – India
          </p>
        </footer>
      </main>
    </>
  );
}

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  padding: "16px",
};

const cardText = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "8px",
};
