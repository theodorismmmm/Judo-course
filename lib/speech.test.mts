import assert from "node:assert/strict";
import { getTechnique } from "./catalog/index.ts";
import { matchesAny, matchesName } from "./speech.ts";

function source(slug: string) {
  const technique = getTechnique(slug);
  assert.ok(technique, slug);
  return { slug: technique.slug, reading: technique.reading, jp: technique.jp };
}

const oSoto = source("o-soto-gari");
const koSoto = source("ko-soto-gari");
const kesa = source("kesa-gatame");
const ippon = source("ippon-seoi-nage");
const morote = source("morote-seoi-nage");

assert.equal(matchesName("O Soto Gari", oSoto), true);
assert.equal(matchesName("Oh Soto Gary", oSoto), true);
assert.equal(matchesName("Osoto Gari", oSoto), true);
assert.equal(matchesName("Osotogari", oSoto), true);
assert.equal(matchesName("o so to gari", oSoto), true);
assert.equal(matchesName("o-soto-gari", oSoto), true);
assert.equal(matchesName("das ist O Soto Gari", oSoto), true);
assert.equal(matchesName("O Soto Gari", koSoto), false);
assert.equal(matchesName("Ko Soto Gari", koSoto), true);
assert.equal(matchesName("Ko Soto Gari", oSoto), false);
assert.equal(matchesName("O Uchi Gari", oSoto), false);
assert.equal(matchesName("Käsa Katame", kesa), true);
assert.equal(matchesName("Kessa Gatame", kesa), true);
assert.equal(matchesName("Ippon Seoi Nage", ippon), true);
assert.equal(matchesName("Ippon Seoi Nage", morote), false);
assert.equal(matchesName("Morote Seoi Nage", morote), true);
assert.equal(matchesName("Seoi Nage", ippon), false);
assert.equal(matchesName("Seoi Nage", morote), false);
assert.equal(matchesName("Große Außensichel", oSoto), false);
assert.equal(matchesName("", oSoto), false);
assert.equal(matchesAny(["unsinn", "oh soto gari"], oSoto), true);
assert.equal(matchesName("ippon seoy nage", ippon), true);
