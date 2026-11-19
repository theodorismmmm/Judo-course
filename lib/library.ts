export const LIBRARY = [
  {
    href: "/suche",
    title: "Suche",
    text: "Seoi eintippen und jeden passenden Wurf sehen, über alle Gürtel.",
  },
  {
    href: "/weg",
    title: "Gürtelweg",
    text: "Von Weiß bis 2. Dan: was auf diesem Rang steht, mit Link zu jeder Technik.",
  },
  {
    href: "/plan",
    title: "Wochenpläne",
    text: "Drei Einheiten, und ein Datum, bis zu dem sich der Plan verengt.",
  },
  {
    href: "/pruefung",
    title: "Prüfung",
    text: "Probetest pro Gürtel, mit XP und den Techniken, die noch fehlen.",
  },
  {
    href: "/regeln",
    title: "Wettkampf",
    text: "Was Ippon, Waza-ari und Shido bedeuten.",
  },
  {
    href: "/trainer",
    title: "Trainer",
    text: "Eine Gruppe anlegen und sehen, wie weit die Judoka sind.",
  },
  {
    href: "/glossar",
    title: "Glossar",
    text: "Japanische Wörter von der Matte, kurz erklärt. Die Namen bleiben japanisch.",
  },
  {
    href: "/sicherheit",
    title: "Sicherheit",
    text: "Fallen, Abtippen, Würgen und Klammern. Was hier nicht geübt wird.",
  },
  {
    href: "/uebersicht",
    title: "Seitenübersicht",
    text: "Jede Seite und jede Technik als Link, plus die XML-Sitemap für Suchmaschinen.",
  },
] as const;

export const GLOSSARY: { term: string; reading: string; text: string }[] = [
  { term: "Dojo", reading: "道場", text: "Der Trainingsraum. Schuhe bleiben draußen, auf die Matte geht es barfuß." },
  { term: "Tatami", reading: "畳", text: "Die Matte. Würfe enden hier, nicht auf dem Hallenboden." },
  { term: "Judogi", reading: "柔道着", text: "Die Jacke mit Hose und Gürtel. Ärmel und Revers sind Griffe, der Gürtel zeigt den Rang." },
  { term: "Rei", reading: "礼", text: "Der Gruß. Vor der Matte, vor dem Partner, nach der Übung." },
  { term: "Tori", reading: "取り", text: "Die Person, die die Technik ausführt." },
  { term: "Uke", reading: "受け", text: "Die Person, die fällt, gehalten wird oder abtippt." },
  { term: "Shizen Hontai", reading: "自然本体", text: "Die natürliche Haltung: Füße etwa schulterbreit, Knie weich, Oberkörper aufrecht." },
  { term: "Kumi Kata", reading: "組方", text: "Der Griff. Klassisch eine Hand am Ärmel, eine am Revers." },
  { term: "Kuzushi", reading: "崩し", text: "Das Gleichgewicht brechen, bevor der Wurf kommt." },
  { term: "Tsukuri", reading: "作り", text: "Den Körper in den Wurf drehen und den Partner führen." },
  { term: "Kake", reading: "掛け", text: "Der Wurf selbst." },
  { term: "Zanshin", reading: "残心", text: "Danach aufrecht bleiben, den Partner sehen, nicht hinterherfallen." },
  { term: "Ukemi", reading: "受身", text: "Das Fallen. Kinn an die Brust, Arme schlagen flach, der Kopf bleibt oben." },
  { term: "Nage Waza", reading: "投げ技", text: "Wurftechniken." },
  { term: "Osaekomi Waza", reading: "抑え込み技", text: "Haltegriffe, zum Beispiel Kesa Gatame." },
  { term: "Shime Waza", reading: "絞め技", text: "Würgegriffe. Ab Orange, nur mit Aufsicht und nur bis zum Abtippen." },
  { term: "Kansetsu Waza", reading: "関節技", text: "Armhebel, hier Klammern genannt. Die ersten ab Gelb, langsam, nie gerissen." },
  { term: "Ne Waza", reading: "寝技", text: "Arbeit am Boden: halten, entkommen, und später würgen oder klammern." },
  { term: "Uchikomi", reading: "打ち込み", text: "Den Wurf oft ansetzen, ohne jedes Mal zu Ende zu werfen." },
  { term: "Nagekomi", reading: "投げ込み", text: "Den Wurf wirklich zu Ende bringen, mit Ukemi." },
  { term: "Randori", reading: "乱取り", text: "Freies Üben. Beide suchen den Wurf, niemand gewinnt um jeden Preis." },
  { term: "Tokui Waza", reading: "得意技", text: "Der Wurf, der dir liegt und den du in Verbindungen weiterbaust." },
  { term: "Hajime", reading: "始め", text: "Beginn. Danach läuft die Übung." },
  { term: "Mate", reading: "待て", text: "Stopp. Hände los, beide stehen." },
  { term: "Abtippen", reading: "まいりました", text: "Das Stoppsignal mit der Hand auf die Matte oder auf den Partner. Tori lässt sofort los." },
];

export const EXAM_STEPS = [
  {
    title: "Gürtel öffnen",
    text: "Unter Übungen die Farbe wählen, die du prüfen lässt. „Dieser Gürtel“ zeigt nur diesen Rang, „Bis hierhin“ alles davor.",
  },
  {
    title: "Würfe abhaken",
    text: "Mit Konto tippst du bei jedem Wurf an, den du schon sauber werfen kannst. Die Zahl über der Liste sagt, was noch fehlt.",
  },
  {
    title: "Filme ansehen",
    text: "Jede Technik hat einen Lehrfilm oder die vier Schritte als Text. Einmal langsam, einmal mit dem Namen laut.",
  },
  {
    title: "Karten mischen",
    text: "Unter Karten kommt die Beschreibung, du suchst den japanischen Namen. Falsch bleibt in der Runde, richtig wandert raus.",
  },
  {
    title: "Drei ruhige Einheiten",
    text: "Der Wochenplan legt pro Rang drei Einheiten. Vor der Prüfung wiederholst du die, nicht zehn neue Namen.",
  },
  {
    title: "Am Tag selbst",
    text: "Rei, dann Ukemi, dann die Würfe, die du abgehakt hast. Klammern und Würgen nur, wenn eine Trainerin oder ein Trainer zusieht.",
  },
];

export const SAFETY = [
  {
    title: "Fallen zuerst",
    text: "Ukemi kommt vor dem ersten Wurf. Kinn auf die Brust, Arme flach, nicht mit der Hand abstützen.",
  },
  {
    title: "Abtippen beendet die Übung",
    text: "Uke tippt, Tori lässt im selben Moment los. Weiterdrücken nach dem Tippen ist kein Training.",
  },
  {
    title: "Klammern ab Gelb",
    text: "Armhebel werden langsam geführt, nie gerissen. Das Gelenk geht nur in die Richtung, die es sowieso kann, und nur bis zum Abtippen.",
  },
  {
    title: "Würgen ab Orange",
    text: "Würgegriffe stehen ab dem orangenen Gürtel. Nur auf der Matte, nur mit qualifizierter Aufsicht, nur bis zum Abtippen. Schwindel oder ein dunkles Bild heißt: sofort loslassen.",
  },
  {
    title: "Was hier keine Übung ist",
    text: "Kani Basami, Kawazu Gake und Daki Age sind im Wettkampf verboten und stehen nicht im Katalog. Kein Wurf auf den Kopf, kein Hebel an Hals oder Wirbelsäule.",
  },
  {
    title: "Der Verein entscheidet die Prüfung",
    text: "Die Farben folgen der DJB-Reihenfolge von 2024. Welche Techniken an dem Tag drankommen, setzt der Verein. JudoNOW ist der Plan zum Üben, nicht die Prüfungsordnung.",
  },
];
