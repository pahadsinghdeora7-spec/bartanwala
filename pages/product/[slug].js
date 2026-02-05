import { supabase } from "../../lib/supabase";

export async function getServerSideProps({ params }) {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) {
    return { notFound: true };
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("position");

  return {
    props: { product, images: images || [] }
  };
}

export default function Product({ product, images }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {images.map(img => (
        <img
          key={img.id}
          src={img.image_url}
          alt={img.alt_text || product.name}
          width={220}
        />
      ))}

      <p>
        ₹{product.price} / {product.price_unit}
      </p>

      <a
        href={`https://wa.me/919873670361?text=Need ${product.name}`}
        target="_blank"
      >
        Order on WhatsApp
      </a>
    </main>
  );
  }
