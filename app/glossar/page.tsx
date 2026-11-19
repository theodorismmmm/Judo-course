import type { Metadata } from "next";
import { Guide } from "@/components/Guide";
import { SayAloud } from "@/components/SayAloud";
import { GLOSSARY } from "@/lib/library";

export const metadata: Metadata = {
  title: "Glossar",
  description: "Japanische Judo-Begriffe auf Deutsch erklärt: Rei, Kuzushi, Ukemi, Osaekomi, Shime Waza.",
  alternates: { canonical: "/glossar" },
};

export default function Page() {
  return (
    <Guide
      eyebrow="Wörter auf der Matte"
      title="Glossar"
      lead="Die Techniknamen in JudoNOW bleiben japanisch. Hier steht, was das Wort meint."
    >
      <dl className="gloss-list">
        {GLOSSARY.map((entry) => (
          <div key={entry.term}>
            <dt>
              {entry.term}
              <span>{entry.reading}</span>
              <SayAloud reading={entry.term} kanji={entry.reading} />
            </dt>
            <dd>{entry.text}</dd>
          </div>
        ))}
      </dl>
    </Guide>
  );
}
