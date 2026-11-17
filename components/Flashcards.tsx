"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { CARD_MODES, cardText, cardsFor, deal, isCardMode, readKnown, type CardMode } from "@/lib/study";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function Flashcards() {
  const [mode, setMode] = useState<CardMode>("wurf");
  const [round, setRound] = useState(0);
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState(false);
  const [misses, setMisses] = useState(0);
  const [note, setNote] = useState("");
  const { user, isSignedIn } = useUser();
  const pool = useMemo(() => cardsFor(mode), [mode]);
  const { prompts, names } = useMemo(() => deal(pool, round), [pool, round]);
  const cleared = prompts.length > 0 && done.length === prompts.length;

  useEffect(() => {
    setLeft(null);
    setRight(null);
    setDone([]);
    setBad(false);
    setNote("");
  }, [mode, round]);

  function choose(side: "left" | "right", slug: string) {
    if (done.includes(slug) || bad) return;
    const other = side === "left" ? right : left;
    if (side === "left") setLeft(slug);
    else setRight(slug);
    if (!other) return;
    if (other === slug) {
      setDone((current) => (current.includes(slug) ? current : [...current, slug]));
      setLeft(null);
      setRight(null);
      return;
    }
    setBad(true);
    setMisses((count) => count + 1);
    window.setTimeout(() => {
      setBad(false);
      setLeft(null);
      setRight(null);
    }, 700);
  }

  async function saveThrows() {
    const slugs = prompts.filter((technique) => technique.category === "wurf").map((technique) => technique.slug);
    if (!slugs.length) return;
    if (!isSignedIn || !user) {
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent("/karten")}`;
      return;
    }
    const next = [...new Set([...readKnown(user.unsafeMetadata), ...slugs])];
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, known: next } });
    setNote("Diese Würfe sind abgehakt.");
  }

  function tileState(slug: string, side: "left" | "right") {
    if (done.includes(slug)) return "done";
    const picked = side === "left" ? left === slug : right === slug;
    if (picked && bad) return "bad";
    if (picked) return "picked";
    return "open";
  }

  return (
    <div className="room">
      <SiteHeader />
      <main id="inhalt" className="cards-page">
        <p className="eyebrow">Karteikarten</p>
        <h1>Name zur Beschreibung</h1>
        <p className="deck">
          Tippe eine Beschreibung und den passenden Namen. Die Würfe, die du schon kannst, hakst du im Konto ab.
        </p>
        <div className="chips" role="toolbar" aria-label="Kartenstapel">
          {CARD_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={mode === item.id}
              onClick={() => {
                if (isCardMode(item.id)) {
                  setMode(item.id);
                  setRound(0);
                  setMisses(0);
                }
              }}
            >
              {item.label}
              <span>{cardsFor(item.id).length}</span>
            </button>
          ))}
        </div>
        <p className="card-status" role="status">
          Runde {round + 1} · {misses} Fehler
          {note ? ` · ${note}` : ""}
        </p>
        {prompts.length < 2 ? (
          <p className="empty">Für diesen Stapel sind zu wenig Übungen da.</p>
        ) : (
          <div className="match">
            <div className="pile">
              <h2>Beschreibung</h2>
              {prompts.map((technique) => (
                <button
                  key={technique.slug}
                  type="button"
                  className="tile"
                  data-slug={technique.slug}
                  data-state={tileState(technique.slug, "left")}
                  disabled={done.includes(technique.slug)}
                  onClick={() => choose("left", technique.slug)}
                >
                  {cardText(technique)}
                </button>
              ))}
            </div>
            <div className="pile">
              <h2>Name</h2>
              {names.map((technique) => (
                <button
                  key={technique.slug}
                  type="button"
                  className="tile"
                  data-slug={technique.slug}
                  data-state={tileState(technique.slug, "right")}
                  disabled={done.includes(technique.slug)}
                  onClick={() => choose("right", technique.slug)}
                >
                  <strong>{technique.reading}</strong>
                  <span>{technique.de}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {cleared && (
          <div className="stage-nav">
            <button type="button" className="next-attack" onClick={() => setRound((value) => value + 1)}>
              Nächste vier
            </button>
            {prompts.some((technique) => technique.category === "wurf") && (
              <button type="button" onClick={saveThrows}>
                Diese Würfe abhaken
              </button>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
