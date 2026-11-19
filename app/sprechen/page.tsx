import type { Metadata } from "next";
import { SpeakRoom } from "@/components/SpeakRoom";

export const metadata: Metadata = {
  title: "Sprechen",
  description: "Sieh den YouTube-Lehrfilm und sag den japanischen Namen. Die Lektion fragt nach dem Mikrofon und gibt XP.",
  alternates: { canonical: "/sprechen" },
};

export default function Page() {
  return <SpeakRoom />;
}
