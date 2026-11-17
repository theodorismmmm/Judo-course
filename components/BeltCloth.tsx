import type { Belt } from "@/lib/types";

export function BeltCloth({ belt }: { belt: Belt }) {
  const light = belt.id === "weiss" || belt.id === "gelb" || belt.id === "orange";
  return (
    <span className="cloth" style={{ backgroundColor: belt.cloth }} data-light={light ? "true" : "false"}>
      <span className="weave" aria-hidden="true" />
      {belt.stripes > 0 && (
        <span className="stripes" aria-hidden="true">
          {Array.from({ length: belt.stripes }, (_, index) => (
            <i key={index} />
          ))}
        </span>
      )}
    </span>
  );
}
