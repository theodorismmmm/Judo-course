import type { Metadata } from "next";
import Link from "next/link";
import { Guide } from "@/components/Guide";
import { BELTS, CATEGORIES } from "@/lib/belts";
import { techniques } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Gürtelweg",
  description: "Der JudoNOW-Gürtelweg von Weiß bis 2. Dan, mit den japanischen Techniknamen je Rang.",
  alternates: { canonical: "/weg" },
};

export default function Page() {
  return (
    <Guide
      eyebrow="Von Weiß bis 2. Dan"
      title="Gürtelweg"
      lead="Jeder Rang hat seine eigenen Übungen. Gelb ist nicht Gelb-Orange. Die Namen stehen so, wie man sie auf der Matte sagt."
    >
      <ol className="path-list">
        {BELTS.map((belt) => {
          const own = techniques.filter((technique) => technique.belt === belt.id);
          return (
            <li key={belt.id} className="path-rank">
              <header>
                <p className="eyebrow">{belt.kyu}</p>
                <h2>
                  <Link href={`/ueben?gurt=${belt.id}`}>{belt.name}</Link>
                </h2>
                <p>{belt.line}</p>
              </header>
              {CATEGORIES.map((category) => {
                const list = own.filter((technique) => technique.category === category.id);
                if (!list.length) return null;
                return (
                  <div key={category.id} className="path-group">
                    <h3>
                      {category.label}
                      <small>{list.length}</small>
                    </h3>
                    <ul>
                      {list.map((technique) => (
                        <li key={technique.slug}>
                          <Link href={`/technik/${technique.slug}`}>{technique.reading}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </li>
          );
        })}
      </ol>
    </Guide>
  );
}
