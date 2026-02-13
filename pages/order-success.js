import { useRouter } from "next/router";

export default function OrderSuccess() {
  const router = useRouter();
  const { order } = router.query;

  return (
    <div style={{ padding: 20 }}>
      <h2>🎉 Order Successfully Placed</h2>
      <p>Your Order Number: <strong>{order}</strong></p>
      <p>Status: Processing</p>
      <p>Payment Status: Pending</p>

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
