import type { Metadata } from "next";
import Link from "next/link";
import { Guide } from "@/components/Guide";
import { LIBRARY } from "@/lib/library";

export const metadata: Metadata = {
  title: "Bibliothek",
  description: "Gürtelweg, Wochenpläne, Prüfung, Glossar und Sicherheit. Die Texte von JudoNOW auf Deutsch.",
  alternates: { canonical: "/bibliothek" },
};

export default function Page() {
  return (
    <Guide
      eyebrow="JudoNOW · Texte"
      title="Bibliothek"
      lead="Texte und Werkzeuge. Die Übungen selbst bleiben unter dem Gürtel, die Filme und die Karten."
    >
      <ul className="library-grid">
        {LIBRARY.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Guide>
  );
}
