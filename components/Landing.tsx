"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { REVIEWS, SOCIAL } from "@/lib/reviews";
import { readProfile } from "@/lib/profile";
import { AccountSlot } from "./AccountSlot";

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
          <p className="wordmark">JudoNOW</p>
          <AccountSlot />
        </header>

        <section className="landing-hero">
          <div className="landing-copy">
            <p className="eyebrow">JudoNOW</p>
            <h1>
              Ready für den
              <span className="ready"> nächsten Gürtel</span>
            </h1>
            <p className="lead">
              Filme, Karteikarten und dein Gürtelplan an einem Ort. Melde dich an, sag dein Ziel und starte.
            </p>
            <div className="landing-actions">
              <Link href="/sign-up?redirect_url=%2Fstarten" className="cta">
                Anmelden
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
          <p className="landing-more">
            <Link href="/ueben">Ohne Konto ansehen</Link>
            <Link href="/filme">Filme</Link>
            <Link href="/karten">Karten</Link>
          </p>
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
