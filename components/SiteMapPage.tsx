import Link from "next/link";
import { BELTS, categoryById } from "@/lib/belts";
import { techniques } from "@/lib/catalog";
import { SiteHeader } from "./SiteHeader";

const MAIN = [
  { href: "/", title: "Startseite", text: "Landing mit Login und Einstieg in JudoNOW." },
  { href: "/ueben", title: "Übungen", text: "Gürtel wählen und alle Techniken zum Rang sehen." },
  { href: "/sprechen", title: "Sprechen", text: "Wurf ansehen und den japanischen Namen laut sagen." },
  { href: "/filme", title: "Filme", text: "Lehrfilme und Bewegungsfilme zu den Übungen." },
  { href: "/workout", title: "Workout", text: "Aufwärmen vor dem Judo und allgemeine HIIT-Einheiten." },
  { href: "/karten", title: "Karteikarten", text: "Namen und Beschreibungen zuordnen und abhaken." },
  { href: "/suche", title: "Suche", text: "Techniken über alle Gürtel finden." },
  { href: "/pruefung", title: "Prüfung", text: "Probetest und die Woche vor dem Gürtel." },
  { href: "/plan", title: "Wochenplan", text: "Drei Einheiten, angepasst ans Prüfungsdatum." },
  { href: "/regeln", title: "Wettkampf", text: "Ippon, Waza-ari, Yuko und Shido." },
  { href: "/trainer", title: "Trainer", text: "Dojo-Gruppe und offene Würfe." },
  { href: "/impressum", title: "Impressum", text: "Anbieter und Kontakt." },
  { href: "/datenschutz", title: "Datenschutz", text: "Konto, Mikrofon, Gruppe und Filme." },
];

export function SiteMapPage() {
  const byBelt = BELTS.map((belt) => ({
    belt,
    list: techniques.filter((technique) => technique.belt === belt.id),
  })).filter((entry) => entry.list.length > 0);

  return (
    <main className="shell sitemap-shell">
      <SiteHeader />
      <div className="panel sitemap-panel" id="inhalt">
        <p className="eyebrow">SEO · Orientierung</p>
        <h1>Seitenübersicht</h1>
        <p className="lead">
          Alle wichtigen Bereiche von JudoNOW auf einen Blick — auf Deutsch, plus die Technikseiten nach Gürtel.
        </p>

        <section className="sitemap-block" aria-labelledby="sitemap-main">
          <h2 id="sitemap-main">Hauptbereiche</h2>
          <ul className="sitemap-list">
            {MAIN.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.title}</Link>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="sitemap-block" aria-labelledby="sitemap-belts">
          <h2 id="sitemap-belts">Gürtelpläne</h2>
          <ul className="sitemap-list">
            {BELTS.map((belt) => (
              <li key={belt.id}>
                <Link href={`/ueben?gurt=${belt.id}`}>
                  {belt.name}
                  <span className="sitemap-kyu"> · {belt.kyu}</span>
                </Link>
                <span>{belt.line}</span>
              </li>
            ))}
          </ul>
        </section>

        {byBelt.map(({ belt, list }) => (
          <section key={belt.id} className="sitemap-block" aria-labelledby={`sitemap-${belt.id}`}>
            <h2 id={`sitemap-${belt.id}`}>
              Techniken · {belt.name}
              <span className="sitemap-kyu"> ({belt.kyu})</span>
            </h2>
            <ul className="sitemap-tech">
              {list.map((technique) => (
                <li key={technique.slug}>
                  <Link href={`/technik/${technique.slug}`}>{technique.reading}</Link>
                  <span>
                    {categoryById(technique.category).one}
                    {technique.jp ? ` · ${technique.jp}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="sitemap-xml">
          Für Suchmaschinen gibt es zusätzlich die maschinenlesbare{" "}
          <a href="/sitemap.xml">XML-Sitemap</a> und die Regeln in{" "}
          <a href="/robots.txt">robots.txt</a>.
        </p>
      </div>
    </main>
  );
}
