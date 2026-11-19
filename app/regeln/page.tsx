import type { Metadata } from "next";
import { Guide } from "@/components/Guide";

export const metadata: Metadata = {
  title: "Wettkampf",
  description: "Was Ippon, Waza-ari, Yuko und Shido im Judo-Wettkampf bedeuten. Kurz, nach den IJF-Regeln von 2025.",
  alternates: { canonical: "/regeln" },
};

const SCORES = [
  {
    title: "Ippon",
    text: "Der Kampf ist aus. Ippon gibt es für einen kontrollierten Wurf auf den Rücken, für 20 Sekunden Halten, für Aufgabe durch Abtippen oder Maitta, oder wenn jemand das Bewusstsein verliert. Zwei Waza-ari werden zu Ippon gesagt: Waza-ari-awasete-ippon. Eine Disqualifikation des anderen zählt ebenso als Sieg.",
  },
  {
    title: "Waza-ari",
    text: "Fast ein Ippon. Die Landung geht über die Schulterachse hinaus, liegt aber nicht klar auf dem Rücken, oder Kraft, Tempo und Kontrolle sind nicht alle da. Am Boden sind es 10 bis 19 Sekunden Halten. Ein zweites Waza-ari beendet den Kampf.",
  },
  {
    title: "Yuko",
    text: "Der kleinere Wert seit den IJF-Regeln 2025: Landung auf die Seite, auf das Gesäß oder auf den oberen Rücken, und 5 bis 9 Sekunden Halten. Mehrere Yuko werden nicht zu einem Waza-ari addiert. In der Verlängerung reicht schon ein Yuko.",
  },
  {
    title: "Shido",
    text: "Eine Verwarnung für kleine Verstöße: Passivität, eine unerlaubte kleine Aktion, unordentliche Jacke oder Haare. Ein Shido gibt der anderen Person keine Punkte. Zwei Shido sind Verwarnungen. Das dritte ist Hansoku-make, der Kampf ist verloren. Gefährliche Aktionen, zum Beispiel ein Kopfsprung, können sofort Hansoku-make sein.",
  },
];

export default function Page() {
  return (
    <Guide
      eyebrow="Wörter vom Kampf"
      title="Wettkampf"
      lead="Ippon, Waza-ari und Shido hörst du in der Halle. Das hier ist die kurze Bedeutung nach den IJF-Wettkampfregeln, Stand 2025. Die Gürtelprüfung im Verein ist kein Turnier, und der Verband kann nachziehen."
    >
      <div className="safety-list">
        {SCORES.map((item) => (
          <section key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </section>
        ))}
      </div>
      <p className="guide-note">
        Kani-basami, Kawazu-gake und Daki-age bleiben verboten und sind in JudoNOW keine Übung. Im Dojo beendet Abtippen
        jede Klammer und jeden Würgegriff sofort.
      </p>
    </Guide>
  );
}
