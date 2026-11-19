import type { Metadata } from "next";
import Link from "next/link";
import { ExamPlan } from "@/components/ExamPlan";
import { Guide } from "@/components/Guide";
import { techniques } from "@/lib/catalog";
import type { BeltId, CategoryId, Technique } from "@/lib/types";

export const metadata: Metadata = {
  title: "Wochenpläne",
  description: "Drei Trainingseinheiten für Weiß, Weiß-Gelb, Gelb und Orange, aus dem JudoNOW-Katalog.",
  alternates: { canonical: "/plan" },
};

function pick(belt: BeltId, category: CategoryId, count: number) {
  return techniques.filter((technique) => technique.belt === belt && technique.category === category).slice(0, count);
}

const PLANS: {
  title: string;
  note: string;
  caution?: string;
  days: { title: string; items: Technique[] }[];
}[] = [
  {
    title: "Weiß · drei Einheiten",
    note: "Noch kein Wurf um jeden Preis. Erst Gruß, Stand und Fallen.",
    days: [
      { title: "Einheit 1 · Dojo", items: pick("weiss", "grundlage", 4) },
      { title: "Einheit 2 · Ukemi", items: pick("weiss", "fallschule", 4) },
      { title: "Einheit 3 · Wiederholen", items: [...pick("weiss", "grundlage", 2), ...pick("weiss", "fallschule", 2)] },
    ],
  },
  {
    title: "Weiß-Gelb · drei Einheiten",
    note: "Der erste Wurf und der erste Haltegriff. Vorher kurz Ukemi aus dem Weißgurt.",
    days: [
      { title: "Einheit 1 · Wurf", items: pick("weiss-gelb", "wurf", 4) },
      { title: "Einheit 2 · Boden", items: pick("weiss-gelb", "haltegriff", 4) },
      {
        title: "Einheit 3 · Mischen",
        items: [...pick("weiss-gelb", "wurf", 2), ...pick("weiss-gelb", "haltegriff", 2)],
      },
    ],
  },
  {
    title: "Gelb · drei Einheiten",
    note: "Große Würfe, Halten, und die ersten Klammern. Klammern nur bis zum Abtippen.",
    caution: "Armhebel langsam führen. Uke tippt, Tori lässt los.",
    days: [
      { title: "Einheit 1 · Nage Waza", items: pick("gelb", "wurf", 4) },
      { title: "Einheit 2 · Osaekomi", items: pick("gelb", "haltegriff", 4) },
      { title: "Einheit 3 · Kansetsu", items: pick("gelb", "klammer", 3) },
    ],
  },
  {
    title: "Orange · drei Einheiten",
    note: "Weitere Würfe und die ersten Würgegriffe. Würgen nur mit Aufsicht.",
    caution: "Beim Schwindel sofort loslassen. Kein Würgen ohne Trainerin oder Trainer.",
    days: [
      { title: "Einheit 1 · Würfe", items: pick("orange", "wurf", 4) },
      { title: "Einheit 2 · Shime Waza", items: pick("orange", "wuergegriff", 3) },
      {
        title: "Einheit 3 · Wiederholen",
        items: [...pick("orange", "wurf", 2), ...pick("orange", "haltegriff", 2)],
      },
    ],
  },
];

export default function Page() {
  return (
    <Guide
      eyebrow="Drei Einheiten, ein Rang"
      title="Wochenpläne"
      lead="Jede Einheit nimmt Techniken, die auf genau diesem Gürtel liegen. Danach der Film oder die vier Schritte, nicht eine neue Liste."
    >
      <ExamPlan />
      <h2>Pläne nach Farbe</h2>
      <div className="plan-stack">
        {PLANS.map((plan) => (
          <section key={plan.title} className="plan-card">
            <h2>{plan.title}</h2>
            <p>{plan.note}</p>
            {plan.caution && <p className="plan-caution">{plan.caution}</p>}
            <div className="plan-days">
              {plan.days.map((day) => (
                <div key={day.title}>
                  <h3>{day.title}</h3>
                  {day.items.length === 0 ? (
                    <p>Für diesen Block liegt noch nichts im Katalog.</p>
                  ) : (
                    <ul>
                      {day.items.map((technique) => (
                        <li key={`${day.title}-${technique.slug}`}>
                          <Link href={`/technik/${technique.slug}`}>{technique.reading}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="guide-note">
        Davor zehn Minuten <Link href="/workout">Workout</Link>, mit Matte oder ohne. Ab Grün nimmst du unter Übungen
        „Dieser Gürtel“ und wiederholst drei Würfe, die du noch nicht abgehakt hast.
      </p>
    </Guide>
  );
}
