"use client";

import Link from "next/link";
import { BELTS } from "@/lib/belts";
import { levelFor, streakLabel } from "@/lib/practice";
import { usePractice } from "./usePractice";

export function PracticeMeter({ redirect = "/sprechen" }: { redirect?: string }) {
  const { practice, ready, isSignedIn } = usePractice();
  if (!ready) return <p className="stat-row">Punkte werden geladen …</p>;
  const levels = BELTS.filter((belt) => (practice.beltPoints[belt.id] ?? 0) > 0);
  return (
    <div className="stat-block">
      <p className="stat-row">
        <span>{practice.points} Punkte</span>
        <span>{streakLabel(practice)}</span>
        {practice.best > practice.streak && <span>Bestserie {practice.best}</span>}
      </p>
      {levels.length > 0 && (
        <ul className="level-row">
          {levels.map((belt) => (
            <li key={belt.id}>
              {belt.name} · Level {levelFor(practice.beltPoints[belt.id] ?? 0)}
            </li>
          ))}
        </ul>
      )}
      {!isSignedIn && (
        <p className="known-line">
          <Link href={`/sign-in?redirect_url=${encodeURIComponent(redirect)}`}>Anmelden</Link>, dann ist der Stand auch
          auf dem anderen Handy da.
        </p>
      )}
    </div>
  );
}
