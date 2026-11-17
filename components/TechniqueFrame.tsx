"use client";

import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { beltById, isBelt, isCategory } from "@/lib/belts";
import { techniquesFor } from "@/lib/catalog";
import type { BeltId } from "@/lib/types";
import { SiteHeader } from "./SiteHeader";

type Neighbor = { slug: string; reading: string };

function listQuery(beltId: string, path: boolean, art: string | null) {
  const query = new URLSearchParams();
  query.set("gurt", beltId);
  if (path) query.set("pfad", "bis");
  if (art) query.set("art", art);
  return query.toString();
}

function Shell({
  beltId,
  path,
  art,
  prev,
  next,
  children,
}: {
  beltId: BeltId;
  path: boolean;
  art: string | null;
  prev?: Neighbor;
  next?: Neighbor;
  children: ReactNode;
}) {
  const belt = beltById(beltId)!;
  const query = listQuery(beltId, path, art);
  const href = (slug: string) => `/technik/${slug}?${query}`;

  return (
    <>
      <SiteHeader
        trailing={
          <>
            <span className="quiet-name">{belt.name}</span>
            <Link href={`/ueben?${query}`} className="text-link">
              Alle Übungen
            </Link>
          </>
        }
      />
      {children}
      <nav className="neighbors" aria-label="Weitere Übungen dieser Liste">
        {prev ? (
          <Link href={href(prev.slug)}>
            <span>Vorher</span>
            {prev.reading}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={href(next.slug)}>
            <span>Danach</span>
            {next.reading}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}

function Live({
  slug,
  ownBelt,
  fallbackPrev,
  fallbackNext,
  children,
}: {
  slug: string;
  ownBelt: BeltId;
  fallbackPrev?: Neighbor;
  fallbackNext?: Neighbor;
  children: ReactNode;
}) {
  const params = useSearchParams();
  const requested = params.get("gurt");
  const wantPath = params.get("pfad") === "bis";
  const artParam = params.get("art");
  const art = isCategory(artParam) ? artParam : null;

  let beltId = ownBelt;
  let path = false;
  let keptArt: string | null = null;
  let prev = fallbackPrev;
  let next = fallbackNext;

  if (isBelt(requested)) {
    const scoped = techniquesFor(requested, wantPath ? "path" : "rank");
    if (scoped.some((item) => item.slug === slug)) {
      beltId = requested;
      path = wantPath;
      let list = scoped;
      if (art) {
        const filtered = scoped.filter((item) => item.category === art);
        if (filtered.some((item) => item.slug === slug)) {
          list = filtered;
          keptArt = art;
        }
      }
      const index = list.findIndex((item) => item.slug === slug);
      prev = index > 0 ? { slug: list[index - 1].slug, reading: list[index - 1].reading } : undefined;
      next =
        index >= 0 && index < list.length - 1
          ? { slug: list[index + 1].slug, reading: list[index + 1].reading }
          : undefined;
    }
  }

  return (
    <Shell beltId={beltId} path={path} art={keptArt} prev={prev} next={next}>
      {children}
    </Shell>
  );
}

export function TechniqueFrame({
  slug,
  ownBelt,
  fallbackPrev,
  fallbackNext,
  children,
}: {
  slug: string;
  ownBelt: BeltId;
  fallbackPrev?: Neighbor;
  fallbackNext?: Neighbor;
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <Shell beltId={ownBelt} path={false} art={null} prev={fallbackPrev} next={fallbackNext}>
          {children}
        </Shell>
      }
    >
      <Live slug={slug} ownBelt={ownBelt} fallbackPrev={fallbackPrev} fallbackNext={fallbackNext}>
        {children}
      </Live>
    </Suspense>
  );
}
