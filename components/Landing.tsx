"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BELTS } from "@/lib/belts";
import { AccountSlot } from "./AccountSlot";
import { BeltCloth } from "./BeltCloth";

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
      <header className="landing-bar">
        <p className="wordmark">JudoNOW</p>
        <AccountSlot />
      </header>
      <div className="spine" aria-hidden="true">
        {BELTS.map((belt) => (
          <BeltCloth key={belt.id} belt={belt} />
        ))}
      </div>

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
          Starte jetzt
          <span className="with">mit JudoNOW</span>
        </h2>
        <p className="lead">Wähle die Farbe, die du trägst. Die Übungen dieses Gürtels stehen sofort da.</p>
        <div className="picks">
          {BELTS.map((belt) => (
            <Link key={belt.id} href={`/ueben?gurt=${belt.id}`} className="pick">
              <BeltCloth belt={belt} />
              <span className="pick-name">{belt.name}</span>
              <span className="pick-kyu">{belt.kyu}</span>
            </Link>
          ))}
        </div>
        <p className="landing-more">
          <Link href="/filme">Filme aller Attacken</Link>
          <Link href="/karten">Karteikarten</Link>
        </p>
      </section>
    </main>
  );
}
