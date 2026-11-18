import type { Metadata } from "next";
import Link from "next/link";
import { Guide } from "@/components/Guide";
import { EXAM_STEPS } from "@/lib/library";

export const metadata: Metadata = {
  title: "Prüfung",
  description: "So bereitest du die Gürtelprüfung mit JudoNOW vor: Rang wählen, Würfe abhaken, Filme und Karten.",
  alternates: { canonical: "/pruefung" },
};

export default function Page() {
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
      <p className="guide-note">
        Start unter <Link href="/ueben">Übungen</Link>, dann <Link href="/plan">Wochenplan</Link> und{" "}
        <Link href="/karten">Karten</Link>.
      </p>
    </Guide>
  );
}
