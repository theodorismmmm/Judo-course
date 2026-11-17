import { Suspense } from "react";
import { Dojo } from "@/components/Dojo";

export const metadata = {
  title: "Übungen",
  description: "Gürtel wählen und die Übungen von JudoNOW sofort sehen.",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="loading">Die Matte wird ausgelegt …</p>}>
      <Dojo />
    </Suspense>
  );
}
