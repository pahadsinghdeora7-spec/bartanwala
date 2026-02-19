import { useRouter } from "next/router";

export default function SearchBar() {

  const router = useRouter();

  /* ================= SHOW ONLY ON THESE PAGES ================= */

  const SHOW_SEARCH = [

    "/",                    // Home
    "/categories",         // Categories
    "/category",           // Category dynamic
    "/subcategory",        // Subcategory dynamic
    "/products",           // Products list

  ];

  const path = router.pathname;

  const shouldShow = SHOW_SEARCH.some(route =>
    path === route || path.startsWith(route + "/")
  );

  /* ================= HIDE SEARCH ================= */

  if (!shouldShow) return null;


  /* ================= UI ================= */

  return (

    <div
      style={{
        padding: 10,
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
        position: "sticky",
        top: 60,
        zIndex: 40
      }}
    >

      <input
        placeholder="Search steel bartan, thali, deg..."
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
          outline: "none",
          background: "#f9fafb"
        }}
      />

    </div>

  );

}
