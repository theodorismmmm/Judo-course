import { normalize, techniques } from "./catalog";

export type NameSource = {
  slug: string;
  reading: string;
  jp: string;
};

const FILLER = new Set([
  "ah",
  "aeh",
  "aehm",
  "hm",
  "hmm",
  "also",
  "das",
  "ist",
  "ein",
  "eine",
  "einer",
  "der",
  "die",
  "den",
  "dem",
  "ich",
  "sage",
  "sag",
  "heisst",
  "heisse",
  "name",
  "namen",
  "technik",
  "wurf",
  "bitte",
  "mal",
  "und",
  "ja",
  "nein",
  "the",
  "of",
  "ok",
  "okay",
]);

export function softenToken(token: string) {
  let value = token.replace(/dsch/g, "j").replace(/tsch/g, "ch").replace(/sch/g, "sh").replace(/ph/g, "f");
  value = value.replace(/(.)\1+/g, "$1");
  value = value.replace(/y$/, "i");
  if (value === "oh" || value === "oo") return "o";
  return value;
}

export function speechTokens(value: string) {
  return normalize(value)
    .split(" ")
    .map(softenToken)
    .filter((token) => token && !FILLER.has(token));
}

export function squeeze(value: string) {
  return speechTokens(value).join("").replace(/(.)\1+/g, "$1");
}

export function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

export function withinDistance(distance: number, targetLength: number) {
  if (distance === 0) return true;
  if (distance < 0 || targetLength <= 0) return false;
  const limit = targetLength <= 5 ? 1 : targetLength <= 12 ? 2 : 3;
  return distance <= limit && distance / targetLength <= 0.34;
}

export const NAME_CATALOG: NameSource[] = techniques.map((technique) => ({
  slug: technique.slug,
  reading: technique.reading,
  jp: technique.jp,
}));

const VOCAB = new Map<string, Set<string>>();
for (const source of NAME_CATALOG) {
  const phrase = `${source.reading} ${source.jp} ${source.slug.replace(/-/g, " ")}`;
  for (const token of speechTokens(phrase)) {
    if (token.length < 3) continue;
    const owners = VOCAB.get(token) ?? new Set<string>();
    owners.add(source.slug);
    VOCAB.set(token, owners);
  }
}

function expectedTokens(source: NameSource) {
  return new Set(speechTokens(`${source.reading} ${source.jp} ${source.slug.replace(/-/g, " ")}`));
}

function hasForeignToken(heard: string, source: NameSource) {
  const expected = expectedTokens(source);
  return speechTokens(heard).some((token) => {
    if (token.length < 3 || expected.has(token)) return false;
    const owners = VOCAB.get(token);
    return !!owners && [...owners].some((slug) => slug !== source.slug);
  });
}

function targetSqueeze(source: NameSource) {
  const targets = [source.reading, source.jp, source.slug.replace(/-/g, " ")];
  let best = "";
  for (const target of targets) {
    const squeezed = squeeze(target);
    if (squeezed.length > best.length) best = squeezed;
  }
  return best;
}

export function nameDistance(heard: string, source: NameSource) {
  const parts = speechTokens(heard);
  const target = targetSqueeze(source);
  if (!parts.length || !target) return null;
  let best = levenshtein(parts.join("").replace(/(.)\1+/g, "$1"), target);
  if (best === 0) return 0;
  for (let start = 0; start < parts.length; start += 1) {
    for (let end = start + 1; end <= parts.length; end += 1) {
      const slice = parts.slice(start, end).join("").replace(/(.)\1+/g, "$1");
      best = Math.min(best, levenshtein(slice, target));
      if (best === 0) return 0;
    }
  }
  return best;
}

/** True when the heard phrase is this technique and not a closer other name. */
export function matchesName(heard: string, source: NameSource, catalog: NameSource[] = NAME_CATALOG) {
  if (!speechTokens(heard).length) return false;
  if (hasForeignToken(heard, source)) return false;
  const score = nameDistance(heard, source);
  if (score === null) return false;
  const targetLength = targetSqueeze(source).length;
  if (!withinDistance(score, targetLength)) return false;
  for (const other of catalog) {
    if (other.slug === source.slug) continue;
    if (hasForeignToken(heard, other)) continue;
    const otherScore = nameDistance(heard, other);
    if (otherScore === null) continue;
    if (!withinDistance(otherScore, targetSqueeze(other).length)) continue;
    if (otherScore <= score) return false;
  }
  return true;
}

export function matchesAny(heard: string[], source: NameSource, catalog?: NameSource[]) {
  return heard.some((line) => matchesName(line, source, catalog));
}
