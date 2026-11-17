import { FilmRoom } from "@/components/FilmRoom";
import { Suspense } from "react";

export const metadata = {
  title: "Filme",
  description: "Lehrfilme zu den Würfen, Kontern und Bodentechniken. Eine Attacke nach der anderen.",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="loading">Filme werden geladen …</p>}>
      <FilmRoom />
    </Suspense>
  );
}
