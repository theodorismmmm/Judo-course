"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AccountSlot } from "./AccountSlot";

const TABS = [
  { href: "/ueben", label: "Übungen", short: "Üben" },
  { href: "/filme", label: "Filme", short: "Filme" },
  { href: "/workout", label: "Workout", short: "Fit" },
  { href: "/karten", label: "Karten", short: "Karten" },
  { href: "/bibliothek", label: "Mehr", short: "Mehr" },
];

const READING = [
  "/bibliothek",
  "/weg",
  "/plan",
  "/glossar",
  "/pruefung",
  "/sicherheit",
  "/uebersicht",
  "/suche",
  "/regeln",
  "/trainer",
  "/impressum",
  "/datenschutz",
];

function current(path: string, href: string) {
  if (href === "/ueben") return path.startsWith("/ueben") || path.startsWith("/technik");
  if (href === "/bibliothek") return READING.some((item) => path === item || path.startsWith(`${item}/`));
  return path === href || path.startsWith(`${href}/`);
}

export function SiteHeader({ trailing }: { trailing?: ReactNode }) {
  const path = usePathname();
  return (
    <>
      <header className="top site-top">
        <Link href="/" className="wordmark brand-mark">
          <img src="/logo.png" alt="" width={28} height={28} className="brand-logo" />
          JudoNOW
        </Link>
        <nav className="tabs desktop-tabs" aria-label="Bereiche">
          {TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} aria-current={current(path, tab.href) ? "page" : undefined}>
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="top-end">
          {trailing}
          <AccountSlot />
        </div>
      </header>
      <nav className="phone-dock" aria-label="Hauptbereiche">
        {TABS.map((tab) => (
          <Link key={tab.href} href={tab.href} aria-current={current(path, tab.href) ? "page" : undefined}>
            {tab.short}
          </Link>
        ))}
      </nav>
    </>
  );
}
