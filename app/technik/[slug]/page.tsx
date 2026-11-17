import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TechniqueArticle } from "@/components/TechniqueArticle";
import { getTechnique, techniques } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return techniques.map((technique) => ({ slug: technique.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const technique = getTechnique(slug);
  if (!technique) return { title: "Nicht gefunden" };
  return {
    title: technique.reading,
    description: technique.principle,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = getTechnique(slug);
  if (!technique) notFound();
  return <TechniqueArticle technique={technique} />;
}
