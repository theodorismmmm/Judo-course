import type { Metadata } from "next";
import { Guide } from "@/components/Guide";
import { SAFETY } from "@/lib/library";

export const metadata: Metadata = {
  title: "Sicherheit",
  description: "Ukemi, Abtippen, Klammern ab Gelb und Würgegriffe ab Orange. Was JudoNOW nicht übt.",
  alternates: { canonical: "/sicherheit" },
};

export default function Page() {
  return (
    <Guide
      eyebrow="Matte"
      title="Sicherheit"
      lead="Sportliches Judo. Würfe enden im Ukemi, Hebel und Würgen enden beim Abtippen."
    >
      <div className="safety-list">
        {SAFETY.map((item) => (
          <section key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </section>
        ))}
      </div>
    </Guide>
  );
}
