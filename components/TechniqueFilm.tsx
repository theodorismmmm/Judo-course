"use client";

import { useEffect, useId, useState } from "react";
import { BODY_KEYS, MOTIONS, POSES, type Actor, type Body, type FilmFrame } from "@/lib/motions";
import type { MotionId, Step } from "@/lib/types";

type Drawn = {
  tone: Actor["tone"];
  x: number;
  y: number;
  rot: number;
  body: Body;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number) {
  const delta = ((b - a + 540) % 360) - 180;
  return a + delta * t;
}

function mixBody(a: Body, b: Body, t: number): Body {
  const mixed = {} as Body;
  for (const key of BODY_KEYS) {
    mixed[key] = [lerp(a[key][0], b[key][0], t), lerp(a[key][1], b[key][1], t)];
  }
  return mixed;
}

function ease(t: number) {
  return t * t * (3 - 2 * t);
}

function frameAt(frames: FilmFrame[], progress: number) {
  const max = frames.length - 1;
  const clamped = Math.min(Math.max(progress, 0), max);
  if (clamped >= max) {
    return { from: frames[max], to: frames[max], t: 1, index: max };
  }
  const index = Math.floor(clamped);
  const t = ease(clamped - index);
  return { from: frames[index], to: frames[index + 1], t, index };
}

function drawActor(actor: Actor, other: Actor | undefined, t: number): Drawn {
  const poseA = POSES[actor.pose];
  const poseB = other ? POSES[other.pose] : poseA;
  return {
    tone: actor.tone,
    x: other ? lerp(actor.x, other.x, t) : actor.x,
    y: other ? lerp(actor.y, other.y, t) : actor.y,
    rot: other ? lerpAngle(actor.rot, other.rot, t) : actor.rot,
    body: mixBody(poseA, poseB, other ? t : 0),
  };
}

function Judoka({ actor }: { actor: Drawn }) {
  const gi = actor.tone === "tori" ? "#1b2433" : "#f6f1e6";
  const ink = actor.tone === "tori" ? "#1b2433" : "#2a241c";
  const belt = actor.tone === "tori" ? "#c4452d" : "#1b2433";
  const { body } = actor;
  const shoulderAngle = Math.atan2(body.shoulder[1] - body.hip[1], body.shoulder[0] - body.hip[0]);
  const bx = Math.cos(shoulderAngle + Math.PI / 2) * 16;
  const by = Math.sin(shoulderAngle + Math.PI / 2) * 16;
  const limb = (from: [number, number], mid: [number, number], to: [number, number]) =>
    `M ${from[0]} ${from[1]} L ${mid[0]} ${mid[1]} L ${to[0]} ${to[1]}`;

  return (
    <g transform={`translate(${actor.x} ${actor.y}) rotate(${actor.rot})`}>
      <path d={limb(body.hip, body.kneeA, body.footA)} fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d={limb(body.hip, body.kneeB, body.footB)} fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d={limb(body.shoulder, body.elbowA, body.handA)} fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={limb(body.shoulder, body.elbowB, body.handB)} fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1={body.hip[0]} y1={body.hip[1]} x2={body.shoulder[0]} y2={body.shoulder[1]} stroke={gi} strokeWidth="26" strokeLinecap="round" />
      <line
        x1={body.hip[0]}
        y1={body.hip[1]}
        x2={body.shoulder[0]}
        y2={body.shoulder[1]}
        stroke={actor.tone === "tori" ? "#31415f" : "#e4d9c8"}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={body.hip[0] - bx}
        y1={body.hip[1] - by}
        x2={body.hip[0] + bx}
        y2={body.hip[1] + by}
        stroke={belt}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx={body.head[0]} cy={body.head[1]} r="13" fill={gi} stroke={ink} strokeWidth="2" />
      <circle cx={body.head[0] + 5} cy={body.head[1] + 1} r="1.7" fill={actor.tone === "tori" ? "#f6f1e6" : "#2a241c"} />
    </g>
  );
}

function worldPoint(actor: Drawn, point: [number, number]) {
  const rad = (actor.rot * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [actor.x + point[0] * cos - point[1] * sin, actor.y + point[0] * sin + point[1] * cos] as const;
}

function Scene({
  frames,
  progress,
  mirror,
  patternId,
  legend,
}: {
  frames: FilmFrame[];
  progress: number;
  mirror?: boolean;
  patternId: string;
  legend?: boolean;
}) {
  const { from, to, t } = frameAt(frames, progress);
  const actors = from.actors.map((actor, index) => {
    const drawn = drawActor(actor, to.actors[index], t);
    return mirror ? { ...drawn, x: 640 - drawn.x, rot: -drawn.rot } : drawn;
  });
  const rawArrow = from.arrow && to.arrow
    ? (from.arrow.map((value, index) => lerp(value, to.arrow![index], t)) as [number, number, number, number])
    : t < 0.5
      ? from.arrow
      : to.arrow;
  const arrow = rawArrow && mirror
    ? ([640 - rawArrow[0], rawArrow[1], 640 - rawArrow[2], rawArrow[3]] as [number, number, number, number])
    : rawArrow;
  const note = t > 0.62 ? to.note : from.note;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const include = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };
  for (const actor of actors) {
    for (const key of BODY_KEYS) include(...worldPoint(actor, actor.body[key]));
  }
  if (arrow) {
    include(arrow[0], arrow[1]);
    include(arrow[2], arrow[3]);
  }
  const pad = 54;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;
  let width = Math.max(240, maxX - minX);
  let height = Math.max(160, maxY - minY);
  const ratio = 16 / 10;
  if (width / height > ratio) {
    const next = width / ratio;
    const extra = (next - height) / 2;
    minY -= extra;
    height = next;
  } else {
    const next = height * ratio;
    const extra = (next - width) / 2;
    minX -= extra;
    width = next;
  }

  return (
    <svg viewBox={`${minX} ${minY} ${width} ${height}`} role="img" className="film-svg">
      <defs>
        <pattern id={patternId} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0 H0 V36" fill="none" stroke="#b79a6e" strokeWidth="1.4" />
        </pattern>
        <marker id={`${patternId}-arrow`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L7 3 L0 6 Z" fill="#c4452d" />
        </marker>
      </defs>
      <rect x={minX} y={minY} width={width} height={height} fill="#d9c39a" />
      <rect x={minX} y={minY} width={width} height={height} fill={`url(#${patternId})`} />
      {actors.map((actor, index) => (
        <Judoka key={`${actor.tone}-${index}`} actor={actor} />
      ))}
      {arrow && (
        <line
          x1={arrow[0]}
          y1={arrow[1]}
          x2={arrow[2]}
          y2={arrow[3]}
          stroke="#c4452d"
          strokeWidth="3.5"
          markerEnd={`url(#${patternId}-arrow)`}
        />
      )}
      {legend && (
        <g className="legend" aria-hidden="true">
          <circle cx={minX + 22} cy={minY + 22} r="7" fill="#1b2433" />
          <text x={minX + 36} y={minY + 27} fill="#241c16" fontSize="14" fontFamily="Outfit, sans-serif">
            Tori
          </text>
          <circle cx={minX + 96} cy={minY + 22} r="7" fill="#f6f1e6" stroke="#241c16" />
          <text x={minX + 110} y={minY + 27} fill="#241c16" fontSize="14" fontFamily="Outfit, sans-serif">
            Uke
          </text>
        </g>
      )}
      {note && (
        <g>
          <rect x={minX + width - 132} y={minY + 12} width="116" height="30" rx="15" fill="#c4452d" />
          <text x={minX + width - 74} y={minY + 32} textAnchor="middle" fill="#fffaf5" fontSize="14" fontFamily="Outfit, sans-serif">
            {note}
          </text>
        </g>
      )}
    </svg>
  );
}

export function TechniqueFilm({
  motion,
  steps,
  mirror,
  label,
  mode,
  autoPlay = false,
}: {
  motion: MotionId;
  steps: Step[];
  mirror?: boolean;
  label: string;
  mode: "still" | "player";
  autoPlay?: boolean;
}) {
  const frames = MOTIONS[motion];
  const patternId = useId().replace(/:/g, "");
  const poster = Math.min(2, frames.length - 1);
  const [progress, setProgress] = useState(mode === "still" ? poster : 0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (mode !== "player" || !autoPlay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
  }, [autoPlay, mode]);

  useEffect(() => {
    if (!playing || mode !== "player") return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      setProgress((current) => {
        const next = current + delta / 1100;
        if (next >= frames.length - 1) {
          setPlaying(false);
          return frames.length - 1;
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, frames.length, mode]);

  if (mode === "still") {
    return (
      <div className="film still" aria-hidden="true">
        <Scene frames={frames} progress={poster} mirror={mirror} patternId={patternId} />
      </div>
    );
  }

  const captionIndex = Math.min(frames.length - 1, Math.round(progress));
  const atEnd = progress >= frames.length - 1;

  function toggle() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (atEnd) setProgress(0);
    setPlaying(true);
  }

  return (
    <div
      className="player"
      role="group"
      aria-label={`Bewegungsfilm: ${label}`}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          toggle();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          setPlaying(false);
          setProgress((current) => Math.min(frames.length - 1, Math.round(current) + 1));
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setPlaying(false);
          setProgress((current) => Math.max(0, Math.round(current) - 1));
        }
      }}
    >
      <div className="film">
        <Scene frames={frames} progress={progress} mirror={mirror} patternId={patternId} legend />
      </div>
      <div className="phases">
        <button type="button" className="play" onClick={toggle} aria-pressed={playing}>
          {playing ? "Pause" : atEnd ? "Nochmal" : "Film abspielen"}
        </button>
        <p className="phase-kicker">Bewegungsfilm · {steps[captionIndex]?.phase}</p>
        <p className="phase-caption" aria-live="polite">
          {steps[captionIndex]?.text}
        </p>
        <ol>
          {steps.map((step, index) => (
            <li key={step.phase}>
              <button
                type="button"
                aria-current={index === captionIndex}
                onClick={() => {
                  setPlaying(false);
                  setProgress(index);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step.phase}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
