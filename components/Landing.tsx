"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BELTS } from "@/lib/belts";
import { LIBRARY } from "@/lib/library";
import { readProfile } from "@/lib/profile";
import { AccountSlot } from "./AccountSlot";
import { SiteFooter } from "./SiteFooter";

const ROOMS = [
  { href: "/ueben", index: "01", title: "Übungen", text: "Farbe wählen. Nur der Rang, den du prüfst." },
  { href: "/filme", index: "02", title: "Filme", text: "Lehrfilme der Reihe nach, Name japanisch." },
  { href: "/karten", index: "03", title: "Karten", text: "Beschreibung lesen, den passenden Namen legen." },
  { href: "/pruefung", index: "04", title: "Prüfung", text: "Probetest pro Gürtel und die Woche davor." },
];

function delay(index: number, step = 70) {
  return { "--d": `${index * step}ms` } as CSSProperties;
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const mark = () => node.classList.add("is-in");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      mark();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        mark();
        observer.disconnect();
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    node.classList.add("is-armed");
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function Landing() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const roomsRef = useReveal<HTMLElement>();
  const pathRef = useReveal<HTMLElement>();
  const libraryRef = useReveal<HTMLElement>();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const profile = readProfile(user.unsafeMetadata);
    router.replace(profile.onboarded ? "/ueben" : "/starten");
  }, [isLoaded, isSignedIn, router, user]);

  return (
    <main id="inhalt" className="landing">
      <div className="landing-shell">
        <header className="landing-bar">
          <Link href="/" className="wordmark brand-mark">
            <img src="/logo.png" alt="" width={28} height={28} className="brand-logo" />
            JudoNOW
          </Link>
          <AccountSlot />
        </header>

        <section className="landing-hero">
          <div className="landing-copy">
            <p className="eyebrow">Ready für den nächsten Gürtel</p>
            <h1>
              Dein Dojo
              <span className="ready"> für den nächsten Rang</span>
            </h1>
            <p className="lead">
              Gürtelplan, Lehrfilme, Wochenplan und Karteikarten. Die Technik heißt Kesa Gatame, nicht anders.
            </p>
            <div className="landing-actions">
              <Link href="/sign-up?redirect_url=%2Fstarten" className="cta">
                Konto anlegen
              </Link>
              <Link href="/sign-in?redirect_url=%2Fstarten" className="cta cta-ghost">
                Ich habe schon ein Konto
              </Link>
            </div>
            <form className="landing-search" action="/suche">
              <input name="q" aria-label="Technik suchen" placeholder="Seoi" autoComplete="off" />
              <button className="cta" type="submit">
                Suchen
              </button>
            </form>
          </div>
          <figure className="landing-photo">
            <img src="/images/landing-hero.jpg" alt="Zwei Judoka auf der Matte beim Wurf" />
          </figure>
        </section>

        <section ref={roomsRef} className="landing-rooms reveal" aria-label="Bereiche">
          {ROOMS.map((room, index) => (
            <Link key={room.href} href={room.href} className="room-card rise-item" style={delay(index, 90)}>
              <span>{room.index}</span>
              <strong>{room.title}</strong>
              <p>{room.text}</p>
            </Link>
          ))}
        </section>

        <section ref={pathRef} className="landing-path reveal" aria-labelledby="landing-path-title">
          <div className="landing-path-head rise-item" style={delay(0)}>
            <p className="eyebrow">DJB-Reihenfolge</p>
            <h2 id="landing-path-title">Elf Ränge, eine Reihenfolge</h2>
          </div>
          <ol className="belt-strip">
            {BELTS.map((belt, index) => (
              <li key={belt.id} className="rise-item" style={delay(index, 45)}>
                <Link href={`/ueben?gurt=${belt.id}`}>
                  <i
                    style={{
                      background: belt.clothEnd
                        ? `linear-gradient(90deg, ${belt.cloth}, ${belt.clothEnd})`
                        : belt.cloth,
                    }}
                  />
                  <span>{belt.name}</span>
                  <small>{belt.kyu}</small>
                </Link>
              </li>
            ))}
          </ol>
          <p className="landing-more rise-item" style={delay(6, 40)}>
            <Link href="/bibliothek">Bibliothek</Link>
            <Link href="/weg">Gürtelweg lesen</Link>
            <Link href="/plan">Wochenplan</Link>
            <Link href="/pruefung">Zur Prüfung</Link>
          </p>
        </section>

        <section ref={libraryRef} className="landing-library reveal" aria-labelledby="landing-library-title">
          <div className="rise-item" style={delay(0)}>
            <p className="eyebrow">Plan, Prüfung, Regeln</p>
            <h2 id="landing-library-title">Mehr als die Übungsliste</h2>
          </div>
          <ul className="library-grid">
            {LIBRARY.map((item, index) => (
              <li key={item.href} className="rise-item" style={delay(index, 80)}>
                <Link href={item.href}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
