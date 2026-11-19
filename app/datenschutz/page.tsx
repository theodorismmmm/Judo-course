import type { Metadata } from "next";
import Link from "next/link";
import { Guide } from "@/components/Guide";
import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von JudoNOW: Konto, Übungsstand, Trainergruppe und YouTube.",
  alternates: { canonical: "/datenschutz" },
};

export default function Page() {
  return (
    <Guide
      eyebrow="Deine Daten"
      title="Datenschutz"
      lead="Welche Angaben JudoNOW verarbeitet, warum, und was du dagegen tun kannst."
    >
      <div className="legal">
        <h2>Verantwortlich</h2>
        <p>
          {OPERATOR.name}, <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>. Die Postanschrift steht im{" "}
          <Link href="/impressum">Impressum</Link>, sobald sie hinterlegt ist.
        </p>
        <h2>Konto</h2>
        <p>
          Wenn du dich anmeldest, läuft das über Clerk. Gespeichert werden die Anmeldedaten, die Clerk dafür braucht,
          zum Beispiel E-Mail und Name, dazu in deinem Konto dein Gürtel, deine Ziele, die abgehakten Würfe, XP,
          Serie, das Prüfungsdatum und, falls du einer Gruppe beitrittst, der Gruppencode. Rechtsgrundlage ist der
          Vertrag über das Konto, Art. 6 Abs. 1 lit. b DSGVO. Ohne Konto bleibt der Stand nur auf diesem Gerät.
        </p>
        <p>
          Clerk sitzt in den USA. Für Daten, die das Land verlassen, gelten die von Clerk bereitgestellten
          EU-Standardverträge. Die Datenschutzhinweise von Clerk stehen auf clerk.com.
        </p>
        <h2>Anhören</h2>
        <p>
          Der Button „Anhören“ spricht den japanischen Namen mit der Stimme des Geräts vor. Dafür nimmt die Seite kein
          Mikrofon auf und speichert keine Aufnahme.
        </p>
        <h2>Auf diesem Gerät</h2>
        <p>
          Gürtel, Prüfungsdatum und Übungsstand liegen zusätzlich im lokalen Speicher des Browsers, damit die Seite
          offline weiter weiß, wo du warst. Das löschst du über die Browserdaten dieser Website.
        </p>
        <h2>Trainergruppe</h2>
        <p>
          Wer eine Gruppe anlegt, sieht von beigetretenen Konten den Vornamen, den Gürtel, die Zahl der abgehakten
          Techniken, XP, Serie und bis zu sechs offene Würfe. Keine E-Mail-Adresse. Für Kinder im Verein sollen die
          Eltern das Konto kennen und den Beitritt erlauben. Du kannst die Gruppe jederzeit verlassen. Rechtsgrundlage
          ist deine Einwilligung, Art. 6 Abs. 1 lit. a DSGVO, die du mit dem Beitritt gibst und durch Verlassen
          zurücknimmst.
        </p>
        <h2>Filme</h2>
        <p>
          Lehrfilme sind YouTube-Einbindungen über youtube-nocookie.com. Beim Abspielen kann Google die IP-Adresse und
          Geräteangaben verarbeiten. Solange du den Film nicht startest, bleibt der eingebettete Player auf der
          Technikseite die Verbindung zu YouTube.
        </p>
        <h2>Server</h2>
        <p>
          Der Server, der die Seite ausliefert, sieht beim Aufruf die üblichen Verbindungsdaten, darunter die
          IP-Adresse, damit die Seite ankommt und Missbrauch erkennbar ist. Das ist das berechtigte Interesse am
          Betrieb, Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <h2>Dauer</h2>
        <p>
          Kontodaten bleiben, bis du das Konto löschst oder die Löschung verlangst. Lokale Daten bleiben, bis du sie im
          Browser entfernst. Gruppendaten enden, wenn du die Gruppe verlässt oder entfernt wirst.
        </p>
        <h2>Deine Rechte</h2>
        <p>
          Du kannst Auskunft, Berichtigung, Löschung, Einschränkung und Übertragung verlangen und eine Einwilligung
          zurücknehmen. Eine Beschwerde geht an die Datenschutzaufsicht deines Bundeslands. Schreib dafür an{" "}
          <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>.
        </p>
      </div>
    </Guide>
  );
}
