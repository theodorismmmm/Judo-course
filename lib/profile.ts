import type { BeltId } from "./types";
import { isBelt } from "./belts";

export const GOALS = [
  { id: "pruefung", label: "Die nächste Gürtelprüfung bestehen" },
  { id: "wuerfe", label: "Meine Würfe sicherer machen" },
  { id: "boden", label: "Am Boden besser werden" },
  { id: "fitness", label: "Fit und fokussiert bleiben" },
  { id: "fun", label: "Mit Spaß regelmäßig trainieren" },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];

export type Profile = {
  onboarded: boolean;
  belt: BeltId | null;
  goals: GoalId[];
  examDate: string | null;
};

export function isGoalId(value: string): value is GoalId {
  return GOALS.some((goal) => goal.id === value);
}

export function readProfile(metadata: unknown): Profile {
  if (!metadata || typeof metadata !== "object") {
    return { onboarded: false, belt: null, goals: [], examDate: null };
  }
  const bag = metadata as {
    onboarded?: unknown;
    belt?: unknown;
    goals?: unknown;
    examDate?: unknown;
  };
  const goals = Array.isArray(bag.goals)
    ? bag.goals.filter((item): item is GoalId => typeof item === "string" && isGoalId(item))
    : [];
  const belt = typeof bag.belt === "string" && isBelt(bag.belt) ? bag.belt : null;
  const examDate = typeof bag.examDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(bag.examDate) ? bag.examDate : null;
  return {
    onboarded: bag.onboarded === true,
    belt,
    goals,
    examDate,
  };
}

export function goalLabels(ids: GoalId[]) {
  return ids.map((id) => GOALS.find((goal) => goal.id === id)?.label).filter(Boolean) as string[];
}
