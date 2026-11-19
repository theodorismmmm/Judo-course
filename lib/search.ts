import { normalize, searchText, techniques } from "./catalog";
import type { Technique } from "./types";

export function searchTechniques(query: string, list: Technique[] = techniques) {
  const needle = normalize(query);
  if (needle.length < 2) return [];
  const tokens = needle.split(" ").filter(Boolean);
  return list.filter((technique) => {
    const hay = searchText(technique);
    return tokens.every((token) => hay.includes(token));
  });
}
