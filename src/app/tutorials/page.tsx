import type { Metadata } from "next";
import { CollectionIndexPage } from "@/components/site-pages";

export const metadata: Metadata = {
  title: "Tutorials",
  description: "Step-by-step guides for electronics projects, bring-up, and publishing generated hardware artifacts.",
};

export default function TutorialsPage() {
  return <CollectionIndexPage section="tutorials" />;
}