import Head from "next/head";
import { getSupabase } from "../../lib/supabase";
import { FaWhatsapp, FaRupeeSign, FaBoxOpen } from "react-icons/fa";

export async function getServerSideProps({ params }) {
  const supabase = getSupabase();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, price_unit, image, moq, in_stock"
    )
    .eq("slug", params.slug)
    .single();

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
  };
}

export default function ProductPage({ product }) {
  const whatsappMessage = encodeURIComponent(
    `Hello Bartanwala,%0A%0AI want to order:%0A${product.name}%0APrice: ₹${product.price}/${product.price_unit}%0AMOQ: ${product.moq || "As per availability"}`
  );

  return (
    <>
      <Head>
        <title>{product.name} | Bartanwala</title>
        <meta
          name="description"
          content={
            product.description ||
            `Wholesale ${product.name} at factory price. All India delivery.`
          }
        />

        {/* PRODUCT SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: product.image,
              description: product.description,
              offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: product.price,
                availability: product.in_stock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              },
            }),
          }}
        />
      </Head>

      <main style={{ padding: 16 }}>
        {/* IMAGE */}
        <div style={{ height: 220, marginBottom: 12 }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* TITLE */}
        <h1>{product.name}</h1>

        {/* PRICE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#0B5ED7",
            fontSize: 18,
            marginTop: 6,
          }}
        >
          <FaRupeeSign />
          <strong>{product.price}</strong> / {product.price_unit}
        </div>

        {/* META */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 8,
            fontSize: 13,
          }}
        >
          {product.moq && (
            <span>
              <FaBoxOpen /> MOQ: {product.moq}
            </span>
          )}
          <span>
            Status:{" "}
            {product.in_stock ? (
              <strong style={{ color: "green" }}>In Stock</strong>
            ) : (
              <strong style={{ color: "red" }}>Out of Stock</strong>
            )}
          </span>
        </div>

        {/* DESCRIPTION */}
        {product.description && (
          <p style={{ marginTop: 12, color: "#374151" }}>
            {product.description}
          </p>
        )}

        {/* WHATSAPP BUTTON */}
        <a
          href={`https://wa.me/919873670361?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#25D366",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          <FaWhatsapp /> Order on WhatsApp
        </a>
      </main>
    </>
  );
}
