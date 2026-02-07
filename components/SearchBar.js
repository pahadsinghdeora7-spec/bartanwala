export default function SearchBar() {
  return (
    <div
      style={{
        padding: 10,
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      <input
        placeholder="Search steel bartan, thali, deg..."
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 4,
          border: "1px solid #d1d5db",
        }}
      />
    </div>
  );
}
