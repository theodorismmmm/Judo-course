"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BELTS } from "@/lib/belts";
import { LIBRARY } from "@/lib/library";
import { REVIEWS, SOCIAL } from "@/lib/reviews";
import { readProfile } from "@/lib/profile";
import { AccountSlot } from "./AccountSlot";

const ROOMS = [
  { href: "/ueben", index: "01", title: "Übungen", text: "Farbe wählen. Nur der Rang, den du prüfst — Gelb bleibt Gelb." },
  { href: "/filme", index: "02", title: "Filme", text: "Lehrfilm oder vier gezeichnete Phasen, Name japanisch." },
  { href: "/workout", index: "03", title: "Workout", text: "Aufwärmen vor dem Judo, mit Matte oder ohne, plus HIIT." },
  { href: "/karten", index: "04", title: "Karten", text: "Beschreibung lesen, den passenden Namen legen." },
];

export function Landing() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

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
            <p className="social-proof">{SOCIAL.line}</p>
          </div>
          <figure className="landing-photo">
            <img src="/images/landing-hero.jpg" alt="Zwei Judoka auf der Matte beim Wurf" />
          </figure>
        </section>

        <section className="landing-rooms" aria-label="Bereiche">
          {ROOMS.map((room) => (
            <Link key={room.href} href={room.href} className="room-card">
              <span>{room.index}</span>
              <strong>{room.title}</strong>
              <p>{room.text}</p>
            </Link>
          ))}
        </section>

        <section className="landing-path" aria-labelledby="landing-path-title">
          <div className="landing-path-head">
            <p className="eyebrow">DJB-Reihenfolge</p>
            <h2 id="landing-path-title">Elf Ränge, eine Reihenfolge</h2>
          </div>
          <ol className="belt-strip">
            {BELTS.map((belt) => (
              <li key={belt.id}>
                <Link href={`/ueben?gurt=${belt.id}`}>
                  <i style={{ background: belt.clothEnd ? `linear-gradient(90deg, ${belt.cloth}, ${belt.clothEnd})` : belt.cloth }} />
                  <span>{belt.name}</span>
                  <small>{belt.kyu}</small>
                </Link>
              </li>
            ))}
          </ol>
          <p className="landing-more">
            <Link href="/bibliothek">Bibliothek</Link>
            <Link href="/weg">Gürtelweg lesen</Link>
            <Link href="/plan">Wochenplan</Link>
            <Link href="/pruefung">Zur Prüfung</Link>
          </p>
        </section>

        <section className="landing-library" aria-labelledby="landing-library-title">
          <p className="eyebrow">Zum Nachlesen</p>
          <h2 id="landing-library-title">Mehr als die Übungsliste</h2>
          <ul className="library-grid">
            {LIBRARY.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="reviews" aria-label="Stimmen">
          <p className="eyebrow">{SOCIAL.users} Judoka</p>
          <h2>Das sagen Leute, die schon trainieren</h2>
          <div className="review-grid">
            {REVIEWS.map((review) => (
              <blockquote key={review.name} className="review">
                <p>{review.text}</p>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.belt}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
