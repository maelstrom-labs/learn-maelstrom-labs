import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionEntryPage } from "@/components/site-pages";
import { getCollectionEntries, getEntryBySlug } from "@/lib/site-content";

interface NewsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getCollectionEntries("news").map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug("news", slug);

  return {
    title: entry?.title,
    description: entry?.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const entry = getEntryBySlug("news", slug);

  if (!entry) {
    notFound();
  }

  return <CollectionEntryPage entry={entry} />;
}