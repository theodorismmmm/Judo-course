import { beltById, categoryById } from "@/lib/belts";
import { neighbors } from "@/lib/catalog";
import type { Technique } from "@/lib/types";
import { SiteFooter } from "./SiteFooter";
import { TechniqueFilm } from "./TechniqueFilm";
import { TechniqueFrame } from "./TechniqueFrame";

export function TechniqueArticle({ technique }: { technique: Technique }) {
  const belt = beltById(technique.belt)!;
  const category = categoryById(technique.category);
  const { prev, next } = neighbors(technique);

  return (
    <div className="dojo detail">
      <TechniqueFrame
        slug={technique.slug}
        ownBelt={belt.id}
        fallbackPrev={prev ? { slug: prev.slug, de: prev.de } : undefined}
        fallbackNext={next ? { slug: next.slug, de: next.de } : undefined}
      >
      <article className="technique" id="inhalt">
        <p className="eyebrow">
          {belt.name} · {category.label}
        </p>
        <h1>{technique.de}</h1>
        <p className="reading-large">{technique.reading}</p>
        <p className="jp-line">
          <span>{technique.jp}</span>
          {technique.kanji && <span className="kanji">{technique.kanji}</span>}
          <span>{technique.group}</span>
        </p>
        {technique.safety && <p className="safety">{technique.safety}</p>}
        {technique.youtube && (
          <figure className="yt">
            <div className="yt-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${technique.youtube}?rel=0`}
                title={`${technique.reading}: Lehrfilm`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <figcaption>Lehrfilm · {technique.videoBy} · YouTube</figcaption>
          </figure>
        )}
        <p className="ablauf">Ablauf</p>
        <TechniqueFilm
          motion={technique.motion}
          steps={technique.steps}
          mirror={technique.mirror}
          label={`${technique.de}, ${technique.reading}`}
          mode="player"
        />
        <p className="principle">{technique.principle}</p>
        <div className="notes">
          <section>
            <h2>Darauf achten</h2>
            <ul>
              {technique.cues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Häufig daneben</h2>
            <ul>
              {technique.faults.map((fault) => (
                <li key={fault}>{fault}</li>
              ))}
            </ul>
          </section>
        </div>
      </article>
      </TechniqueFrame>
      <SiteFooter />
    </div>
  );
}
