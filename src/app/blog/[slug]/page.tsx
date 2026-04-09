import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionEntryPage } from "@/components/site-pages";
import { getCollectionEntries, getEntryBySlug } from "@/lib/site-content";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getCollectionEntries("blog").map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug("blog", slug);

  return {
    title: entry?.title,
    description: entry?.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const entry = getEntryBySlug("blog", slug);

  if (!entry) {
    notFound();
  }

  return <CollectionEntryPage entry={entry} />;
}