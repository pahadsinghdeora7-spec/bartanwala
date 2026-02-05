export const metadata = {
  title: "Bartanwala | Wholesale Steel & Aluminium Utensils India",
  description:
    "Bartanwala is a B2B wholesale platform for steel and aluminium utensils for hotels, catering, restaurants and bulk buyers across India.",
};

export default function HomePage() {
  return (
    <main style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>Bartanwala – Wholesale Utensils Supplier</h1>

      <p>
        Bartanwala is a B2B wholesale platform supplying stainless steel and
        aluminium utensils to hotels, caterers, restaurants and bulk buyers
        across India.
      </p>

      <h2>Product Categories</h2>
      <ul>
        <li><a href="/category/steel-bartan">Steel Bartan</a></li>
        <li><a href="/category/steel-thali-parat">Steel Thali & Steel Parat</a></li>
        <li><a href="/category/aluminium-deg">Aluminium Deg</a></li>
        <li><a href="/category/aluminium-dabba">Aluminium Dabba</a></li>
        <li><a href="/category/steel-pawali">Steel Pawali</a></li>
      </ul>

      <h2>Why Bartanwala?</h2>
      <ul>
        <li>Wholesale pricing (KG / PCS / DOZEN / SET)</li>
        <li>Hotel & catering grade quality</li>
        <li>All India supply</li>
        <li>SEO optimized product & category pages</li>
      </ul>
    </main>
  );
}
