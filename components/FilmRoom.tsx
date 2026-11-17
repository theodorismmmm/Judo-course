"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { beltById } from "@/lib/belts";
import { filmsFor, isFilmSet, type FilmSet } from "@/lib/study";
import { normalize, searchText } from "@/lib/catalog";
import { KnownMark } from "./KnownMark";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const SETS: { id: FilmSet; label: string }[] = [
  { id: "wurf", label: "Würfe" },
  { id: "konter", label: "Konter" },
  { id: "boden", label: "Boden" },
  { id: "alle", label: "Alle Filme" },
];

export function FilmRoom() {
  const params = useSearchParams();
  const router = useRouter();
  const requestedSet = params.get("satz");
  const satz: FilmSet = isFilmSet(requestedSet) ? requestedSet : "wurf";
  const query = params.get("q") ?? "";
  const films = useMemo(() => filmsFor(satz), [satz]);
  const needle = normalize(query);
  const visible = needle ? films.filter((technique) => searchText(technique).includes(needle)) : films;
  const requested = params.get("film");
  const index = Math.max(0, visible.findIndex((technique) => technique.slug === requested));
  const current = visible[index];

  const open = useCallback(
    (nextSatz: FilmSet, slug: string, search = query) => {
      const next = new URLSearchParams();
      next.set("satz", nextSatz);
      if (slug) next.set("film", slug);
      if (search) next.set("q", search);
      router.replace(`/filme?${next.toString()}`, { scroll: false });
    },
    [query, router],
  );

  function step(delta: number) {
    if (!visible.length) return;
    const nextIndex = (index + delta + visible.length) % visible.length;
    open(satz, visible[nextIndex].slug);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (!visible.length) return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + delta + visible.length) % visible.length;
      open(satz, visible[nextIndex].slug);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, open, satz, visible]);

  return (
    <div className="room">
      <SiteHeader />
      <main id="inhalt" className="films">
        <p className="eyebrow">Lehrfilme</p>
        <h1>Attacken</h1>
        <p className="deck">
          Alle Würfe mit Film, die Konter einzeln, und die Bodentechniken. Nächste Attacke geht der Reihe nach weiter.
        </p>
        <div className="chips" role="toolbar" aria-label="Filmliste">
          {SETS.map((set) => (
            <button
              key={set.id}
              type="button"
              aria-pressed={satz === set.id}
              onClick={() => open(set.id, filmsFor(set.id)[0]?.slug ?? "", query)}
            >
              {set.label}
              <span>{filmsFor(set.id).length}</span>
            </button>
          ))}
        </div>
        <label className="search film-search">
          <span>Suche</span>
          <input
            value={query}
            placeholder="O Soto Gari, Konter, Kesa Gatame"
            onChange={(event) => {
              const value = event.target.value;
              const nextNeedle = normalize(value);
              const nextVisible = nextNeedle ? films.filter((technique) => searchText(technique).includes(nextNeedle)) : films;
              const keep = nextVisible.some((technique) => technique.slug === current?.slug)
                ? current?.slug ?? ""
                : nextVisible[0]?.slug ?? "";
              open(satz, keep, value);
            }}
          />
        </label>
        {!current ? (
          <p className="empty">Kein Film für diese Suche.</p>
        ) : (
          <div className="stage">
            <figure className="yt">
              <div className="yt-frame">
                <iframe
                  key={current.youtube}
                  src={`https://www.youtube-nocookie.com/embed/${current.youtube}?rel=0`}
                  title={`${current.reading}: Lehrfilm`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <figcaption>
                Lehrfilm · {current.videoBy} · YouTube · {index + 1} von {visible.length}
              </figcaption>
            </figure>
            <div className="stage-side">
              <p className="eyebrow">{beltById(current.belt)?.name}</p>
              <h2>{current.de}</h2>
              <p className="reading-large">{current.reading}</p>
              <p className="meta">
                <span>{current.jp}</span>
                {current.kanji && <span className="kanji">{current.kanji}</span>}
              </p>
              <p className="principle">{current.principle}</p>
              {current.category === "wurf" && <KnownMark slug={current.slug} />}
              <div className="stage-nav">
                <button type="button" onClick={() => step(-1)}>
                  Vorherige
                </button>
                <button type="button" className="next-attack" onClick={() => step(1)}>
                  Nächste Attacke
                </button>
              </div>
              <ol className="playlist">
                {visible.map((technique, itemIndex) => (
                  <li key={technique.slug}>
                    <button
                      type="button"
                      aria-current={technique.slug === current.slug ? "true" : undefined}
                      onClick={() => open(satz, technique.slug)}
                    >
                      <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                      <span>
                        {technique.de}
                        <small>{technique.reading}</small>
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
