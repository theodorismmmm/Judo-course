import Link from "next/link";
import { LIBRARY } from "@/lib/library";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Texte">
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        {LIBRARY.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.title}
          </Link>
        ))}
      </nav>
      <p>
        Sportliches Judo fürs Dojo. Würgegriffe und Klammern nur mit qualifizierter Aufsicht, langsam, und nur bis zum
        Abtippen.
      </p>
      <p>Kani-basami, Kawazu-gake und Daki-age sind im Wettkampf verboten und hier keine Übung.</p>
      <p>
        Die Farben folgen der DJB-Reihenfolge von 2024: Weiß, Weiß-Gelb, Gelb, Gelb-Orange, Orange, Orange-Grün,
        Grün, Blau, Braun, dann 1. und 2. Dan. Vereine können die Prüfungsschwerpunkte anders setzen.
      </p>
      <p>Lehrfilme laufen über YouTube. Der gezeichnete Ablauf darunter ist die Schrittfolge, wenn es keinen einzelnen Film gibt.</p>
      <p>Ein Konto merkt sich deine Ziele, deinen Gürtel, deine Häkchen, XP, Serie und das Prüfungsdatum.</p>
      <p>
        <a href="/sitemap.xml">XML-Sitemap</a>
        {" · "}
        <a href="/robots.txt">robots.txt</a>
      </p>
    </footer>
  );
}
