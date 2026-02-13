import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function OrderSuccess() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      setOrder(data);
    }

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🎉 Order Successfully Placed</h2>

      <p><strong>Order Number:</strong> {order.order_number}</p>
      <p><strong>Status:</strong> {order.order_status}</p>
      <p><strong>Payment:</strong> {order.payment_status}</p>
      <p><strong>Total:</strong> ₹ {order.total_amount}</p>

      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: 20,
          padding: 12,
          background: "#0B5ED7",
          color: "#fff",
          border: "none",
          borderRadius: 8,
        }}
      >
        Back to Home
      </button>
    </div>
  );
}
