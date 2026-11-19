import type { Metadata } from "next";
import Link from "next/link";
import { ExamRoom } from "@/components/ExamRoom";
import { Guide } from "@/components/Guide";
import { isBelt } from "@/lib/belts";
import { EXAM_STEPS } from "@/lib/library";

export const metadata: Metadata = {
  title: "Prüfung",
  description: "Probetest pro Gürtel, mit XP und den Techniken, die noch fehlen. Dazu die Woche vor der Prüfung.",
  alternates: { canonical: "/pruefung" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ gurt?: string }> }) {
  const params = await searchParams;
  const initialBelt = isBelt(params.gurt) ? params.gurt : null;
  return (
    <Guide
      eyebrow="Die Woche davor"
      title="Prüfung"
      lead="JudoNOW ersetzt nicht die Prüfung im Verein. Es sortiert, was du schon kannst und was du noch einmal ansehen solltest."
    >
      <ol className="step-list">
        {EXAM_STEPS.map((step, index) => (
          <li key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <ExamRoom initialBelt={initialBelt} />
      <p className="guide-note">
        Start unter <Link href="/ueben">Übungen</Link>, dann <Link href="/plan">Wochenplan</Link> und{" "}
        <Link href="/karten">Karten</Link>.
      </p>
    </Guide>
  );
}
