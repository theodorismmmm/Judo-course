"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { getTechnique, techniques } from "@/lib/catalog";
import { readProfile } from "@/lib/profile";
import { applyResult, levelFor, streakLabel, weakSlugs, type Practice } from "@/lib/practice";
import { matchesAny } from "@/lib/speech";
import type { BeltId } from "@/lib/types";
import { SayAloud, speakAloud } from "./SayAloud";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { usePractice } from "./usePractice";

const LESSON = 5;

type Status = "idle" | "listening" | "right" | "wrong";
type Mic = "ask" | "asking" | "granted" | "denied" | "missing" | "skipped";
type Mark = "right" | "miss";

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

function buildLesson(practice: Practice, belt: BeltId | null) {
  const throws = techniques.filter((technique) => technique.category === "wurf" && technique.youtube);
  const scoped = belt ? throws.filter((technique) => technique.belt === belt) : throws;
  const pool = scoped.length >= LESSON ? scoped : throws;
  const picked: string[] = [];
  for (const slug of weakSlugs(practice)) {
    if (picked.length >= 2) break;
    if (pool.some((technique) => technique.slug === slug)) picked.push(slug);
  }
  const rest = pool.filter((technique) => !picked.includes(technique.slug));
  while (picked.length < LESSON && rest.length) {
    const index = Math.floor(Math.random() * rest.length);
    const next = rest.splice(index, 1)[0];
    if (next) picked.push(next.slug);
  }
  return picked;
}

export function SpeakRoom() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { practice, ready, save } = usePractice();
  const practiceRef = useRef(practice);
  practiceRef.current = practice;
  const [mic, setMic] = useState<Mic>("ask");
  const [slugs, setSlugs] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Mark[]>([]);
  const [roundXp, setRoundXp] = useState(0);
  const [gain, setGain] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState("");
  const [tries, setTries] = useState(0);
  const [note, setNote] = useState("");
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const [supported, setSupported] = useState(true);
  const recogRef = useRef<Recog | null>(null);
  const triesRef = useRef(0);
  const busyRef = useRef(false);
  triesRef.current = tries;

  const belt = isLoaded && isSignedIn ? readProfile(user?.unsafeMetadata).belt : null;
  const technique = slugs[index] ? getTechnique(slugs[index]) : undefined;
  const playing = mic === "granted" || mic === "skipped";

  useEffect(() => {
    setSupported(recognitionCtor() !== null);
  }, []);

  useEffect(() => {
    const perms = navigator.permissions;
    if (!perms?.query) return;
    let gone = false;
    perms
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        if (gone) return;
        if (status.state === "granted") setMic("granted");
        if (status.state === "denied") setMic("denied");
      })
      .catch(() => undefined);
    return () => {
      gone = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !isLoaded || !playing || slugs.length) return;
    setSlugs(buildLesson(practiceRef.current, belt));
  }, [ready, isLoaded, playing, slugs.length, belt]);

  useEffect(() => () => recogRef.current?.abort(), []);

  async function askMic() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMic("missing");
      return;
    }
    setMic("asking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMic("granted");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setMic(name === "NotFoundError" || name === "DevicesNotFoundError" ? "missing" : "denied");
    }
  }

  async function grade(lines: string[]) {
    if (!technique || busyRef.current || status === "right") return;
    busyRef.current = true;
    const source = { slug: technique.slug, reading: technique.reading, jp: technique.jp };
    const ok = matchesAny(lines, source);
    const firstTry = triesRef.current === 0;
    const before = practiceRef.current.points;
    const next = applyResult(practiceRef.current, {
      slug: technique.slug,
      belt: technique.belt,
      correct: ok,
      firstTry,
    });
    setHeard(lines.find((line) => line.trim()) ?? "");
    setStatus(ok ? "right" : "wrong");
    setGain(next.points - before);
    if (ok) setRoundXp((current) => current + (next.points - before));
    if (!ok) {
      setTries((current) => current + 1);
      speakAloud(technique.reading, technique.kanji);
    }
    try {
      await save(next);
    } catch {
      setNote("Die XP sind nur auf diesem Gerät gelandet.");
    } finally {
      busyRef.current = false;
    }
  }

  function listen() {
    const Ctor = recognitionCtor();
    if (!Ctor || !technique || mic !== "granted") {
      setSupported(false);
      setTyping(true);
      setNote("Dieser Browser hat keine Spracherkennung. Tipp den Namen.");
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
        for (let alt = 0; alt < result.length; alt += 1) {
          const line = result[alt]?.transcript;
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

  function advance(mark: Mark) {
    recogRef.current?.abort();
    setResults((current) => [...current, mark]);
    setStatus("idle");
    setHeard("");
    setNote("");
    setTyped("");
    setTyping(false);
    setTries(0);
    setGain(0);
    if (index + 1 >= slugs.length) setDone(true);
    else setIndex((current) => current + 1);
  }

  function again() {
    setDone(false);
    setSlugs(buildLesson(practiceRef.current, belt));
    setIndex(0);
    setResults([]);
    setRoundXp(0);
    setGain(0);
    setStatus("idle");
    setHeard("");
    setNote("");
    setTyped("");
    setTyping(false);
    setTries(0);
  }

  const level = belt ? levelFor(practice.beltPoints[belt] ?? 0) : null;

  return (
    <div className="dojo">
      <SiteHeader />
      <section className="mat lesson" id="inhalt">
        <h1 className="lesson-title">Sprechen</h1>
        <div className="xp-bar">
          <div className="xp-track" aria-hidden="true">
            {Array.from({ length: LESSON }, (_, slot) => (
              <span key={slot} className={results[slot] ? `is-${results[slot]}` : ""} />
            ))}
          </div>
          <p className="xp-pill">
            {ready ? `${practice.points} XP` : "XP …"}
            {gain > 0 && status === "right" ? <strong>+{gain}</strong> : null}
          </p>
        </div>
        <p className="lesson-meta">
          {streakLabel(practice)}
          {level !== null ? ` · Level ${level}` : ""}
        </p>

        {!playing ? (
          <div className="lesson-card">
            <div className="lesson-body">
              <p className="prompt">Mikrofon erlauben</p>
              <p className="lesson-copy">
                Die Lektion spielt den echten Lehrfilm und hört dann, ob du den japanischen Namen richtig sagst. Dafür
                fragt der Browser nach dem Mikrofon. Es wird nichts gespeichert.
              </p>
              {mic === "denied" && (
                <p className="lock-note">
                  Der Browser hat das Mikrofon blockiert. Du kannst es in den Seiteneinstellungen erlauben oder die
                  Namen tippen.
                </p>
              )}
              {mic === "missing" && <p className="lock-note">Hier ist kein Mikrofon zu finden. Du kannst die Namen tippen.</p>}
              <button type="button" className="cta lesson-go" disabled={mic === "asking"} onClick={() => void askMic()}>
                {mic === "asking" ? "Browser fragt …" : "Mikrofon erlauben"}
              </button>
              <button type="button" className="cta cta-ghost" onClick={() => setMic("skipped")}>
                Namen tippen
              </button>
            </div>
          </div>
        ) : done ? (
          <div className="lesson-card">
            <div className="lesson-body">
              <p className="prompt">Lektion geschafft</p>
              <p className="xp-pop">+{roundXp} XP</p>
              <p className="lesson-copy">
                {roundXp > 0
                  ? `${results.filter((mark) => mark === "right").length} von ${LESSON} Namen richtig. Die nächste Runde nimmt Würfe, die oft daneben lagen.`
                  : "Diesmal ohne Treffer. Die nächste Runde nimmt dieselben Würfe noch einmal."}
              </p>
              <button type="button" className="cta lesson-go" onClick={again}>
                Noch eine Lektion
              </button>
              {!isSignedIn && (
                <p className="known-line">
                  <Link href="/sign-in?redirect_url=%2Fsprechen">Anmelden</Link>, dann sind die XP auch auf dem anderen
                  Handy da.
                </p>
              )}
            </div>
          </div>
        ) : !technique ? (
          <p className="loading">Die Lektion wird gemischt …</p>
        ) : (
          <div className="lesson-card">
            <figure className="yt lesson-video">
              <div className="yt-frame">
                <iframe
                  key={technique.youtube}
                  src={`https://www.youtube-nocookie.com/embed/${technique.youtube}?rel=0`}
                  title="Lehrfilm"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <figcaption>Lehrfilm · {technique.videoBy ?? "YouTube"}</figcaption>
            </figure>
            <div className="lesson-body">
              <p className="prompt">Wie heißt dieser Wurf?</p>
              {status === "listening" ? (
                <button type="button" className="mic-button is-live" onClick={stop}>
                  Stopp
                </button>
              ) : status === "idle" && mic === "granted" ? (
                <button type="button" className="mic-button" onClick={listen}>
                  Sagen
                </button>
              ) : null}
              {status === "listening" && <p className="lesson-copy">Ich höre zu …</p>}
              {note && <p className="lock-note">{note}</p>}
              {status === "right" && (
                <div className="feedback is-right" role="status">
                  <p className="xp-pop">+{gain} XP</p>
                  <p>
                    Richtig. <strong>{technique.reading}</strong>.
                  </p>
                  <SayAloud reading={technique.reading} kanji={technique.kanji} />
                  <button type="button" className="cta lesson-go" onClick={() => advance("right")}>
                    Weiter
                  </button>
                </div>
              )}
              {status === "wrong" && (
                <div className="feedback is-wrong" role="status">
                  <p>
                    Noch nicht. Richtig ist <strong>{technique.reading}</strong>.
                    {heard ? ` Gehört: „${heard}“.` : ""}
                  </p>
                  <SayAloud reading={technique.reading} kanji={technique.kanji} label="Aussprache anhören" />
                  <div className="lesson-actions">
                    <button
                      type="button"
                      className="cta lesson-go"
                      onClick={() => {
                        setStatus("idle");
                        setHeard("");
                        setNote("");
                      }}
                    >
                      Nochmal
                    </button>
                    <button type="button" className="cta cta-ghost" onClick={() => advance("miss")}>
                      Weiter
                    </button>
                  </div>
                </div>
              )}
              {(typing || mic !== "granted" || !supported) && status !== "right" && (
                <form
                  className="speak-type"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!typed.trim() || status === "listening") return;
                    void grade([typed]);
                  }}
                >
                  <label>
                    Japanischer Name
                    <input
                      value={typed}
                      onChange={(event) => setTyped(event.target.value)}
                      placeholder="Name"
                      autoComplete="off"
                    />
                  </label>
                  <button type="submit" className="cta lesson-go">
                    Prüfen
                  </button>
                </form>
              )}
              {mic === "granted" && supported && !typing && status === "idle" && (
                <button type="button" className="text-link" onClick={() => setTyping(true)}>
                  Lieber tippen
                </button>
              )}
              {(status === "right" || status === "wrong") && (
                <p className="known-line">
                  <Link href={`/technik/${technique.slug}`}>Zur Technikseite</Link>
                </p>
              )}
            </div>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
