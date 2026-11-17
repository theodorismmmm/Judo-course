"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BELTS } from "@/lib/belts";
import { GOALS, goalLabels, readProfile, type GoalId } from "@/lib/profile";
import type { BeltId } from "@/lib/types";
import { BeltCloth } from "./BeltCloth";

type Step = "goals" | "belt" | "pack" | "ready";

export function Onboarding() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<Step>("goals");
  const [goals, setGoals] = useState<GoalId[]>([]);
  const [belt, setBelt] = useState<BeltId | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      router.replace("/sign-up?redirect_url=%2Fstarten");
      return;
    }
    const profile = readProfile(user.unsafeMetadata);
    if (profile.onboarded) {
      router.replace(profile.belt ? `/ueben?gurt=${profile.belt}` : "/ueben");
      return;
    }
    if (profile.goals.length) setGoals(profile.goals);
    if (profile.belt) setBelt(profile.belt);
  }, [isLoaded, isSignedIn, router, user]);

  function toggleGoal(id: GoalId) {
    setGoals((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function saveAndContinue(next: Step, data: { goals?: GoalId[]; belt?: BeltId }) {
    if (!user) return;
    setPending(true);
    setError("");
    try {
      const profile = readProfile(user.unsafeMetadata);
      await user.updateMetadata({
        unsafeMetadata: {
          goals: data.goals ?? profile.goals,
          belt: data.belt ?? profile.belt,
          onboarded: false,
        },
      });
      setStep(next);
    } catch {
      setError("Das hat nicht geklappt. Versuch es noch einmal.");
    } finally {
      setPending(false);
    }
  }

  async function finish() {
    if (!user || !belt) return;
    setPending(true);
    setError("");
    try {
      await user.updateMetadata({
        unsafeMetadata: {
          goals,
          belt,
          onboarded: true,
        },
      });
      window.localStorage.setItem("judonow-gurt", belt);
      router.push(`/ueben?gurt=${belt}`);
    } catch {
      setError("Das hat nicht geklappt. Versuch es noch einmal.");
      setPending(false);
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <main id="inhalt" className="onboard">
        <p className="loading">Dein Start wird vorbereitet …</p>
      </main>
    );
  }

  const chosenBelt = BELTS.find((item) => item.id === belt);
  const labels = goalLabels(goals);

  return (
    <main id="inhalt" className="onboard">
      <div className="onboard-shell">
        <Link href="/" className="wordmark">
          JudoNOW
        </Link>
        <ol className="onboard-steps" aria-label="Schritte">
          <li data-active={step === "goals" ? "true" : undefined}>Ziele</li>
          <li data-active={step === "belt" ? "true" : undefined}>Gürtel</li>
          <li data-active={step === "pack" || step === "ready" ? "true" : undefined}>Start</li>
        </ol>

        {step === "goals" && (
          <section className="onboard-panel">
            <p className="eyebrow">Schritt 1</p>
            <h1>Was sind deine Judo-Ziele?</h1>
            <p className="deck">Wähle alles, was für dich zählt. Du kannst später weiter trainieren.</p>
            <div className="goal-grid">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  className="goal"
                  aria-pressed={goals.includes(goal.id)}
                  onClick={() => toggleGoal(goal.id)}
                >
                  {goal.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="cta"
              disabled={pending || goals.length === 0}
              onClick={() => saveAndContinue("belt", { goals })}
            >
              Weiter
            </button>
          </section>
        )}

        {step === "belt" && (
          <section className="onboard-panel">
            <p className="eyebrow">Schritt 2</p>
            <h1>Welchen Gürtel trägst du?</h1>
            <p className="deck">Danach öffnen wir genau die Übungen für deine Farbe.</p>
            <div className="belt-grid onboard-belts">
              {BELTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="belt-card"
                  aria-pressed={belt === item.id}
                  onClick={() => setBelt(item.id)}
                >
                  <BeltCloth belt={item} />
                  <span className="belt-name">{item.name}</span>
                  <span className="belt-kyu">{item.kyu}</span>
                  <span className="belt-line">{item.line}</span>
                </button>
              ))}
            </div>
            <div className="onboard-nav">
              <button type="button" className="text-link" onClick={() => setStep("goals")}>
                Zurück
              </button>
              <button
                type="button"
                className="cta"
                disabled={pending || !belt}
                onClick={() => {
                  if (!belt) return;
                  void saveAndContinue("pack", { goals, belt });
                }}
              >
                Weiter
              </button>
            </div>
          </section>
        )}

        {step === "pack" && chosenBelt && (
          <section className="onboard-panel">
            <p className="eyebrow">Dein Plan</p>
            <h1>Dein JudoNOW ist freigeschaltet</h1>
            <p className="deck">Als wäre dein Trainingspaket gerade freigeschaltet. Alles für deinen Gürtel ist drin.</p>
            <article className="pack-card">
              <p className="pack-label">JudoNOW · persönlicher Plan</p>
              <BeltCloth belt={chosenBelt} />
              <h2>{chosenBelt.name}</h2>
              <p className="pack-kyu">{chosenBelt.kyu}</p>
              <ul>
                {labels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
                <li>Lehrfilme zu den Attacken</li>
                <li>Karteikarten für Namen und Bedeutung</li>
                <li>Abhaken, welche Würfe du schon kannst</li>
              </ul>
            </article>
            <button type="button" className="cta" disabled={pending} onClick={() => setStep("ready")}>
              Weiter
            </button>
          </section>
        )}

        {step === "ready" && (
          <section className="onboard-panel onboard-ready">
            <p className="eyebrow">Geschafft</p>
            <h1>
              Bereit,
              <span className="ready"> Judo-Profi</span> zu werden
            </h1>
            <p className="deck">Dein Gürtel, deine Ziele, deine Übungen. Ab jetzt trainierst du klar und der Reihe nach.</p>
            <button type="button" className="cta" disabled={pending} onClick={() => void finish()}>
              Start now
            </button>
          </section>
        )}

        {error && <p className="lock-note">{error}</p>}
      </div>
    </main>
  );
}
