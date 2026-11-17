"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BELTS, CATEGORIES, categoryUnlocked, isBelt, isCategory } from "@/lib/belts";
import { countLine, normalize, searchText, techniquesFor } from "@/lib/catalog";
import type { BeltId, CategoryId, Technique } from "@/lib/types";
import { BeltCloth } from "./BeltCloth";
import { KnownMark, useKnown } from "./KnownMark";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { TechniqueFilm } from "./TechniqueFilm";

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

function practiceQuery(beltId: BeltId, scope: "rank" | "path", art: CategoryId | null) {
  const query = new URLSearchParams();
  query.set("gurt", beltId);
  if (scope === "path") query.set("pfad", "bis");
  if (art) query.set("art", art);
  return query.toString();
}

export function Dojo() {
  const params = useSearchParams();
  const router = useRouter();
  const gurt = params.get("gurt");
  const belt = isBelt(gurt) ? BELTS.find((item) => item.id === gurt) : undefined;
  const scope = params.get("pfad") === "bis" ? "path" : "rank";
  const artParam = params.get("art");
  const art = isCategory(artParam) ? artParam : null;
  const [query, setQuery] = useState("");
  const [lockNote, setLockNote] = useState("");

  useEffect(() => {
    if (belt) {
      window.localStorage.setItem("judonow-gurt", belt.id);
      return;
    }
    if (params.get("wahl") === "1") return;
    const saved = window.localStorage.getItem("judonow-gurt");
    if (!isBelt(saved)) return;
    const next = new URLSearchParams(params.toString());
    next.set("gurt", saved);
    router.replace(`/ueben?${next.toString()}`);
  }, [belt, params, router]);

  function write(next: URLSearchParams) {
    const queryString = next.toString();
    router.push(queryString ? `/ueben?${queryString}` : "/ueben");
  }

  function chooseBelt(id: BeltId) {
    window.localStorage.setItem("judonow-gurt", id);
    const next = new URLSearchParams(params.toString());
    next.set("gurt", id);
    next.delete("wahl");
    next.delete("art");
    write(next);
    setQuery("");
    setLockNote("");
  }

  function setScope(nextScope: "rank" | "path") {
    const next = new URLSearchParams(params.toString());
    if (nextScope === "path") next.set("pfad", "bis");
    else next.delete("pfad");
    write(next);
  }

  function setArt(nextArt: CategoryId | null) {
    if (!belt) return;
    if (nextArt && !categoryUnlocked(nextArt, belt.id)) {
      setLockNote(CATEGORIES.find((category) => category.id === nextArt)?.lock ?? "");
      return;
    }
    setLockNote("");
    const next = new URLSearchParams(params.toString());
    if (nextArt) next.set("art", nextArt);
    else next.delete("art");
    write(next);
  }

  const available = useMemo(() => (belt ? techniquesFor(belt.id, scope) : []), [belt, scope]);
  const counts = useMemo(() => countLine(available), [available]);
  const activeArt = art && belt && categoryUnlocked(art, belt.id) ? art : null;
  const needle = normalize(query);
  const visible = available.filter((technique) => {
    if (activeArt && technique.category !== activeArt) return false;
    if (!needle) return true;
    return searchText(technique).includes(needle);
  });

  const { isLoaded: accountLoaded, isSignedIn, known } = useKnown();
  const throwsHere = available.filter((technique) => technique.category === "wurf");
  const knownHere = throwsHere.filter((technique) => known.has(technique.slug)).length;

  const sections = useMemo(() => {
    const grouped: { id: CategoryId; label: string; groups: [string, Technique[]][] }[] = [];
    for (const category of CATEGORIES) {
      const items = visible.filter((technique) => technique.category === category.id);
      if (!items.length) continue;
      const groups = new Map<string, Technique[]>();
      for (const item of items) {
        const list = groups.get(item.group) ?? [];
        list.push(item);
        groups.set(item.group, list);
      }
      grouped.push({ id: category.id, label: category.label, groups: [...groups.entries()] });
    }
    return grouped;
  }, [visible]);

  return (
    <div className="dojo">
      <SiteHeader
        trailing={
          belt ? (
            <Link href="/ueben?wahl=1" className="text-link">
              Gürtel wechseln
            </Link>
          ) : null
        }
      />

      {!belt ? (
        <section className="chooser" id="inhalt">
          <p className="eyebrow">Starte jetzt mit JudoNOW</p>
          <h1>Welchen Gürtel trägst du?</h1>
          <p className="deck">
            Danach stehen die Übungen dieses Gürtels sofort da. Japanische Namen stehen so, wie man sie auf Deutsch
            liest: Kesa Gatame, O Soto Gari, Juji Gatame.
          </p>
          <div className="belt-grid">
            {BELTS.map((item) => {
              const own = techniquesFor(item.id, "rank");
              const line = CATEGORIES.map((category) => {
                const count = own.filter((technique) => technique.category === category.id).length;
                return count ? plural(count, category.one, category.many) : null;
              })
                .filter(Boolean)
                .join(" · ");
              return (
                <button key={item.id} type="button" className="belt-card" onClick={() => chooseBelt(item.id)}>
                  <BeltCloth belt={item} />
                  <span className="belt-name">{item.name}</span>
                  <span className="belt-kyu">{item.kyu}</span>
                  <span className="belt-line">{item.line}</span>
                  <span className="belt-count">{line}</span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mat" id="inhalt">
          <div className="mat-head">
            <div>
              <p className="eyebrow">{belt.kyu}</p>
              <h1>{belt.name}</h1>
              <p className="deck">{belt.line}</p>
              {throwsHere.length > 0 && (
                <p className="known-line">
                  {accountLoaded && isSignedIn
                    ? `${knownHere} von ${throwsHere.length} Würfen hier schon abgehakt.`
                    : "Mit einem Konto hakst du die Würfe ab, die du schon kannst."}
                </p>
              )}
            </div>
            <div className="scope" role="group" aria-label="Umfang">
              <button type="button" aria-pressed={scope === "rank"} onClick={() => setScope("rank")}>
                Dieser Gürtel
              </button>
              <button type="button" aria-pressed={scope === "path"} onClick={() => setScope("path")}>
                Bis hierhin
              </button>
            </div>
          </div>

          <div className="rail" role="list" aria-label="Gürtel">
            {BELTS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className="rail-belt"
                aria-pressed={item.id === belt.id}
                onClick={() => chooseBelt(item.id)}
              >
                <BeltCloth belt={item} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div className="tools">
            <label className="search">
              <span>Suche</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kesa Gatame, Hüftwurf, Würgegriff"
              />
            </label>
            <div className="chips" role="toolbar" aria-label="Art der Übung">
              <button type="button" aria-pressed={!activeArt} onClick={() => setArt(null)}>
                Alle
                <span>{available.length}</span>
              </button>
              {CATEGORIES.map((category) => {
                const count = counts.get(category.id) ?? 0;
                const locked = !categoryUnlocked(category.id, belt.id);
                if (!locked && count === 0) return null;
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={activeArt === category.id}
                    data-locked={locked ? "true" : "false"}
                    onClick={() => setArt(category.id)}
                  >
                    {category.label}
                    <span>{locked ? `ab ${category.fromLabel}` : count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {lockNote && <p className="lock-note">{lockNote}</p>}

          <details className="glossary">
            <summary>Wörter auf der Matte</summary>
            <dl>
              <div>
                <dt>Tori</dt>
                <dd>macht die Technik</dd>
              </div>
              <div>
                <dt>Uke</dt>
                <dd>fällt oder wird gehalten</dd>
              </div>
              <div>
                <dt>Kuzushi</dt>
                <dd>Gleichgewicht brechen</dd>
              </div>
              <div>
                <dt>Tsukuri</dt>
                <dd>in den Wurf eindrehen</dd>
              </div>
              <div>
                <dt>Kake</dt>
                <dd>der Wurf selbst</dd>
              </div>
              <div>
                <dt>Zanshin</dt>
                <dd>danach stehen bleiben</dd>
              </div>
              <div>
                <dt>Ukemi</dt>
                <dd>Fallen ohne Verletzung</dd>
              </div>
              <div>
                <dt>Abtippen</dt>
                <dd>das Stoppsignal</dd>
              </div>
            </dl>
          </details>

          {visible.length === 0 ? (
            <p className="empty">Keine Übung für diese Suche. Ein anderer Name, oder „Alle“.</p>
          ) : (
            <div className="sections">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="section">
                  <h2>
                    {section.label}
                    <small>
                      {section.groups.length === 1
                        ? section.groups[0][0]
                        : section.id === "wurf"
                          ? "Nage-waza"
                          : section.id === "haltegriff"
                            ? "Osaekomi-waza"
                            : section.id === "wuergegriff"
                              ? "Shime-waza"
                              : section.id === "klammer"
                                ? "Armhebel · Kansetsu-waza"
                                : section.id === "entkommen"
                                  ? "Nogare"
                                  : ""}
                    </small>
                  </h2>
                  {section.groups.map(([group, items]) => (
                    <div key={group} className="group">
                      {section.groups.length > 1 && <h3>{group}</h3>}
                      <div className="cards">
                        {items.map((technique, index) => (
                          <article
                            key={technique.slug}
                            className={`card${known.has(technique.slug) ? " is-known" : ""}`}
                          >
                          <Link
                            href={`/technik/${technique.slug}?${practiceQuery(belt.id, scope, activeArt)}`}
                            className="card-link"
                          >
                            {technique.youtube ? (
                              <span className="thumb" aria-hidden="true">
                                <img
                                  src={`https://i.ytimg.com/vi/${technique.youtube}/hqdefault.jpg`}
                                  alt=""
                                  loading="lazy"
                                />
                                <span className="thumb-play">Film</span>
                              </span>
                            ) : (
                              <TechniqueFilm
                                motion={technique.motion}
                                steps={technique.steps}
                                mirror={technique.mirror}
                                label={technique.de}
                                mode="still"
                              />
                            )}
                            <div className="card-body">
                              <p className="card-index">{String(index + 1).padStart(2, "0")}</p>
                              <h4>{technique.de}</h4>
                              <p className="reading">{technique.reading}</p>
                              <p className="meta">
                                <span>{technique.jp}</span>
                                {technique.kanji && <span className="kanji">{technique.kanji}</span>}
                              </p>
                            </div>
                          </Link>
                          {technique.category === "wurf" && <KnownMark slug={technique.slug} />}
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          )}
        </section>
      )}
      <SiteFooter />
    </div>
  );
}
