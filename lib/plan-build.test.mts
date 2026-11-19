import assert from "node:assert/strict";
import { buildWeek, daysUntil, phaseFor } from "./plan-build.ts";
import type { Technique } from "./types.ts";

const list = [
  { slug: "rei", belt: "weiss", category: "grundlage", reading: "Rei" },
  { slug: "ushiro-ukemi", belt: "weiss", category: "fallschule", reading: "Ushiro Ukemi" },
  { slug: "o-goshi", belt: "weiss-gelb", category: "wurf", reading: "O Goshi" },
  { slug: "ippon-seoi-nage", belt: "gelb", category: "wurf", reading: "Ippon Seoi Nage" },
  { slug: "o-soto-gari", belt: "gelb", category: "wurf", reading: "O Soto Gari" },
  { slug: "kesa-gatame", belt: "gelb", category: "haltegriff", reading: "Kesa Gatame" },
] as Technique[];

assert.equal(daysUntil("2026-04-01", new Date("2026-03-25T10:00:00.000Z")), 7);
assert.equal(daysUntil("2026-03-20", new Date("2026-03-25T10:00:00.000Z")), -5);
assert.equal(daysUntil("kein-datum"), null);
assert.equal(phaseFor(30), "weit");
assert.equal(phaseFor(21), "aufbau");
assert.equal(phaseFor(7), "woche");
assert.equal(phaseFor(-1), "vorbei");

const week = buildWeek({
  belt: "gelb",
  phase: "woche",
  known: ["ippon-seoi-nage"],
  weak: ["o-soto-gari"],
  list,
});
assert.equal(week.note.includes("Keine neuen Namen"), true);
assert.ok(week.days.every((day) => !day.slugs.includes("ippon-seoi-nage")));
assert.ok(week.days.some((day) => day.slugs.includes("o-soto-gari")));
assert.ok(week.days.every((day) => day.slugs.every((slug) => slug !== "kesa-gatame")));

const far = buildWeek({ belt: "gelb", phase: "weit", known: [], weak: [], list });
assert.equal(far.days.length, 2);
assert.equal(far.days[0]?.title, "Würfe");

const done = buildWeek({
  belt: "gelb",
  phase: "woche",
  known: ["ippon-seoi-nage", "o-soto-gari", "o-goshi"],
  weak: [],
  list,
});
assert.equal(done.note.includes("Alles abgehakt"), true);
