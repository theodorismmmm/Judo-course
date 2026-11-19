import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchRoom } from "@/components/SearchRoom";

export const metadata: Metadata = {
  title: "Suche",
  description: "Techniksuche über alle Gürtel. Seoi findet Ippon Seoi Nage, Morote Seoi Nage und Seoi Otoshi.",
  alternates: { canonical: "/suche" },
};

export default function Page() {
  return (
    <Suspense fallback={<p className="loading">Suche wird geladen …</p>}>
      <SearchRoom />
    </Suspense>
  );
}
