import type { Metadata } from "next";
import { TrainerRoom } from "@/components/TrainerRoom";

export const metadata: Metadata = {
  title: "Trainer",
  description: "Eine Dojo-Gruppe anlegen und sehen, welchen Gürtel und welche offenen Würfe die Judoka haben.",
  alternates: { canonical: "/trainer" },
};

export default function Page() {
  return <TrainerRoom />;
}
