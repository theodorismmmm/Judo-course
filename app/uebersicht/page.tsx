import type { Metadata } from "next";
import { SiteMapPage } from "@/components/SiteMapPage";

export const metadata: Metadata = {
  title: "Seitenübersicht",
  description:
    "Deutsche Seitenübersicht von JudoNOW: Übungen, Filme, Workouts, Karteikarten und alle Techniken nach Gürtel.",
  alternates: {
    canonical: "/uebersicht",
  },
};

export default function Page() {
  return <SiteMapPage />;
}
