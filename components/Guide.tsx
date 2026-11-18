import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function Guide({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <main className="guide-shell">
      <SiteHeader />
      <article className="guide" id="inhalt">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
        <p className="guide-back">
          <Link href="/bibliothek">Alle Texte</Link>
          {" · "}
          <Link href="/ueben">Zu den Übungen</Link>
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
