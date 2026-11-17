import type { Belt, BeltId, CategoryId } from "./types";
import { BELT_IDS } from "./types";

export const BELTS: Belt[] = [
  {
    id: "weiss",
    name: "Weißgurt",
    kyu: "Einstieg",
    cloth: "#f3efe6",
    ink: "#16130f",
    stripes: 0,
    line: "Gruß, Stand und die ersten Fallübungen.",
  },
  {
    id: "weiss-gelb",
    name: "Weiß-Gelb",
    kyu: "8. Kyu",
    cloth: "#f3efe6",
    clothEnd: "#f0c84a",
    ink: "#16130f",
    stripes: 0,
    line: "Der erste Wurf und der erste Haltegriff.",
  },
  {
    id: "gelb",
    name: "Gelbgurt",
    kyu: "7. Kyu",
    cloth: "#f0c84a",
    ink: "#16130f",
    stripes: 0,
    line: "Die großen Würfe: Schulter, Außen- und Innensichel. Dazu halten und die ersten Klammern.",
  },
  {
    id: "gelb-orange",
    name: "Gelb-Orange",
    kyu: "6. Kyu",
    cloth: "#f0c84a",
    clothEnd: "#e07032",
    ink: "#16130f",
    stripes: 0,
    line: "Schwebende Hüfte, beidarmiger Schulterwurf und Varianten am Boden.",
  },
  {
    id: "orange",
    name: "Orangegurt",
    kyu: "5. Kyu",
    cloth: "#e07032",
    ink: "#16130f",
    stripes: 0,
    line: "Mehr Würfe: Knierad aus dem Gelbgurt, kleine Sicheln, Nachfegen. Dazu die ersten Würgegriffe.",
  },
  {
    id: "orange-gruen",
    name: "Orange-Grün",
    kyu: "4. Kyu",
    cloth: "#e07032",
    clothEnd: "#2f7a45",
    ink: "#16130f",
    stripes: 0,
    line: "Hüftfegen, Hüftrad und der nächste Hebel.",
  },
  {
    id: "gruen",
    name: "Grüngurt",
    kyu: "3. Kyu",
    cloth: "#2f7a45",
    ink: "#f4efe6",
    stripes: 0,
    line: "Hüftfegen, Innenschenkel, die ersten Opferwürfe.",
  },
  {
    id: "blau",
    name: "Blaugurt",
    kyu: "2. Kyu",
    cloth: "#1e4f86",
    ink: "#f4efe6",
    stripes: 0,
    line: "Taktik, Konter und der Griffkampf.",
  },
  {
    id: "braun",
    name: "Braungurt",
    kyu: "1. Kyu",
    cloth: "#6a3d28",
    ink: "#f4efe6",
    stripes: 0,
    line: "Der Rest des Gokyo, das eigene Profil, das volle Bodenprogramm.",
  },
  {
    id: "dan1",
    name: "1. Dan",
    kyu: "Shodan",
    cloth: "#16130f",
    ink: "#f4efe6",
    stripes: 1,
    line: "Shinmeisho, Konter und der Übergang in den Boden.",
  },
  {
    id: "dan2",
    name: "2. Dan",
    kyu: "Nidan",
    cloth: "#16130f",
    ink: "#f4efe6",
    stripes: 2,
    line: "Tokui-waza, Systeme, Randori-Plan, Unterrichten.",
  },
];

export const CATEGORIES: {
  id: CategoryId;
  label: string;
  one: string;
  many: string;
  from?: BeltId;
  fromLabel?: string;
  lock: string;
}[] = [
  {
    id: "grundlage",
    label: "Grundlagen",
    one: "Grundlage",
    many: "Grundlagen",
    lock: "",
  },
  {
    id: "fallschule",
    label: "Fallschule",
    one: "Fallschule",
    many: "Fallschulen",
    lock: "",
  },
  {
    id: "wurf",
    label: "Würfe",
    one: "Wurf",
    many: "Würfe",
    lock: "",
  },
  {
    id: "haltegriff",
    label: "Haltegriffe",
    one: "Haltegriff",
    many: "Haltegriffe",
    lock: "",
  },
  {
    id: "wuergegriff",
    label: "Würgegriffe",
    one: "Würgegriff",
    many: "Würgegriffe",
    from: "orange",
    fromLabel: "Orange",
    lock: "Würgegriffe stehen ab Orange. Nur auf der Matte, nur mit Trainerin oder Trainer, nur bis zum Abtippen.",
  },
  {
    id: "klammer",
    label: "Klammern",
    one: "Klammer",
    many: "Klammern",
    from: "gelb",
    fromLabel: "Gelb",
    lock: "Klammern sind Armhebel. Die ersten stehen ab dem gelben Gürtel und werden langsam geführt, nie gerissen. Uke tippt ab, Tori lässt los.",
  },
  {
    id: "entkommen",
    label: "Entkommen",
    one: "Entkommen",
    many: "Entkommen",
    lock: "",
  },
  {
    id: "verbindung",
    label: "Verbindungen",
    one: "Verbindung",
    many: "Verbindungen",
    lock: "",
  },
  {
    id: "studium",
    label: "Studium",
    one: "Studium",
    many: "Studium",
    lock: "",
  },
];

export function beltIndex(id: BeltId) {
  return BELT_IDS.indexOf(id);
}

export function beltById(id: string | null | undefined) {
  return BELTS.find((belt) => belt.id === id);
}

export function isBelt(value: string | null | undefined): value is BeltId {
  return BELT_IDS.includes(value as BeltId);
}

export function categoryById(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id)!;
}

export function isCategory(value: string | null | undefined): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}

export function categoryUnlocked(category: CategoryId, belt: BeltId) {
  const from = categoryById(category).from;
  if (!from) return true;
  return beltIndex(belt) >= beltIndex(from);
}

export const SAFETY_SHIME =
  "Würgegriff nur im betreuten Training. Beide Hände arbeiten am Revers, nicht auf dem Kehlkopf. Uke tippt ab — Tori lässt in derselben Sekunde vollständig los. Nie allein, nie außerhalb der Matte, nie als Spiel.";

export const SAFETY_ARM =
  "Klammer heißt Armhebel. Der Ellbogen wird langsam in eine Linie gebracht, nie gerissen. Sobald Uke tippt, ist die Übung vorbei. Nur mit Trainerin oder Trainer.";

export const SAFETY_ESCAPE_ARM =
  "Sitzt der Hebel schon, wird nicht herausgerissen. Dann wird abgetippt. Solange noch Raum da ist: Ellbogen zurück in die Beugung, Körper zur sicheren Seite drehen.";

export const DEFAULT_PHASES: Record<CategoryId, [string, string, string, string]> = {
  grundlage: ["Haltung", "Kontakt", "Bewegung", "Schluss"],
  fallschule: ["Blick", "Kinn", "Kontakt", "Aufstehen"],
  wurf: ["Kuzushi", "Tsukuri", "Kake", "Zanshin"],
  haltegriff: ["Einstieg", "Arme", "Hüfte", "Halten"],
  wuergegriff: ["Kontrolle", "Griff", "Form", "Abtippen"],
  klammer: ["Kontrolle", "Ellbogen", "Linie", "Abtippen"],
  entkommen: ["Rahmen", "Hüfte", "Drehen", "Frei"],
  verbindung: ["Erste Aktion", "Reaktion", "Zweite Aktion", "Weiter"],
  studium: ["Ziel", "Aufbau", "Übung", "Rückblick"],
};
