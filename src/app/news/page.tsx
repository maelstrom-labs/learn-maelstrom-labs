import type { Metadata } from "next";
import { CollectionIndexPage } from "@/components/site-pages";

export const metadata: Metadata = {
  title: "News",
  description: "Release updates, project signals, and milestones for the documentation and hardware pipeline.",
};

export default function NewsPage() {
  return <CollectionIndexPage section="news" />;
}