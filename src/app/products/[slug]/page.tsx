import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionEntryPage } from "@/components/site-pages";
import { getCollectionEntries, getEntryBySlug } from "@/lib/site-content";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getCollectionEntries("products").map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug("products", slug);

  return {
    title: entry?.title,
    description: entry?.excerpt,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const entry = getEntryBySlug("products", slug);

  if (!entry) {
    notFound();
  }

  return <CollectionEntryPage entry={entry} />;
}