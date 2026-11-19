"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BELTS, beltById, isBelt } from "@/lib/belts";
import { techniques } from "@/lib/catalog";
import { buildExam } from "@/lib/exam";
import { applyResult, POINTS_EXAM } from "@/lib/practice";
import { readProfile } from "@/lib/profile";
import type { BeltId } from "@/lib/types";
import { useKnown } from "./KnownMark";
import { PracticeMeter } from "./PracticeMeter";
import { usePractice } from "./usePractice";

export function ExamRoom({ initialBelt }: { initialBelt?: string | null }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const profileBelt = isLoaded && isSignedIn ? readProfile(user?.unsafeMetadata).belt : null;
  const starting = isBelt(initialBelt) ? initialBelt : profileBelt ?? "gelb";
  const [beltId, setBeltId] = useState<BeltId>(starting);
  const [seed, setSeed] = useState(1);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started || isBelt(initialBelt) || !profileBelt) return;
    setBeltId(profileBelt);
  }, [initialBelt, profileBelt, started]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const { known } = useKnown();
  const { practice, save } = usePractice();
  const lock = useRef(false);
  const questions = useMemo(() => buildExam(beltId, seed), [beltId, seed]);
  const question = questions[index];
  const finished = started && index >= questions.length;
  const belt = beltById(beltId);

  function begin() {
    lock.current = false;
    setStarted(true);
    setIndex(0);
    setScore(0);
    setWrong([]);
    setPicked(null);
  }

  async function choose(slug: string) {
    if (!question || picked || lock.current) return;
    lock.current = true;
    setPicked(slug);
    const correct = slug === question.slug;
    if (correct) setScore((current) => current + 1);
    else setWrong((current) => [...current, question.slug]);
    try {
      await save(
        applyResult(practice, {
          slug: question.slug,
          belt: beltId,
          correct,
          firstTry: true,
          points: correct ? POINTS_EXAM : 0,
        }),
      );
    } catch {
      // Der Stand liegt schon lokal. Das Konto holt ihn beim nächsten Mal nach.
    }
  }

  const missing = techniques.filter((technique) => technique.belt === beltId && !known.has(technique.slug));

  return (
    <section className="exam-room" aria-labelledby="probetest-title">
      <h2 id="probetest-title">Probetest</h2>
      <p>
        Ein Durchgang für eine Gürtelfarbe. Acht Fragen, vier Namen, sechs XP für jede richtige Antwort. Am Ende
        siehst du, was in diesem Test daneben lag und was du noch nicht abgehakt hast.
      </p>
      <PracticeMeter redirect="/pruefung" />
      {!started ? (
        <form
          className="exam-setup"
          onSubmit={(event) => {
            event.preventDefault();
            begin();
          }}
        >
          <label>
            Gürtel
            <select value={beltId} onChange={(event) => setBeltId(event.target.value as BeltId)}>
              {BELTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="cta">
            Test starten
          </button>
        </form>
      ) : finished ? (
        <div className="exam-result">
          <p>
            {score} von {questions.length} für {belt?.name}. Das sind {score * POINTS_EXAM} XP.
          </p>
          {wrong.length > 0 && (
            <>
              <h3>In diesem Test daneben</h3>
              <ul className="link-pills">
                {wrong.map((slug) => {
                  const technique = techniques.find((item) => item.slug === slug);
                  if (!technique) return null;
                  return (
                    <li key={slug}>
                      <Link href={`/technik/${slug}`}>{technique.reading}</Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <h3>Noch nicht abgehakt</h3>
          {isSignedIn ? (
            missing.length === 0 ? (
              <p>Auf diesem Gürtel ist alles abgehakt.</p>
            ) : (
              <ul className="link-pills">
                {missing.map((technique) => (
                  <li key={technique.slug}>
                    <Link href={`/technik/${technique.slug}`}>{technique.reading}</Link>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p>
              <Link href="/sign-in?redirect_url=%2Fpruefung">Mit einem Konto</Link> bleiben die Häkchen gespeichert, auch
              auf einem anderen Handy. Dann steht hier, welche Techniken noch fehlen.
            </p>
          )}
          <button
            type="button"
            className="cta"
            onClick={() => {
              setSeed((current) => current + 1);
              setStarted(false);
            }}
          >
            Anderen Test
          </button>
        </div>
      ) : question ? (
        <div className="exam-question">
          <p className="card-index">
            {index + 1} / {questions.length}
          </p>
          <p className="prompt">{question.prompt}</p>
          <div className="choice-grid">
            {question.choices.map((choice) => {
              const state = !picked ? "open" : choice.slug === question.slug ? "done" : choice.slug === picked ? "bad" : "open";
              return (
                <button
                  key={choice.slug}
                  type="button"
                  className="tile"
                  data-state={state}
                  disabled={Boolean(picked)}
                  onClick={() => void choose(choice.slug)}
                >
                  <strong>{choice.reading}</strong>
                </button>
              );
            })}
          </div>
          {picked && (
            <button
              type="button"
              className="cta"
              onClick={() => {
                lock.current = false;
                setPicked(null);
                setIndex((current) => current + 1);
              }}
            >
              {index + 1 === questions.length ? "Auswertung" : "Weiter"}
            </button>
          )}
        </div>
      ) : (
        <p>Für diese Farbe liegt noch kein Test im Katalog.</p>
      )}
    </section>
  );
}
