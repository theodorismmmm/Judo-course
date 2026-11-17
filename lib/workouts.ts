export type MatNeed = "matte" | "ohne" | "egal";
export type WorkoutKind = "vor" | "hiit" | "wahl";

export type Workout = {
  id: string;
  youtube: string;
  title: string;
  by: string;
  minutes: number;
  kind: WorkoutKind;
  mat: MatNeed;
  blurb: string;
  pick?: boolean;
};

/** Only verified public YouTube IDs (checked via oEmbed). */
export const WORKOUTS: Workout[] = [
  {
    id: "uchi-mata-warm",
    youtube: "MjnWBG96K-M",
    title: "Aufwärmen und Dehnen vor Uchi Mata",
    by: "JUDO education",
    minutes: 10,
    kind: "vor",
    mat: "egal",
    blurb: "Kurzes Aufwärmen und Stretching, bevor du auf die Matte gehst.",
    pick: true,
  },
  {
    id: "judo-workout-10",
    youtube: "JrVqlT2DzH8",
    title: "10 Minuten Judo-Workout",
    by: "JUDO education",
    minutes: 10,
    kind: "vor",
    mat: "egal",
    blurb: "Allgemeines Solo-Workout vor dem Training: Bewegung, Takt, Körpergefühl.",
    pick: true,
  },
  {
    id: "mobility-judo",
    youtube: "OdRg5QPZLmE",
    title: "10 Minuten Mobilität für Judo",
    by: "JUDO education",
    minutes: 10,
    kind: "vor",
    mat: "matte",
    blurb: "Mobilität am Boden. Am besten mit Matte oder weichem Untergrund.",
    pick: true,
  },
  {
    id: "hip-judo",
    youtube: "2XjOHlS-FhI",
    title: "10 Minuten Hüft-Workout",
    by: "JUDO education",
    minutes: 10,
    kind: "vor",
    mat: "matte",
    blurb: "Hüfte und Beine vor Würfen und Ne-waza. Matte hilft.",
  },
  {
    id: "balance-judo",
    youtube: "Lo5oZvWZ_yQ",
    title: "10 Minuten Balance",
    by: "JUDO education",
    minutes: 10,
    kind: "vor",
    mat: "ohne",
    blurb: "Gleichgewicht und Stand. Geht auch ohne Matte auf festem Boden.",
  },
  {
    id: "forearm-shoulder",
    youtube: "SWPmODZxa-E",
    title: "Unterarme und Schultern",
    by: "JUDO education",
    minutes: 10,
    kind: "vor",
    mat: "ohne",
    blurb: "Griff und Schultern vor dem Kumi-kata. Keine Matte nötig.",
  },
  {
    id: "footwork-abs",
    youtube: "yNzFVTlQ0po",
    title: "Fußarbeit und Bauch",
    by: "JUDO education",
    minutes: 10,
    kind: "vor",
    mat: "egal",
    blurb: "Fußarbeit und Rumpf vor dem Standtraining.",
  },
  {
    id: "shrimp-hips",
    youtube: "TQ4gJ7E6Xis",
    title: "Hüftflucht und Bodenmobilität",
    by: "Stephan Kesting",
    minutes: 12,
    kind: "vor",
    mat: "matte",
    blurb: "Shrimping und Hüfte für Ne-waza. Nur mit Matte sinnvoll.",
  },
  {
    id: "bjj-mobility",
    youtube: "si34Jfhbje8",
    title: "10 Minuten Ganzkörper-Mobilität",
    by: "Yoga With Tim",
    minutes: 10,
    kind: "vor",
    mat: "matte",
    blurb: "Weiches Aufwärmen vor dem Bodenkampf. Matte empfohlen.",
  },
  {
    id: "pre-yoga-flow",
    youtube: "THep7TeHWJs",
    title: "Kurzer Yoga-Flow vor dem Training",
    by: "Manduka Europe",
    minutes: 15,
    kind: "vor",
    mat: "matte",
    blurb: "Ruhiger Flow für Hüfte und Rücken vor dem Training.",
  },
  {
    id: "tandoku",
    youtube: "af2AWMWfPo0",
    title: "Tandoku Renshu · 25 Übungen",
    by: "JUDO education",
    minutes: 15,
    kind: "vor",
    mat: "egal",
    blurb: "Solo-Übungssatz aus dem Judo. Gut als Vorbereitung oder leichtes Workout.",
    pick: true,
  },
  {
    id: "strength-judoka",
    youtube: "I5chnyXkzpE",
    title: "Kraftübungen für Judoka",
    by: "BeyondGrappling",
    minutes: 2,
    kind: "vor",
    mat: "ohne",
    blurb: "Kurzer Überblick zu Kraft und Power für Judoka. Ohne Matte.",
  },
  {
    id: "joe-wicks-hiit",
    youtube: "g1aBZBV9ebM",
    title: "20 Moves in 20 Minuten · Bodyweight HIIT",
    by: "The Body Coach TV",
    minutes: 20,
    kind: "hiit",
    mat: "egal",
    blurb: "Klassisches HIIT ohne Geräte. Matte optional.",
    pick: true,
  },
  {
    id: "bullyjuice-20",
    youtube: "oAPCPjnU1wA",
    title: "20 Minuten Ganzkörper ohne Geräte",
    by: "BullyJuice",
    minutes: 20,
    kind: "hiit",
    mat: "ohne",
    blurb: "Volles Bodyweight-HIIT. Geht auf dem Boden zu Hause.",
    pick: true,
  },
  {
    id: "juice-toya-hiit",
    youtube: "owhvNm37Mv4",
    title: "20 Minuten Full Body HIIT",
    by: "Juice & Toya",
    minutes: 20,
    kind: "hiit",
    mat: "matte",
    blurb: "Zwei Schwierigkeitsstufen. Matte oder weicher Boden empfohlen.",
  },
  {
    id: "chloe-hiit",
    youtube: "JD9XO0jt9LI",
    title: "20 Minuten Full Body HIIT ohne Wiederholungen",
    by: "Chloe Ting",
    minutes: 20,
    kind: "hiit",
    mat: "egal",
    blurb: "Abwechslungsreiches HIIT ohne Geräte.",
  },
  {
    id: "beginner-hiit",
    youtube: "aj4qCMynzXE",
    title: "20 Minuten HIIT für Einsteiger",
    by: "Yes2Next",
    minutes: 20,
    kind: "hiit",
    mat: "ohne",
    blurb: "Sanfteres HIIT, wenn du erst einsteigst. Ohne Geräte.",
  },
  {
    id: "newaza-home",
    youtube: "vl5_maQnUrk",
    title: "Judo zu Hause · Ne-waza Bewegung",
    by: "Sampson Judo",
    minutes: 30,
    kind: "hiit",
    mat: "matte",
    blurb: "Bodenbewegung und Kondition für Judo. Mit Matte.",
  },
];

export const WORKOUT_KINDS: { id: WorkoutKind; label: string }[] = [
  { id: "vor", label: "Vor dem Judo" },
  { id: "hiit", label: "HIIT" },
  { id: "wahl", label: "Meine Wahl" },
];

export const MAT_FILTERS: { id: MatNeed | "alle"; label: string }[] = [
  { id: "alle", label: "Alle Untergründe" },
  { id: "matte", label: "Mit Matte" },
  { id: "ohne", label: "Ohne Matte" },
];

export function isWorkoutKind(value: string | null | undefined): value is WorkoutKind {
  return WORKOUT_KINDS.some((kind) => kind.id === value);
}

export function workoutsFor(kind: WorkoutKind, mat: MatNeed | "alle") {
  return WORKOUTS.filter((workout) => {
    if (kind === "wahl" ? !workout.pick : workout.kind !== kind) return false;
    if (mat === "alle") return true;
    return workout.mat === mat || workout.mat === "egal";
  });
}
