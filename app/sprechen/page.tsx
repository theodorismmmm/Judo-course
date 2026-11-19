import type { Metadata } from "next";
import { SpeakRoom } from "@/components/SpeakRoom";

export const metadata: Metadata = {
  title: "Sprechen",
  description: "Sieh einen Wurf und sag den japanischen Namen. Die Seite hört zu und lässt ähnliche Schreibweisen gelten.",
  alternates: { canonical: "/sprechen" },
};

export default function Page() {
  return <SpeakRoom />;
}
