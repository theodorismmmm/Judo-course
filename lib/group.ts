import { beltById } from "./belts";
import { techniques } from "./catalog";
import { readPractice } from "./practice";
import { readProfile } from "./profile";
import { readKnown } from "./study";

export type GroupRole = "trainer" | "judoka";

export type GroupRecord = {
  role: GroupRole;
  code: string;
  name: string;
};

export type MemberProgress = {
  id: string;
  name: string;
  belt: string | null;
  beltName: string | null;
  known: number;
  points: number;
  streak: number;
  lastDay: string | null;
  openThrows: string[];
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function isGroupCode(value: string) {
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(value);
}

export function cleanGroupName(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 60);
}

export function makeCode(random: () => number = Math.random) {
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    const pick = Math.min(ALPHABET.length - 1, Math.floor(random() * ALPHABET.length));
    code += ALPHABET[pick];
  }
  return code;
}

export function readGroup(metadata: unknown): GroupRecord | null {
  if (!metadata || typeof metadata !== "object") return null;
  const bag = metadata as { groupRole?: unknown; groupCode?: unknown; groupName?: unknown };
  const role = bag.groupRole === "trainer" || bag.groupRole === "judoka" ? bag.groupRole : null;
  const code = typeof bag.groupCode === "string" ? normalizeCode(bag.groupCode) : "";
  if (!role || !isGroupCode(code)) return null;
  const name = typeof bag.groupName === "string" ? cleanGroupName(bag.groupName) : "";
  return { role, code, name };
}

export function memberProgress(input: { id: string; name: string; metadata: unknown }): MemberProgress {
  const profile = readProfile(input.metadata);
  const known = readKnown(input.metadata);
  const practice = readPractice(input.metadata);
  const have = new Set(known);
  const openThrows = profile.belt
    ? techniques
        .filter((technique) => technique.belt === profile.belt && technique.category === "wurf" && !have.has(technique.slug))
        .slice(0, 6)
        .map((technique) => technique.reading)
    : [];
  return {
    id: input.id,
    name: input.name.trim() || "Judoka",
    belt: profile.belt,
    beltName: profile.belt ? (beltById(profile.belt)?.name ?? null) : null,
    known: known.length,
    points: practice.points,
    streak: practice.streak,
    lastDay: practice.lastDay,
    openThrows,
  };
}
