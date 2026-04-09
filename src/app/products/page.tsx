import type { Metadata } from "next";
import { CollectionIndexPage } from "@/components/site-pages";

export const metadata: Metadata = {
  title: "Products",
  description: "Reference pages for boards, kits, support expectations, and related generated hardware files.",
};

export default function ProductsPage() {
  return <CollectionIndexPage section="products" />;
}