import Link from "next/link";

export default function NotFound() {
  return (
    <main id="inhalt" className="chooser">
      <p className="eyebrow">JudoNOW</p>
      <h1>Diese Übung liegt nicht auf der Matte.</h1>
      <p className="deck">Zurück zu den Gürteln, dort sind alle Übungen.</p>
      <p>
        <Link className="cta" href="/ueben">
          Starte jetzt
        </Link>
      </p>
    </main>
  );
}
