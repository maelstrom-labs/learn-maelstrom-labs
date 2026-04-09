import type { Metadata } from "next";
import { CollectionIndexPage } from "@/components/site-pages";

export const metadata: Metadata = {
  title: "Blog",
  description: "Lab notes, revision retrospectives, and engineering essays from ongoing electronic projects.",
};

export default function BlogPage() {
  return <CollectionIndexPage section="blog" />;
}