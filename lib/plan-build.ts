import { beltIndex, categoryById } from "./belts";
import { todayKey } from "./days";
import type { BeltId, CategoryId, Technique } from "./types";

export type Phase = "weit" | "aufbau" | "woche" | "vorbei";

export type PlanDay = { title: string; slugs: string[] };

export type BuiltPlan = {
  phase: Phase;
  note: string;
  days: PlanDay[];
};

const ORDER: CategoryId[] = [
  "grundlage",
  "fallschule",
  "wurf",
  "haltegriff",
  "wuergegriff",
  "klammer",
  "entkommen",
  "verbindung",
  "studium",
];

export function daysUntil(iso: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const today = todayKey(now);
  const start = Date.parse(`${today}T00:00:00Z`);
  const end = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.round((end - start) / 86400000);
}

export function phaseFor(days: number): Phase {
  if (days < 0) return "vorbei";
  if (days <= 7) return "woche";
  if (days <= 21) return "aufbau";
  return "weit";
}

function take(list: Technique[], count: number) {
  return list.slice(0, count).map((technique) => technique.slug);
}

function unknown(list: Technique[], known: string[]) {
  const have = new Set(known);
  return list.filter((technique) => !have.has(technique.slug));
}

export function buildWeek(input: {
  belt: BeltId;
  phase: Phase;
  known: string[];
  weak: string[];
  list: Technique[];
}): BuiltPlan {
  const { belt, phase, known, weak, list } = input;
  const rank = beltIndex(belt);
  const here = list.filter((technique) => technique.belt === belt);
  const earlier = list.filter((technique) => beltIndex(technique.belt) < rank);
  const pathThrows = list.filter((technique) => technique.category === "wurf" && beltIndex(technique.belt) <= rank);

  if (phase === "woche") {
    const open = unknown(pathThrows, known);
    const pool = (open.length ? open : pathThrows).slice(0, 12);
    const size = Math.max(1, Math.ceil(pool.length / 3));
    const days: PlanDay[] = [];
    for (let index = 0; index < pool.length && days.length < 3; index += size) {
      days.push({
        title: `Prüfungstag ${days.length + 1}`,
        slugs: pool.slice(index, index + size).map((technique) => technique.slug),
      });
    }
    return {
      phase,
      note: open.length
        ? "Prüfungswoche. Keine neuen Namen, nur was noch fehlt."
        : "Prüfungswoche. Alles abgehakt. Sag die Namen noch einmal laut.",
      days,
    };
  }

  if (phase === "aufbau") {
    const fresh = unknown(here, known);
    const review = unknown(earlier, known);
    const weakTechniques = weak
      .map((slug) => list.find((technique) => technique.slug === slug))
      .filter((technique): technique is Technique => Boolean(technique));
    const days: PlanDay[] = [
      { title: "Lücken auf diesem Gürtel", slugs: take(fresh.length ? fresh : here, 4) },
      { title: "Wiederholen", slugs: take(review.length ? review : earlier, 4) },
      { title: "Oft daneben", slugs: take(weakTechniques.length ? weakTechniques : fresh.slice(4), 4) },
    ].filter((day) => day.slugs.length > 0);
    return {
      phase,
      note: "Noch ein paar Wochen. Erst die Lücken, dann ein bisschen Neues.",
      days,
    };
  }

  const buckets = ORDER.map((category) => here.filter((technique) => technique.category === category)).filter(
    (bucket) => bucket.length > 0,
  );
  const days = [0, 1, 2]
    .map((index) => {
      const bucket = buckets[index];
      if (!bucket?.length) return null;
      return {
        title: categoryById(bucket[0].category).label,
        slugs: take(bucket, 4),
      };
    })
    .filter((day): day is PlanDay => Boolean(day));

  return {
    phase: phase === "vorbei" ? "vorbei" : "weit",
    note:
      phase === "vorbei"
        ? "Das Datum liegt zurück. Trag ein neues ein, oder üb diese Einheiten."
        : "Noch Zeit. Drei Einheiten auf diesem Gürtel.",
    days,
  };
}
