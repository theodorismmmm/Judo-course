import { DEFAULT_PHASES } from "../belts";
import type { BeltId, CategoryId, MotionId, Technique } from "../types";

type Extra = {
  safety?: string;
  alias?: string;
  mirror?: boolean;
  phases?: [string, string, string, string];
  jp?: string;
};

export function tech(
  slug: string,
  belt: BeltId,
  category: CategoryId,
  motion: MotionId,
  de: string,
  reading: string,
  kanji: string,
  group: string,
  principle: string,
  steps: [string, string, string, string],
  cues: string[],
  faults: string[],
  extra: Extra = {},
): Technique {
  const phases = extra.phases ?? DEFAULT_PHASES[category];
  return {
    slug,
    de,
    reading,
    jp: extra.jp ?? formalJp(reading),
    kanji,
    category,
    belt,
    group,
    motion,
    mirror: extra.mirror,
    principle,
    steps: phases.map((phase, index) => ({ phase, text: steps[index] })) as Technique["steps"],
    cues,
    faults,
    safety: extra.safety,
    alias: extra.alias,
  };
}

function formalJp(reading: string) {
  return reading
    .split(/\s+/)
    .map((part, index) => (index === 0 ? part : part.toLowerCase()))
    .join("-");
}
