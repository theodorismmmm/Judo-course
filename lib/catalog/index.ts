import { BELTS } from "../belts";
import { MOTIONS } from "../motions";
import type { BeltId, CategoryId, Technique } from "../types";
import { brown } from "./brown";
import { dan } from "./dan";
import { early } from "./early";
import { middle } from "./middle";
import { VIDEOS } from "./videos";

export const techniques: Technique[] = [...early, ...middle, ...brown, ...dan].map((technique) => {
  const video = VIDEOS[technique.slug];
  return video ? { ...technique, youtube: video.id, videoBy: video.by } : technique;
});

const slugs = new Set<string>();
for (const technique of techniques) {
  if (slugs.has(technique.slug)) {
    throw new Error(`Doppelter Slug: ${technique.slug}`);
  }
  slugs.add(technique.slug);
  if (!MOTIONS[technique.motion]) {
    throw new Error(`Bewegung fehlt: ${technique.slug} → ${technique.motion}`);
  }
  if (technique.steps.length !== 4) {
    throw new Error(`Vier Phasen nötig: ${technique.slug}`);
  }
  if (technique.youtube && !/^[A-Za-z0-9_-]{11}$/.test(technique.youtube)) {
    throw new Error(`Video-ID ungültig: ${technique.slug}`);
  }
}

for (const slug of Object.keys(VIDEOS)) {
  if (!slugs.has(slug)) {
    throw new Error(`Video ohne Übung: ${slug}`);
  }
}

for (const belt of BELTS) {
  if (!techniques.some((technique) => technique.belt === belt.id)) {
    throw new Error(`Leerer Gürtel: ${belt.id}`);
  }
}

export function getTechnique(slug: string) {
  return techniques.find((technique) => technique.slug === slug);
}

export function techniquesFor(belt: BeltId, scope: "rank" | "path") {
  const rank = BELTS.findIndex((item) => item.id === belt);
  return techniques.filter((technique) => {
    const index = BELTS.findIndex((item) => item.id === technique.belt);
    return scope === "rank" ? technique.belt === belt : index <= rank;
  });
}

export function neighbors(technique: Technique) {
  const list = techniques.filter((item) => item.belt === technique.belt);
  const index = list.findIndex((item) => item.slug === technique.slug);
  return {
    prev: index > 0 ? list[index - 1] : undefined,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
  };
}

export function countLine(list: Technique[]) {
  const counts = new Map<CategoryId, number>();
  for (const technique of list) {
    counts.set(technique.category, (counts.get(technique.category) ?? 0) + 1);
  }
  return counts;
}

export function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/gatame/g, "katame")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchText(technique: Technique) {
  return normalize(
    [technique.de, technique.reading, technique.jp, technique.kanji, technique.group, technique.alias ?? ""].join(" "),
  );
}
