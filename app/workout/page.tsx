import { Suspense } from "react";
import { WorkoutRoom } from "@/components/WorkoutRoom";

export const metadata = {
  title: "Workout",
  description: "Aufwärmen vor dem Judo, HIIT und eine Auswahl der besten Filme. Mit oder ohne Matte.",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="loading">Workouts werden geladen …</p>}>
      <WorkoutRoom />
    </Suspense>
  );
}
