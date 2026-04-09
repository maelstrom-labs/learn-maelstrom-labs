import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionEntryPage } from "@/components/site-pages";
import { getCollectionEntries, getEntryBySlug } from "@/lib/site-content";

interface TutorialPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getCollectionEntries("tutorials").map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug("tutorials", slug);

  return {
    title: entry?.title,
    description: entry?.excerpt,
  };
}

export default async function TutorialDetailPage({
  params,
}: TutorialPageProps) {
  const { slug } = await params;
  const entry = getEntryBySlug("tutorials", slug);

  if (!entry) {
    notFound();
  }

  return <CollectionEntryPage entry={entry} />;
}