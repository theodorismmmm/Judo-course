"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { getTechnique, techniques } from "@/lib/catalog";
import { readProfile } from "@/lib/profile";
import { applyResult, levelFor, weakSlugs, type Practice } from "@/lib/practice";
import { matchesAny } from "@/lib/speech";
import type { BeltId, Step, Technique } from "@/lib/types";
import { PracticeMeter } from "./PracticeMeter";
import { SayAloud, speakAloud } from "./SayAloud";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { TechniqueFilm } from "./TechniqueFilm";
import { usePractice } from "./usePractice";

type Status = "idle" | "listening" | "right" | "wrong";

type Heard = { transcript: string };

type Recog = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<Heard> & { length: number }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

function recognitionCtor(): (new () => Recog) | null {
  if (typeof window === "undefined") return null;
  const host = window as Window & {
    SpeechRecognition?: new () => Recog;
    webkitSpeechRecognition?: new () => Recog;
  };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

function micNote(error: string) {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Das Mikrofon ist blockiert. Du kannst den Namen auch eintippen.";
  }
  if (error === "no-speech") return "Ich habe nichts gehört. Nochmal, etwas lauter.";
  if (error === "audio-capture") return "Kein Mikrofon gefunden. Tipp den Namen unten.";
  if (error === "network") return "Die Erkennung braucht kurz Netz. Du kannst den Namen auch eintippen.";
  if (error === "aborted") return "";
  return "Das hat nicht geklappt. Versuch es noch einmal oder tipp den Namen.";
}

function pickSlug(practice: Practice, belt: BeltId | null, avoid?: string) {
  const throws = techniques.filter((technique) => technique.category === "wurf");
  const scoped = belt ? throws.filter((technique) => technique.belt === belt) : throws;
  const pool = (scoped.length ? scoped : throws).filter((technique) => technique.slug !== avoid);
  const usable = pool.length ? pool : throws;
  const weak = weakSlugs(practice).filter((item) => usable.some((technique) => technique.slug === item));
  if (weak.length && Math.random() < 0.6) return weak[Math.floor(Math.random() * weak.length)];
  return usable[Math.floor(Math.random() * usable.length)]?.slug ?? "";
}

function quietSteps(technique: Technique): Step[] {
  const names = [technique.reading, technique.jp, technique.de, technique.kanji].filter((name) => name.length > 2);
  return technique.steps.map((step) => {
    let text = step.text;
    for (const name of names) text = text.split(name).join("dieser Wurf");
    return { ...step, text };
  });
}

export function SpeakRoom() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { practice, ready, save } = usePractice();
  const practiceRef = useRef(practice);
  practiceRef.current = practice;
  const [slug, setSlug] = useState("o-soto-gari");
  const [booted, setBooted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState("");
  const [tries, setTries] = useState(0);
  const [note, setNote] = useState("");
  const [typed, setTyped] = useState("");
  const [supported, setSupported] = useState(true);
  const recogRef = useRef<Recog | null>(null);
  const triesRef = useRef(0);
  triesRef.current = tries;

  const belt = isLoaded && isSignedIn ? readProfile(user?.unsafeMetadata).belt : null;
  const technique = slug ? getTechnique(slug) : undefined;

  useEffect(() => {
    setSupported(recognitionCtor() !== null);
  }, []);

  useEffect(() => {
    if (!ready || !isLoaded || booted) return;
    setBooted(true);
    const hasWeak = weakSlugs(practiceRef.current).length > 0;
    if (!belt && !hasWeak) return;
    setSlug(pickSlug(practiceRef.current, belt));
  }, [ready, isLoaded, booted, belt]);

  useEffect(() => () => recogRef.current?.abort(), []);

  async function grade(lines: string[]) {
    if (!technique) return;
    const source = { slug: technique.slug, reading: technique.reading, jp: technique.jp };
    const ok = matchesAny(lines, source);
    const firstTry = triesRef.current === 0;
    const next = applyResult(practiceRef.current, {
      slug: technique.slug,
      belt: technique.belt,
      correct: ok,
      firstTry,
    });
    setHeard(lines.find((line) => line.trim()) ?? "");
    setStatus(ok ? "right" : "wrong");
    if (!ok) speakAloud(technique.reading, technique.kanji);
    try {
      await save(next);
    } catch {
      setNote("Der Punktestand ist nur auf diesem Gerät gelandet.");
    }
  }

  function listen() {
    const Ctor = recognitionCtor();
    if (!Ctor || !technique) {
      setSupported(false);
      setNote("Dieser Browser hat keine Spracherkennung. Tipp den Namen unten.");
      return;
    }
    recogRef.current?.abort();
    const recog = new Ctor();
    recog.lang = "de-DE";
    recog.interimResults = false;
    recog.maxAlternatives = 5;
    recog.continuous = false;
    let settled = false;
    recog.onresult = (event) => {
      const result = event.results[0];
      const lines: string[] = [];
      if (result) {
        for (let index = 0; index < result.length; index += 1) {
          const line = result[index]?.transcript;
          if (line) lines.push(line);
        }
      }
      settled = true;
      void grade(lines);
    };
    recog.onerror = (event) => {
      if (settled || event.error === "aborted") return;
      settled = true;
      setStatus("idle");
      setNote(micNote(event.error));
    };
    recog.onend = () => {
      if (settled) return;
      settled = true;
      setStatus("idle");
      setNote("Ich habe nichts gehört. Nochmal, etwas näher am Mikrofon.");
    };
    try {
      recog.start();
      recogRef.current = recog;
      setStatus("listening");
      setNote("");
      setHeard("");
    } catch {
      setNote("Das Mikrofon lässt sich gerade nicht starten.");
    }
  }

  function stop() {
    recogRef.current?.abort();
    setStatus("idle");
  }

  function retry() {
    setStatus("idle");
    setHeard("");
    setNote("");
    setTries((current) => current + 1);
  }

  function nextThrow() {
    setStatus("idle");
    setHeard("");
    setNote("");
    setTyped("");
    setTries(0);
    setSlug(pickSlug(practiceRef.current, belt, technique?.slug));
  }

  const weak = weakSlugs(practice, 5)
    .map((item) => getTechnique(item))
    .filter((item): item is Technique => Boolean(item && item.category === "wurf"));
  const revealed = status === "right" || status === "wrong";

  return (
    <div className="dojo">
      <SiteHeader />
      <section className="mat speak" id="inhalt">
        <p className="eyebrow">Namen laut</p>
        <h1>Sprechen</h1>
        <p className="deck">
          Du siehst einen kurzen Wurf und sagst den japanischen Namen, so wie im Dojo. Die Seite hört über das Mikrofon
          zu. Chrome und Safari erkennen japanische Wörter nicht immer perfekt, deshalb zählt eine ähnliche Schreibweise
          mit.
        </p>
        <PracticeMeter />
        {belt && (
          <p className="known-line">
            {belt ? `Level ${levelFor(practice.beltPoints[belt] ?? 0)} auf deinem Gürtel.` : ""} Würfe, die oft daneben
            lagen, kommen öfter wieder.
          </p>
        )}

        {!technique ? (
          <p className="loading">Der nächste Wurf wird gemischt …</p>
        ) : (
          <div className="speak-stage">
            <TechniqueFilm
              key={technique.slug}
              motion={technique.motion}
              steps={quietSteps(technique)}
              mirror={technique.mirror}
              label="Wurf"
              mode="player"
              autoPlay
            />
            <div className="speak-panel">
              <p className="prompt">Wie heißt dieser Wurf?</p>
              {status === "listening" ? (
                <button type="button" className="cta" onClick={stop}>
                  Stopp
                </button>
              ) : status === "idle" ? (
                <button type="button" className="cta" onClick={listen}>
                  Namen sagen
                </button>
              ) : null}
              {status === "listening" && <p className="known-line">Ich höre zu …</p>}
              {note && <p className="lock-note">{note}</p>}
              {status === "right" && (
                <div className="speak-result">
                  <p>
                    Richtig. <strong>{technique.reading}</strong>.
                    {tries === 0 ? " +10 Punkte." : " +4 Punkte."}
                  </p>
                  <SayAloud reading={technique.reading} kanji={technique.kanji} />
                  <button type="button" className="cta" onClick={nextThrow}>
                    Nächster Wurf
                  </button>
                </div>
              )}
              {status === "wrong" && (
                <div className="speak-result">
                  <p>
                    Noch nicht. Richtig ist <strong>{technique.reading}</strong>.
                    {heard ? ` Gehört: „${heard}“.` : ""}
                  </p>
                  <SayAloud reading={technique.reading} kanji={technique.kanji} label="Aussprache anhören" />
                  <div className="speak-actions">
                    <button type="button" className="cta" onClick={retry}>
                      Nochmal versuchen
                    </button>
                    <button type="button" className="cta cta-ghost" onClick={nextThrow}>
                      Weiter
                    </button>
                  </div>
                </div>
              )}
              <form
                className="speak-type"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!typed.trim() || status === "listening") return;
                  void grade([typed]);
                }}
              >
                <label>
                  {supported ? "Oder tippen" : "Name eintippen"}
                  <input
                    value={typed}
                    onChange={(event) => setTyped(event.target.value)}
                    placeholder="Japanischer Name"
                    autoComplete="off"
                  />
                </label>
                <button type="submit" className="cta cta-ghost">
                  Prüfen
                </button>
              </form>
              {revealed && (
                <p className="known-line">
                  <Link href={`/technik/${technique.slug}`}>Zur Technikseite</Link>
                  {technique.youtube ? ", dort liegt auch der Lehrfilm." : "."}
                </p>
              )}
            </div>
          </div>
        )}

        {weak.length > 0 && (
          <div className="weak-list">
            <h2>Oft daneben</h2>
            <ul>
              {weak.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(item.slug);
                      setStatus("idle");
                      setTries(0);
                      setHeard("");
                      setNote("");
                    }}
                  >
                    {item.reading}
                  </button>
                  <span>{practice.misses[item.slug]} mal</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
