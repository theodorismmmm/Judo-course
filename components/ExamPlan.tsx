"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BELTS, isBelt } from "@/lib/belts";
import { getTechnique, techniques } from "@/lib/catalog";
import { buildWeek, daysUntil, phaseFor } from "@/lib/plan-build";
import { readProfile } from "@/lib/profile";
import { weakSlugs } from "@/lib/practice";
import { readKnown } from "@/lib/study";
import type { BeltId } from "@/lib/types";
import { useExamDate } from "./useExamDate";
import { usePractice } from "./usePractice";

export function ExamPlan() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { date, ready, save } = useExamDate();
  const { practice } = usePractice();
  const profileBelt = isLoaded && isSignedIn ? readProfile(user?.unsafeMetadata).belt : null;
  const [beltId, setBeltId] = useState<BeltId>(profileBelt ?? "gelb");

  useEffect(() => {
    if (profileBelt) {
      setBeltId(profileBelt);
      return;
    }
    const saved = window.localStorage.getItem("judonow-gurt");
    if (isBelt(saved)) setBeltId(saved);
  }, [profileBelt]);

  const known = isSignedIn ? readKnown(user?.unsafeMetadata) : [];
  const left = date ? daysUntil(date) : null;
  const phase = left === null ? "weit" : phaseFor(left);
  const plan = buildWeek({
    belt: beltId,
    phase,
    known,
    weak: weakSlugs(practice),
    list: techniques,
  });
  const belt = BELTS.find((item) => item.id === beltId);

  return (
    <section className="plan-card exam-plan" aria-labelledby="countdown-title">
      <h2 id="countdown-title">Bis zur Prüfung</h2>
      <p>Trag das Datum ein. Die drei Einheiten richten sich nach den Tagen, die noch bleiben, und nach deinem Gürtel.</p>
      <form
        className="exam-setup"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const next = String(data.get("datum") ?? "");
          void save(/^\d{4}-\d{2}-\d{2}$/.test(next) ? next : null);
        }}
      >
        <label>
          Gürtel
          <select
            value={beltId}
            onChange={(event) => {
              const next = event.target.value as BeltId;
              setBeltId(next);
              window.localStorage.setItem("judonow-gurt", next);
            }}
          >
            {BELTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Datum
          <input name="datum" type="date" defaultValue={date ?? ""} key={date ?? "leer"} />
        </label>
        <button type="submit" className="cta">
          Plan anpassen
        </button>
        {date && (
          <button type="button" className="text-link" onClick={() => void save(null)}>
            Datum löschen
          </button>
        )}
      </form>
      {!ready ? (
        <p>Datum wird geladen …</p>
      ) : (
        <>
          <p>
            {belt?.name}. {plan.note}
            {left !== null && left >= 0 ? ` Noch ${left} ${left === 1 ? "Tag" : "Tage"}.` : ""}
            {left !== null && left < 0 ? ` Das Datum war vor ${Math.abs(left)} Tagen.` : ""}
          </p>
          {!isSignedIn && <p>Ohne Konto kennt der Plan deine Häkchen nicht. Angemeldet fehlen nur die offenen Würfe.</p>}
          <div className="plan-days">
            {plan.days.map((day) => (
              <div key={day.title}>
                <h3>{day.title}</h3>
                <ul>
                  {day.slugs.map((slug) => {
                    const technique = getTechnique(slug);
                    if (!technique) return null;
                    return (
                      <li key={`${day.title}-${slug}`}>
                        <Link href={`/technik/${slug}`}>{technique.reading}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="known-line">
            Der Probetest liegt unter <Link href={`/pruefung?gurt=${beltId}`}>Prüfung</Link>.
          </p>
        </>
      )}
    </section>
  );
}
