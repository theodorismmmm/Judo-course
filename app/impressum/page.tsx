import type { Metadata } from "next";
import { Guide } from "@/components/Guide";
import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieter von JudoNOW und Kontakt für das Impressum.",
  alternates: { canonical: "/impressum" },
};

export default function Page() {
  return (
    <Guide
      eyebrow="Anbieter"
      title="Impressum"
      lead="Angaben für diese Website. JudoNOW ist ein Trainingsangebot zum Üben und keine Prüfungsordnung eines Verbands."
    >
      <div className="legal">
        <h2>Anbieter</h2>
        <p>
          {OPERATOR.name}
          <br />
          <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
          <br />
          {OPERATOR.site}
        </p>
        <h2>Inhalt</h2>
        <p>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV ist {OPERATOR.name}, erreichbar über dieselbe E-Mail.</p>
        <h2>Anschrift</h2>
        <p>
          Eine Straße und eine Hausnummer sind in den öffentlichen Angaben zu dieser Seite nicht hinterlegt. Die
          ladungsfähige Anschrift wird an dieser Stelle ergänzt, sobald sie vorliegt. Bis dahin erreichst du den
          Anbieter über die E-Mail.
        </p>
        <h2>Haftung für Links und Filme</h2>
        <p>
          Lehrfilme laufen über YouTube. Für den Inhalt der verlinkten Seiten sind deren Betreiber zuständig. Die
          Techniktexte beschreiben sportliches Üben im Dojo, nicht den medizinischen oder rechtlichen Rat für einen
          einzelnen Fall.
        </p>
      </div>
    </Guide>
  );
}
