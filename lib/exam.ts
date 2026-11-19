import { techniques } from "./catalog";
import { cardText } from "./study";
import type { BeltId } from "./types";

export type ExamChoice = { slug: string; reading: string };

export type ExamQuestion = {
  slug: string;
  prompt: string;
  choices: ExamChoice[];
};

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

export function buildExam(belt: BeltId, seed: number): ExamQuestion[] {
  const pool = techniques.filter((technique) => technique.belt === belt);
  const picked = shuffle(pool, seed + 17).slice(0, Math.min(8, pool.length));
  return picked.map((technique, index) => {
    const same = techniques.filter((item) => item.category === technique.category && item.slug !== technique.slug);
    const anywhere = techniques.filter((item) => item.slug !== technique.slug);
    const distractors = shuffle(same.length >= 3 ? same : anywhere, seed + index * 13 + 3).slice(0, 3);
    const choices = shuffle([technique, ...distractors], seed + index * 29 + 9).map((item) => ({
      slug: item.slug,
      reading: item.reading,
    }));
    return { slug: technique.slug, prompt: cardText(technique), choices };
  });
}
