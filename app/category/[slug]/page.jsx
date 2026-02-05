import { supabase } from "../../../lib/supabase";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    return {
      title: "Category Not Found | Bartanwala",
    };
  }

  return {
    title: `${category.name} Wholesale Price | Bartanwala`,
    description:
      category.description ||
      `Buy ${category.name} at wholesale price across India`,
  };
}
