import { techniques } from "./catalog";
import type { CategoryId, Technique } from "./types";

export const FILM_SETS = ["wurf", "konter", "boden", "alle"] as const;
export type FilmSet = (typeof FILM_SETS)[number];

export function isFilmSet(value: string | null | undefined): value is FilmSet {
  return FILM_SETS.includes(value as FilmSet);
}

export function isCounter(technique: Technique) {
  if (technique.category !== "wurf" || technique.slug === "sumi-gaeshi") return false;
  return technique.slug.endsWith("-gaeshi") || technique.slug.endsWith("-sukashi");
}

export function filmsFor(set: FilmSet) {
  return techniques.filter((technique) => {
    if (!technique.youtube) return false;
    if (set === "alle") return true;
    if (set === "konter") return isCounter(technique);
    if (set === "boden") return technique.category === "haltegriff" || technique.category === "wuergegriff" || technique.category === "klammer";
    return technique.category === "wurf";
  });
}

export const CARD_MODES = [
  { id: "wurf", label: "Würfe" },
  { id: "konter", label: "Konter" },
  { id: "haltegriff", label: "Haltegriffe" },
  { id: "wuergegriff", label: "Würgegriffe" },
  { id: "klammer", label: "Klammern" },
  { id: "entkommen", label: "Entkommen" },
] as const;

export type CardMode = (typeof CARD_MODES)[number]["id"];

export function isCardMode(value: string | null | undefined): value is CardMode {
  return CARD_MODES.some((mode) => mode.id === value);
}

export function cardsFor(mode: CardMode) {
  return techniques.filter((technique) => (mode === "konter" ? isCounter(technique) : technique.category === mode));
}

export function cardText(technique: Technique) {
  const names = [technique.de, technique.reading, technique.jp, technique.alias ?? ""].filter((name) => name.length > 2);
  let text = technique.principle;
  for (const name of names) {
    text = text.split(name).join("diese Technik");
  }
  if (names.some((name) => technique.principle.toLowerCase().includes(name.toLowerCase())) && text.length < 48) {
    text = technique.steps[0]?.text ?? text;
  }
  return text;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: number) {
  const random = mulberry32(seed);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function deal(pool: Technique[], round: number) {
  const prompts = shuffle(pool, round + 17).slice(0, Math.min(4, pool.length));
  return { prompts, names: shuffle(prompts, round + 91) };
}

export function readKnown(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return [];
  const raw = (metadata as { known?: unknown }).known;
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string");
}

export function categoryOfMode(mode: CardMode): CategoryId | "konter" {
  return mode;
}
