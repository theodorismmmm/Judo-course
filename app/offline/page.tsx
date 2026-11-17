import Link from "next/link";

export const metadata = { title: "Offline" };

export default function Page() {
  return (
    <main id="inhalt" className="offline-screen">
      <p className="wordmark">JudoNOW</p>
      <h1>Du bist offline</h1>
      <p className="deck">
        Die App-Hülle bleibt. Gespeicherte Seiten und Texte kannst du weiter lesen. YouTube-Filme brauchen wieder
        Netz.
      </p>
      <Link href="/ueben" className="cta">
        Zu den Übungen
      </Link>
    </main>
  );
}
