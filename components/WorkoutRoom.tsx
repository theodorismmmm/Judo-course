"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  MAT_FILTERS,
  WORKOUT_KINDS,
  isWorkoutKind,
  workoutsFor,
  type MatNeed,
  type WorkoutKind,
} from "@/lib/workouts";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function WorkoutRoom() {
  const params = useSearchParams();
  const router = useRouter();
  const requested = params.get("art");
  const kind: WorkoutKind = isWorkoutKind(requested) ? requested : "vor";
  const matParam = params.get("matte");
  const mat: MatNeed | "alle" = MAT_FILTERS.some((item) => item.id === matParam)
    ? (matParam as MatNeed | "alle")
    : "alle";
  const list = useMemo(() => workoutsFor(kind, mat), [kind, mat]);
  const [active, setActive] = useState(list[0]?.id ?? "");
  const current = list.find((item) => item.id === active) ?? list[0];

  useEffect(() => {
    if (!list.some((item) => item.id === active)) setActive(list[0]?.id ?? "");
  }, [active, list]);

  function open(nextKind: WorkoutKind, nextMat: MatNeed | "alle") {
    const next = new URLSearchParams();
    next.set("art", nextKind);
    if (nextMat !== "alle") next.set("matte", nextMat);
    router.replace(`/workout?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="room has-dock">
      <SiteHeader />
      <main id="inhalt" className="films workout-page">
        <p className="eyebrow">Workout</p>
        <h1>Vorm Training und HIIT</h1>
        <p className="deck">
          Wähle, ob du eine Matte hast. Dann laufen die besten Aufwärm- und HIIT-Filme. Meine Wahl zeigt nur die
          stärksten Clips.
        </p>

        <div className="chips" role="toolbar" aria-label="Workout-Art">
          {WORKOUT_KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={kind === item.id}
              onClick={() => open(item.id, mat)}
            >
              {item.label}
              <span>{workoutsFor(item.id, mat).length}</span>
            </button>
          ))}
        </div>

        <div className="chips mat-chips" role="toolbar" aria-label="Matte">
          {MAT_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={mat === item.id}
              onClick={() => open(kind, item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {!current ? (
          <p className="empty">Für diese Auswahl gibt es gerade keinen Film. Wechsle Matte oder Art.</p>
        ) : (
          <div className="stage">
            <figure className="yt">
              <div className="yt-frame">
                <iframe
                  key={current.youtube}
                  src={`https://www.youtube-nocookie.com/embed/${current.youtube}?rel=0`}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <figcaption>
                {current.minutes} Min · {current.by} · YouTube
                {current.mat === "matte" ? " · mit Matte" : current.mat === "ohne" ? " · ohne Matte" : ""}
              </figcaption>
            </figure>
            <div className="stage-side">
              <p className="eyebrow">{kind === "wahl" ? "Meine Wahl" : kind === "hiit" ? "HIIT" : "Vor dem Judo"}</p>
              <h2>{current.title}</h2>
              <p className="principle">{current.blurb}</p>
              <p className="offline-note">Offline siehst du die Liste. Der Film selbst braucht Netz.</p>
              <ol className="playlist">
                {list.map((workout, index) => (
                  <li key={workout.id}>
                    <button
                      type="button"
                      aria-current={workout.id === current.id ? "true" : undefined}
                      onClick={() => setActive(workout.id)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        {workout.title}
                        <small>
                          {workout.minutes} Min · {workout.by}
                        </small>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
