export const BELT_IDS = [
  "weiss",
  "gelb",
  "orange",
  "gruen",
  "blau",
  "braun",
  "dan1",
  "dan2",
] as const;

export type BeltId = (typeof BELT_IDS)[number];

export const CATEGORY_IDS = [
  "grundlage",
  "fallschule",
  "wurf",
  "haltegriff",
  "wuergegriff",
  "klammer",
  "entkommen",
  "verbindung",
  "studium",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type MotionId =
  | "basics"
  | "ukemi-back"
  | "ukemi-side"
  | "ukemi-front"
  | "ukemi-roll"
  | "hip"
  | "hip-leg"
  | "seoi"
  | "sweep"
  | "reap-out"
  | "reap-in"
  | "uchi-mata"
  | "foot-block"
  | "body-drop"
  | "sacrifice"
  | "side-drop"
  | "back-arch"
  | "wrap"
  | "wheel"
  | "counter"
  | "hands"
  | "scoop"
  | "pin-kesa"
  | "pin-yoko"
  | "pin-kami"
  | "pin-tate"
  | "pin-kata"
  | "pin-ura"
  | "choke-cross"
  | "choke-rear"
  | "choke-collar"
  | "choke-sankaku"
  | "arm-juji"
  | "arm-ude"
  | "arm-garami"
  | "arm-knee"
  | "escape-hold"
  | "escape-arm"
  | "combo"
  | "chain"
  | "teach"
  | "guard-pass"
  | "turn-over";

export type Step = {
  phase: string;
  text: string;
};

export type Technique = {
  slug: string;
  de: string;
  reading: string;
  jp: string;
  kanji: string;
  category: CategoryId;
  belt: BeltId;
  group: string;
  motion: MotionId;
  mirror?: boolean;
  principle: string;
  steps: [Step, Step, Step, Step];
  cues: string[];
  faults: string[];
  safety?: string;
  alias?: string;
  youtube?: string;
  videoBy?: string;
};

export type Belt = {
  id: BeltId;
  name: string;
  kyu: string;
  cloth: string;
  ink: string;
  stripes: number;
  line: string;
};
