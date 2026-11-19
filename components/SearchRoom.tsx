"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { beltById, categoryById } from "@/lib/belts";
import { searchTechniques } from "@/lib/search";
import { SayAloud } from "./SayAloud";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SearchRoom() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const hits = searchTechniques(query);

  function commit(next: string) {
    setQuery(next);
    const trimmed = next.trim();
    router.replace(trimmed ? `/suche?q=${encodeURIComponent(trimmed)}` : "/suche", { scroll: false });
  }

  return (
    <div className="dojo">
      <SiteHeader />
      <section className="mat" id="inhalt">
        <p className="eyebrow">Alle Gürtel</p>
        <h1>Suche</h1>
        <p className="deck">Tippe einen Teil des Namens. Seoi zeigt jeden Wurf, in dem Seoi steckt.</p>
        <label className="search">
          <span>Technik</span>
          <input
            value={query}
            onChange={(event) => commit(event.target.value)}
            placeholder="Seoi"
            autoComplete="off"
          />
        </label>
        {query.trim().length < 2 ? (
          <p className="known-line">Mindestens zwei Buchstaben, zum Beispiel Seoi oder Gatame.</p>
        ) : hits.length === 0 ? (
          <p className="empty">Nichts zu „{query.trim()}“.</p>
        ) : (
          <ul className="search-hits">
            {hits.map((technique) => {
              const belt = beltById(technique.belt);
              const category = categoryById(technique.category);
              return (
                <li key={technique.slug}>
                  <Link href={`/technik/${technique.slug}`}>
                    <strong>{technique.reading}</strong>
                    <span>
                      {belt?.name} · {category.one}
                      {technique.jp ? ` · ${technique.jp}` : ""}
                    </span>
                  </Link>
                  <SayAloud reading={technique.reading} kanji={technique.kanji} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
