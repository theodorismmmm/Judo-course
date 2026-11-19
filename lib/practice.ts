import { shiftDays, todayKey } from "./days";

export const POINTS_FIRST = 10;
export const POINTS_RETRY = 4;
export const POINTS_EXAM = 6;

export type Practice = {
  points: number;
  streak: number;
  best: number;
  lastDay: string | null;
  misses: Record<string, number>;
  hits: Record<string, number>;
  beltPoints: Record<string, number>;
};

export function emptyPractice(): Practice {
  return { points: 0, streak: 0, best: 0, lastDay: null, misses: {}, hits: {}, beltPoints: {} };
}

function prune(map: Record<string, number>, cap = 40) {
  return Object.fromEntries(
    Object.entries(map)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, cap),
  );
}

function countMap(value: unknown) {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [key, count] of Object.entries(value)) {
    if (!/^[a-z0-9-]{1,80}$/.test(key)) continue;
    const number = typeof count === "number" ? count : Number(count);
    if (!Number.isFinite(number) || number <= 0) continue;
    out[key] = Math.min(99, Math.floor(number));
  }
  return prune(out);
}

function whole(value: unknown, cap: number) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.min(cap, Math.floor(number));
}

export function readPractice(metadata: unknown): Practice {
  if (!metadata || typeof metadata !== "object") return emptyPractice();
  const raw = (metadata as { practice?: unknown }).practice;
  if (!raw || typeof raw !== "object") return emptyPractice();
  const bag = raw as Partial<Practice>;
  const lastDay = typeof bag.lastDay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(bag.lastDay) ? bag.lastDay : null;
  return {
    points: whole(bag.points, 100000),
    streak: whole(bag.streak, 9999),
    best: whole(bag.best, 9999),
    lastDay,
    misses: countMap(bag.misses),
    hits: countMap(bag.hits),
    beltPoints: countMap(bag.beltPoints),
  };
}

export function levelFor(points: number) {
  if (points <= 0) return 0;
  return Math.min(10, Math.ceil(points / 30));
}

export function streakLabel(practice: Practice, now = new Date()) {
  const today = todayKey(now);
  if (!practice.lastDay || practice.streak <= 0) return "Serie: heute starten";
  const unit = practice.streak === 1 ? "Tag" : "Tage";
  if (practice.lastDay === today) return `Serie: ${practice.streak} ${unit}`;
  if (practice.lastDay === shiftDays(today, -1)) return `Serie: ${practice.streak} ${unit}, heute noch offen`;
  return "Serie: heute starten";
}

export function weakSlugs(practice: Practice, limit = 8) {
  return Object.entries(practice.misses)
    .map(([slug, misses]) => ({
      slug,
      weight: misses - (practice.hits[slug] ?? 0) * 0.25,
    }))
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.slug.localeCompare(b.slug))
    .slice(0, limit)
    .map((item) => item.slug);
}

function sorted(map: Record<string, number>) {
  return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
}

export function samePractice(a: Practice, b: Practice) {
  const left = { ...a, misses: sorted(a.misses), hits: sorted(a.hits), beltPoints: sorted(a.beltPoints) };
  const right = { ...b, misses: sorted(b.misses), hits: sorted(b.hits), beltPoints: sorted(b.beltPoints) };
  return JSON.stringify(left) === JSON.stringify(right);
}

export function mergePractice(a: Practice, b: Practice): Practice {
  const misses: Record<string, number> = {};
  const hits: Record<string, number> = {};
  const beltPoints: Record<string, number> = {};
  for (const source of [a, b]) {
    for (const [key, value] of Object.entries(source.misses)) misses[key] = Math.max(misses[key] ?? 0, value);
    for (const [key, value] of Object.entries(source.hits)) hits[key] = Math.max(hits[key] ?? 0, value);
    for (const [key, value] of Object.entries(source.beltPoints)) beltPoints[key] = Math.max(beltPoints[key] ?? 0, value);
  }
  const later = (a.lastDay ?? "") >= (b.lastDay ?? "") ? a : b;
  const streak = a.lastDay && a.lastDay === b.lastDay ? Math.max(a.streak, b.streak) : later.streak;
  return readPractice({
    practice: {
      points: Math.max(a.points, b.points),
      streak,
      best: Math.max(a.best, b.best, streak),
      lastDay: later.lastDay,
      misses,
      hits,
      beltPoints,
    },
  });
}

export function applyResult(
  practice: Practice,
  input: { slug: string; belt: string; correct: boolean; firstTry: boolean; points?: number; now?: Date },
): Practice {
  const now = input.now ?? new Date();
  const today = todayKey(now);
  const yesterday = shiftDays(today, -1);
  let streak = 1;
  if (practice.lastDay === today) streak = Math.max(practice.streak, 1);
  else if (practice.lastDay === yesterday) streak = practice.streak + 1;

  const gained = input.points ?? (input.correct ? (input.firstTry ? POINTS_FIRST : POINTS_RETRY) : 0);
  const misses = { ...practice.misses };
  const hits = { ...practice.hits };
  const beltPoints = { ...practice.beltPoints };
  if (/^[a-z0-9-]{1,80}$/.test(input.slug)) {
    if (input.correct) hits[input.slug] = (hits[input.slug] ?? 0) + 1;
    else misses[input.slug] = (misses[input.slug] ?? 0) + 1;
  }
  if (gained > 0 && /^[a-z0-9-]{1,40}$/.test(input.belt)) {
    beltPoints[input.belt] = (beltPoints[input.belt] ?? 0) + gained;
  }
  return readPractice({
    practice: {
      points: practice.points + Math.max(0, gained),
      streak,
      best: Math.max(practice.best, streak),
      lastDay: today,
      misses,
      hits,
      beltPoints,
    },
  });
}
