"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Landing() {
  const [phase, setPhase] = useState<"motto" | "start">("motto");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("start");
      return;
    }
    const timer = window.setTimeout(() => setPhase("start"), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main id="inhalt" className={`landing ${phase === "start" ? "is-start" : "is-motto"}`}>
      <div className="edge" aria-hidden="true" />
      <header className="landing-bar">
        <p className="wordmark">JudoNOW</p>
        <p className="landing-meta">Ohne Konto</p>
      </header>

      <section className="layer motto-layer" inert={phase !== "motto"}>
        <button type="button" className="motto-hit" onClick={() => setPhase("start")}>
          <p className="eyebrow">JudoNOW</p>
          <h1>
            <span className="ready">Ready</span>
            <span>für den nächsten Gürtel</span>
          </h1>
          <span className="timer" aria-hidden="true">
            <span />
          </span>
          <span className="skip">Weiter</span>
        </button>
        <noscript>
          <a className="cta" href="/ueben">
            Starte jetzt mit JudoNOW
          </a>
        </noscript>
      </section>

      <section className="layer start-layer" inert={phase !== "start"}>
        <p className="eyebrow">Ready für den nächsten Gürtel</p>
        <h2>
          <span>Starte jetzt</span>
          <span className="with">mit JudoNOW</span>
        </h2>
        <p className="lead">
          Wähle deinen Gürtel. Die Übungen stehen sofort da: Würfe, Haltegriffe und ab Blau auch Würgegriffe, Klammern
          und Entkommen. Vom Weißgurt bis zum 2. Dan.
        </p>
        <Link href="/ueben" className="cta">
          Starte jetzt
        </Link>
        <button type="button" className="text-button" onClick={() => setPhase("motto")}>
          Motto noch einmal
        </button>
      </section>
    </main>
  );
}
