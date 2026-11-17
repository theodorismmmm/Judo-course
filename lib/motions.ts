import type { MotionId } from "./types";

export type PoseName =
  | "stand"
  | "reach"
  | "entry"
  | "seoi"
  | "bow"
  | "hipReap"
  | "reap"
  | "sweep"
  | "highReap"
  | "air"
  | "flat"
  | "kesa"
  | "north"
  | "mount"
  | "guard"
  | "tuck"
  | "brace"
  | "seat"
  | "kneel"
  | "scoop"
  | "arch";

export type Body = Record<
  | "head"
  | "shoulder"
  | "hip"
  | "elbowA"
  | "handA"
  | "elbowB"
  | "handB"
  | "kneeA"
  | "footA"
  | "kneeB"
  | "footB",
  [number, number]
>;

export type Actor = {
  tone: "tori" | "uke";
  x: number;
  y: number;
  rot: number;
  pose: PoseName;
};

export type FilmFrame = {
  actors: Actor[];
  arrow?: [number, number, number, number];
  note?: string;
};

const B = (
  head: [number, number],
  shoulder: [number, number],
  elbowA: [number, number],
  handA: [number, number],
  elbowB: [number, number],
  handB: [number, number],
  kneeA: [number, number],
  footA: [number, number],
  kneeB: [number, number],
  footB: [number, number],
): Body => ({
  head,
  shoulder,
  hip: [0, 0],
  elbowA,
  handA,
  elbowB,
  handB,
  kneeA,
  footA,
  kneeB,
  footB,
});

export const POSES: Record<PoseName, Body> = {
  stand: B([2, -72], [0, -48], [22, -40], [34, -22], [-18, -38], [-30, -22], [12, 28], [16, 56], [-12, 28], [-16, 56]),
  reach: B([8, -70], [4, -46], [26, -58], [44, -48], [8, -52], [28, -36], [14, 26], [20, 56], [-6, 30], [-4, 56]),
  entry: B([16, -54], [10, -36], [18, -22], [8, -6], [-4, -18], [12, -2], [22, 30], [26, 56], [-18, 32], [-10, 56]),
  seoi: B([14, -50], [8, -34], [6, -48], [-8, -30], [16, -20], [6, -4], [24, 28], [30, 54], [-16, 30], [-8, 54]),
  bow: B([40, -16], [26, -14], [22, 4], [6, 14], [6, -2], [-8, 10], [14, 30], [16, 56], [-16, 32], [-18, 56]),
  hipReap: B([34, -20], [22, -16], [16, 2], [2, 12], [4, -4], [-10, 8], [10, 32], [8, 56], [30, -4], [58, -10]),
  reap: B([4, -68], [2, -46], [24, -44], [40, -32], [-18, -40], [-32, -26], [6, 30], [4, 56], [34, 6], [64, 16]),
  sweep: B([2, -70], [0, -48], [22, -42], [36, -28], [-16, -40], [-28, -24], [8, 30], [6, 56], [30, 36], [58, 48]),
  highReap: B([6, -66], [2, -44], [20, -36], [34, -20], [-14, -34], [-26, -18], [8, 30], [6, 56], [18, -8], [28, -36]),
  air: B([-4, -66], [-2, -44], [12, -58], [6, -74], [-14, -56], [-6, -72], [6, 26], [2, 52], [-8, 28], [-4, 54]),
  flat: B([-70, -6], [-48, -2], [-58, 18], [-40, 26], [-36, -20], [-18, -28], [24, 10], [52, 8], [22, -14], [50, -16]),
  kesa: B([6, -32], [0, -18], [26, -6], [14, 16], [-24, -4], [-40, 10], [28, 18], [52, 34], [-6, 24], [16, 48]),
  north: B([0, -58], [0, -38], [24, -16], [18, 8], [-24, -16], [-18, 8], [20, 22], [22, 46], [-20, 22], [-22, 46]),
  mount: B([0, -52], [0, -34], [22, -22], [14, -4], [-22, -22], [-14, -4], [28, 10], [34, 32], [-28, 10], [-34, 32]),
  guard: B([-64, 6], [-42, 2], [-30, 20], [-10, 24], [-28, -16], [-8, -18], [8, -30], [30, -48], [18, -6], [42, -14]),
  tuck: B([-8, -30], [2, -18], [-18, -6], [-6, 10], [14, -14], [4, 0], [18, 12], [6, 26], [-12, 16], [-20, 24]),
  brace: B([18, -40], [6, -28], [22, -4], [40, 10], [-6, -2], [12, 14], [16, 24], [12, 52], [-18, 26], [-20, 54]),
  seat: B([4, -48], [0, -32], [24, -20], [16, 2], [-20, -18], [-8, 4], [26, 8], [46, 18], [8, 20], [28, 36]),
  kneel: B([0, -64], [0, -44], [20, -30], [28, -12], [-20, -30], [-28, -12], [14, 18], [18, 36], [-14, 18], [-18, 36]),
  scoop: B([22, -48], [14, -36], [30, -10], [22, 12], [8, -16], [18, 6], [20, 28], [24, 56], [-12, 30], [-14, 56]),
  arch: B([-20, -60], [-10, -42], [8, -50], [22, -36], [-24, -36], [-10, -22], [16, 26], [22, 56], [-8, 28], [-4, 56]),
};

const Y = 308;

function actor(tone: "tori" | "uke", x: number, y: number, rot: number, pose: PoseName): Actor {
  return { tone, x, y, rot, pose };
}

function frame(
  tori: [number, number, number, PoseName] | null,
  uke: [number, number, number, PoseName] | null,
  arrow?: [number, number, number, number],
  note?: string,
): FilmFrame {
  const actors: Actor[] = [];
  if (tori) actors.push(actor("tori", tori[0], tori[1], tori[2], tori[3]));
  if (uke) actors.push(actor("uke", uke[0], uke[1], uke[2], uke[3]));
  return { actors, arrow, note };
}

const T = (x: number, rot: number, pose: PoseName, y = Y): [number, number, number, PoseName] => [x, y, rot, pose];
const U = T;

export const MOTIONS: Record<MotionId, FilmFrame[]> = {
  basics: [
    frame(T(230, 12, "stand"), U(410, -8, "stand")),
    frame(T(250, 0, "stand"), U(390, 0, "stand")),
    frame(T(270, -6, "reach"), U(390, 4, "reach"), [300, 230, 360, 210]),
    frame(T(250, 0, "stand"), U(400, 0, "stand")),
  ],
  "ukemi-back": [
    frame(null, U(320, 0, "stand")),
    frame(null, U(330, 18, "tuck", 330), [360, 250, 420, 300]),
    frame(null, U(380, -8, "flat", 336)),
    frame(null, U(340, 0, "kneel")),
  ],
  "ukemi-side": [
    frame(null, U(300, 0, "stand")),
    frame(null, U(330, -28, "brace", 324)),
    frame(null, U(390, -70, "flat", 334)),
    frame(null, U(360, 0, "kneel")),
  ],
  "ukemi-front": [
    frame(null, U(280, 0, "stand")),
    frame(null, U(330, -24, "brace", 330)),
    frame(null, U(390, 10, "tuck", 340)),
    frame(null, U(420, 0, "kneel")),
  ],
  "ukemi-roll": [
    frame(null, U(250, 0, "stand")),
    frame(null, U(320, 40, "tuck", 300)),
    frame(null, U(400, -20, "flat", 338)),
    frame(null, U(450, 0, "kneel")),
  ],
  hip: [
    frame(T(220, 0, "stand"), U(410, 0, "stand"), [400, 220, 470, 170]),
    frame(T(330, -18, "entry", 322), U(400, -8, "reach", 300)),
    frame(T(360, -46, "bow", 328), U(400, -78, "air", 214)),
    frame(T(250, 6, "stand"), U(450, -4, "flat", 334)),
  ],
  "hip-leg": [
    frame(T(220, 0, "stand"), U(410, 0, "stand"), [390, 230, 460, 180]),
    frame(T(330, -16, "entry", 320), U(405, -6, "reach", 300)),
    frame(T(350, -36, "hipReap", 318), U(410, -70, "air", 200)),
    frame(T(260, 4, "stand"), U(460, -6, "flat", 334)),
  ],
  seoi: [
    frame(T(210, 0, "reach"), U(400, 0, "stand"), [380, 210, 450, 160]),
    frame(T(340, -24, "seoi", 328), U(400, -4, "reach", 296)),
    frame(T(365, -52, "bow", 336), U(390, -96, "air", 188)),
    frame(T(240, 4, "stand"), U(470, 0, "flat", 336)),
  ],
  sweep: [
    frame(T(230, 0, "stand"), U(400, 0, "stand"), [430, 340, 500, 360]),
    frame(T(280, -8, "sweep"), U(420, -10, "reach", 292)),
    frame(T(300, -12, "sweep", 300), U(460, -64, "air", 230)),
    frame(T(250, 0, "stand"), U(490, -8, "flat", 336)),
  ],
  "reap-out": [
    frame(T(240, 0, "reach"), U(400, 0, "stand"), [430, 240, 390, 180]),
    frame(T(330, 8, "reap"), U(400, 6, "stand", 300)),
    frame(T(340, 16, "reap", 300), U(430, 72, "air", 240)),
    frame(T(280, 0, "stand"), U(470, 8, "flat", 336)),
  ],
  "reap-in": [
    frame(T(250, 0, "reach"), U(410, 0, "stand"), [390, 250, 340, 190]),
    frame(T(360, -10, "reap"), U(400, 8, "stand", 302)),
    frame(T(370, -6, "reap", 304), U(400, 80, "air", 236)),
    frame(T(300, 0, "stand"), U(450, 6, "flat", 336)),
  ],
  "uchi-mata": [
    frame(T(220, 0, "stand"), U(400, 0, "stand"), [390, 220, 450, 170]),
    frame(T(330, -20, "entry", 320), U(400, -4, "reach", 298)),
    frame(T(350, -18, "highReap", 312), U(390, -86, "air", 196)),
    frame(T(250, 4, "stand"), U(470, -4, "flat", 336)),
  ],
  "foot-block": [
    frame(T(230, 0, "reach"), U(420, 0, "stand"), [400, 200, 470, 150]),
    frame(T(300, -8, "sweep"), U(430, -12, "reach", 286)),
    frame(T(310, -6, "sweep"), U(470, -70, "air", 200)),
    frame(T(250, 0, "stand"), U(500, 2, "flat", 336)),
  ],
  "body-drop": [
    frame(T(220, 0, "reach"), U(400, 0, "stand"), [380, 220, 450, 250]),
    frame(T(330, -22, "entry", 318), U(405, -8, "reach", 300)),
    frame(T(345, -28, "sweep", 312), U(420, -60, "air", 210)),
    frame(T(250, 0, "stand"), U(480, 0, "flat", 336)),
  ],
  sacrifice: [
    frame(T(250, 0, "reach"), U(400, 0, "stand"), [360, 240, 420, 200]),
    frame(T(340, 10, "guard", 348), U(400, -4, "stand", 280)),
    frame(T(330, 6, "guard", 350), U(430, -100, "air", 190)),
    frame(T(300, 4, "flat", 346), U(470, 8, "flat", 336)),
  ],
  "side-drop": [
    frame(T(230, 0, "reach"), U(400, 0, "stand")),
    frame(T(320, -20, "entry", 324), U(400, -6, "reach")),
    frame(T(360, -78, "flat", 340), U(400, -40, "air", 230)),
    frame(T(340, -70, "flat", 346), U(450, 4, "flat", 336)),
  ],
  "back-arch": [
    frame(T(280, 0, "stand"), U(400, 0, "reach")),
    frame(T(300, -16, "arch", 300), U(360, -10, "air", 230)),
    frame(T(310, -28, "arch", 306), U(300, -70, "air", 180)),
    frame(T(340, 0, "stand"), U(250, 6, "flat", 336)),
  ],
  wrap: [
    frame(T(220, 0, "reach"), U(400, 0, "stand")),
    frame(T(330, -20, "entry", 320), U(390, -8, "reach", 300)),
    frame(T(360, -40, "bow", 330), U(370, -50, "air", 240)),
    frame(T(390, -64, "kesa", 330), U(420, 4, "flat", 340)),
  ],
  wheel: [
    frame(T(260, 0, "stand"), U(400, 0, "stand"), [390, 210, 450, 170]),
    frame(T(340, 8, "kneel", 330), U(390, -6, "reach", 270)),
    frame(T(350, 4, "kneel", 336), U(360, -90, "air", 200)),
    frame(T(300, 0, "kneel"), U(450, 0, "flat", 338)),
  ],
  counter: [
    frame(T(400, 0, "stand"), U(250, -12, "entry", 318)),
    frame(T(360, 8, "reap"), U(300, -8, "entry", 312)),
    frame(T(340, 10, "stand"), U(300, 84, "air", 220)),
    frame(T(380, 0, "stand"), U(260, 6, "flat", 336)),
  ],
  hands: [
    frame(T(230, 0, "reach"), U(400, 0, "stand"), [380, 200, 450, 230]),
    frame(T(280, -8, "reach"), U(400, 16, "brace", 318)),
    frame(T(300, -6, "reach"), U(430, 48, "air", 240)),
    frame(T(260, 0, "stand"), U(470, 4, "flat", 336)),
  ],
  scoop: [
    frame(T(240, 0, "stand"), U(400, 0, "stand")),
    frame(T(330, 12, "scoop", 326), U(400, -4, "stand", 292)),
    frame(T(340, 8, "scoop", 318), U(390, -70, "air", 200)),
    frame(T(280, 0, "stand"), U(460, 0, "flat", 336)),
  ],
  "pin-kesa": [
    frame(T(420, 0, "kneel"), U(320, 0, "flat", 340)),
    frame(T(360, 16, "kesa", 300), U(330, 0, "flat", 338)),
    frame(T(345, 22, "kesa", 292), U(330, 2, "flat", 340)),
    frame(T(348, 20, "kesa", 294), U(332, 2, "flat", 340)),
  ],
  "pin-yoko": [
    frame(T(460, 0, "kneel"), U(320, 0, "flat", 340)),
    frame(T(390, -8, "kesa", 300), U(320, 0, "flat", 338)),
    frame(T(400, -16, "north", 286), U(320, 0, "flat", 340)),
    frame(T(398, -14, "north", 288), U(318, 0, "flat", 340)),
  ],
  "pin-kami": [
    frame(T(230, 0, "kneel"), U(360, 0, "flat", 340)),
    frame(T(250, 0, "north", 280), U(360, 0, "flat", 338)),
    frame(T(248, 2, "north", 268), U(360, 0, "flat", 340)),
    frame(T(248, 2, "north", 270), U(360, 0, "flat", 340)),
  ],
  "pin-tate": [
    frame(T(360, 0, "kneel"), U(340, 0, "flat", 346)),
    frame(T(360, 0, "mount", 300), U(340, 0, "flat", 344)),
    frame(T(358, 0, "mount", 292), U(340, 0, "flat", 346)),
    frame(T(358, 0, "mount", 294), U(340, 0, "flat", 346)),
  ],
  "pin-kata": [
    frame(T(430, 0, "kneel"), U(320, 0, "flat", 340)),
    frame(T(340, 18, "kesa", 292), U(320, 0, "flat", 338)),
    frame(T(330, 28, "kesa", 284), U(318, 4, "flat", 340)),
    frame(T(328, 26, "kesa", 286), U(318, 4, "flat", 340)),
  ],
  "pin-ura": [
    frame(T(300, 0, "kneel"), U(380, 0, "seat", 330)),
    frame(T(340, 8, "kesa", 310), U(390, 20, "tuck", 330)),
    frame(T(360, 16, "mount", 300), U(390, 70, "flat", 340)),
    frame(T(362, 12, "mount", 298), U(392, 74, "flat", 342)),
  ],
  "choke-cross": [
    frame(T(360, 0, "kneel"), U(340, 0, "flat", 344)),
    frame(T(358, 0, "mount", 300), U(340, 0, "flat", 344)),
    frame(T(358, 0, "mount", 292), U(340, 0, "flat", 346), [330, 250, 390, 270]),
    frame(T(358, 0, "mount", 294), U(340, 0, "flat", 346), undefined, "Abtippen"),
  ],
  "choke-rear": [
    frame(T(250, 0, "kneel"), U(360, 0, "seat", 324)),
    frame(T(300, 6, "seat", 318), U(370, 0, "seat", 322)),
    frame(T(315, 4, "reach", 312), U(375, -4, "seat", 324), [340, 250, 400, 270]),
    frame(T(318, 4, "reach", 314), U(376, -4, "seat", 324), undefined, "Abtippen"),
  ],
  "choke-collar": [
    frame(T(450, 0, "kneel"), U(330, 0, "flat", 342)),
    frame(T(400, -10, "kesa", 300), U(330, 0, "flat", 340)),
    frame(T(390, -8, "reach", 292), U(328, 0, "flat", 342), [360, 250, 300, 280]),
    frame(T(388, -8, "reach", 294), U(328, 0, "flat", 342), undefined, "Abtippen"),
  ],
  "choke-sankaku": [
    frame(T(300, 0, "guard", 340), U(390, 0, "kneel")),
    frame(T(320, 8, "guard", 336), U(400, -8, "entry", 300)),
    frame(T(330, 6, "guard", 334), U(410, -16, "bow", 292)),
    frame(T(332, 6, "guard", 334), U(412, -16, "bow", 294), undefined, "Abtippen"),
  ],
  "arm-juji": [
    frame(T(430, 0, "kneel"), U(320, 0, "flat", 342)),
    frame(T(380, -70, "flat", 320), U(330, 0, "flat", 342)),
    frame(T(390, -78, "flat", 312), U(328, 2, "flat", 344), [360, 250, 430, 250]),
    frame(T(392, -78, "flat", 314), U(328, 2, "flat", 344), undefined, "Abtippen"),
  ],
  "arm-ude": [
    frame(T(360, 0, "mount", 300), U(340, 0, "flat", 346)),
    frame(T(358, 4, "mount", 294), U(338, 0, "flat", 346)),
    frame(T(356, 8, "reach", 290), U(336, 2, "flat", 348)),
    frame(T(356, 8, "reach", 292), U(336, 2, "flat", 348), undefined, "Abtippen"),
  ],
  "arm-garami": [
    frame(T(420, 0, "kesa", 300), U(320, 0, "flat", 342)),
    frame(T(370, 12, "kesa", 296), U(325, 0, "flat", 342)),
    frame(T(355, 18, "reach", 292), U(322, 4, "flat", 344)),
    frame(T(352, 18, "reach", 294), U(322, 4, "flat", 344), undefined, "Abtippen"),
  ],
  "arm-knee": [
    frame(T(400, 10, "kesa", 300), U(320, 0, "flat", 342)),
    frame(T(360, 16, "kneel", 318), U(324, 0, "flat", 342)),
    frame(T(348, 20, "kneel", 314), U(322, 2, "flat", 344)),
    frame(T(346, 20, "kneel", 316), U(322, 2, "flat", 344), undefined, "Abtippen"),
  ],
  "escape-hold": [
    frame(T(360, 18, "kesa", 296), U(330, 0, "flat", 340)),
    frame(T(370, 12, "kesa", 286), U(340, -16, "guard", 328)),
    frame(T(400, -8, "kneel"), U(340, 30, "tuck", 330)),
    frame(T(450, 0, "kneel"), U(320, 0, "guard", 340)),
  ],
  "escape-arm": [
    frame(T(390, -76, "flat", 314), U(330, 0, "flat", 344), undefined, "Abtippen"),
    frame(T(400, -70, "flat", 318), U(340, 12, "guard", 336)),
    frame(T(430, -20, "kneel"), U(350, 40, "tuck", 332)),
    frame(T(460, 0, "kneel"), U(320, 0, "seat", 330)),
  ],
  combo: [
    frame(T(250, 0, "reap"), U(390, 4, "stand")),
    frame(T(300, -6, "reach"), U(400, -8, "stand", 296)),
    frame(T(345, -24, "seoi", 326), U(400, -6, "reach", 298)),
    frame(T(250, 0, "stand"), U(460, 0, "flat", 336)),
  ],
  chain: [
    frame(T(250, -30, "bow", 320), U(340, -70, "air", 210)),
    frame(T(360, 16, "kesa", 296), U(330, 0, "flat", 340)),
    frame(T(400, -12, "north", 286), U(330, 0, "flat", 340)),
    frame(T(300, 8, "kneel"), U(420, 0, "seat", 328), undefined, "Abtippen"),
  ],
  teach: [
    frame(T(230, 10, "stand"), U(400, -8, "stand")),
    frame(T(300, -16, "entry", 318), U(400, -4, "reach", 300)),
    frame(T(340, -40, "bow", 326), U(400, -72, "air", 214)),
    frame(T(250, 12, "stand"), U(420, -10, "stand")),
  ],
  "guard-pass": [
    frame(T(450, 0, "kneel"), U(320, 0, "guard", 340)),
    frame(T(410, -6, "reach", 312), U(330, 4, "guard", 338)),
    frame(T(390, -14, "kesa", 302), U(330, 8, "flat", 340)),
    frame(T(400, -12, "north", 288), U(326, 0, "flat", 340)),
  ],
  "turn-over": [
    frame(T(460, 0, "kneel"), U(340, 18, "tuck", 336)),
    frame(T(410, -8, "reach", 318), U(350, 12, "tuck", 334)),
    frame(T(380, -24, "kesa", 308), U(345, -30, "air", 318)),
    frame(T(395, -10, "north", 290), U(330, 0, "flat", 340)),
  ],
};

export const BODY_KEYS = [
  "head",
  "shoulder",
  "hip",
  "elbowA",
  "handA",
  "elbowB",
  "handB",
  "kneeA",
  "footA",
  "kneeB",
  "footB",
] as const;
