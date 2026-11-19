import assert from "node:assert/strict";
import { applyResult, emptyPractice, levelFor, mergePractice, streakLabel, weakSlugs } from "./practice.ts";

const morning = new Date("2026-01-15T08:00:00.000Z");
const eveningBeforeBerlinDay = new Date("2026-01-15T23:30:00.000Z");

let practice = emptyPractice();
practice = applyResult(practice, {
  slug: "o-soto-gari",
  belt: "gelb",
  correct: true,
  firstTry: true,
  now: morning,
});
assert.equal(practice.points, 10);
assert.equal(practice.streak, 1);
assert.equal(practice.lastDay, "2026-01-15");
assert.equal(practice.beltPoints.gelb, 10);
assert.equal(levelFor(practice.beltPoints.gelb), 1);

practice = applyResult(practice, {
  slug: "o-soto-gari",
  belt: "gelb",
  correct: false,
  firstTry: true,
  now: morning,
});
assert.equal(practice.points, 10);
assert.equal(practice.streak, 1);
assert.equal(practice.misses["o-soto-gari"], 1);

practice = applyResult(practice, {
  slug: "kesa-gatame",
  belt: "gelb",
  correct: true,
  firstTry: false,
  now: morning,
});
assert.equal(practice.points, 14);

const nextDay = applyResult(practice, {
  slug: "o-soto-gari",
  belt: "gelb",
  correct: true,
  firstTry: true,
  now: new Date("2026-01-16T10:00:00.000Z"),
});
assert.equal(nextDay.streak, 2);
assert.equal(streakLabel(nextDay, new Date("2026-01-16T10:00:00.000Z")), "Serie: 2 Tage");
assert.equal(streakLabel(nextDay, new Date("2026-01-17T10:00:00.000Z")), "Serie: 2 Tage, heute noch offen");
assert.equal(streakLabel(nextDay, new Date("2026-01-18T10:00:00.000Z")), "Serie: heute starten");

const berlinNext = applyResult(emptyPractice(), {
  slug: "rei",
  belt: "weiss",
  correct: true,
  firstTry: true,
  now: eveningBeforeBerlinDay,
});
assert.equal(berlinNext.lastDay, "2026-01-16");

const gap = applyResult(nextDay, {
  slug: "o-soto-gari",
  belt: "gelb",
  correct: true,
  firstTry: true,
  now: new Date("2026-01-20T10:00:00.000Z"),
});
assert.equal(gap.streak, 1);

const weak = weakSlugs(practice);
assert.equal(weak[0], "o-soto-gari");

const merged = mergePractice(
  { ...emptyPractice(), points: 10, misses: { "o-soto-gari": 2 }, lastDay: "2026-01-15", streak: 1, best: 1 },
  { ...emptyPractice(), points: 4, hits: { "o-soto-gari": 1 }, lastDay: "2026-01-16", streak: 2, best: 2 },
);
assert.equal(merged.points, 10);
assert.equal(merged.misses["o-soto-gari"], 2);
assert.equal(merged.hits["o-soto-gari"], 1);
assert.equal(merged.streak, 2);
assert.equal(merged.lastDay, "2026-01-16");
assert.equal(levelFor(0), 0);
assert.equal(levelFor(30), 1);
assert.equal(levelFor(31), 2);
