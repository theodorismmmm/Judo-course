import type { Belt } from "@/lib/types";

export function BeltCloth({ belt }: { belt: Belt }) {
  const light = belt.id === "weiss" || belt.id.startsWith("weiss") || belt.id.startsWith("gelb") || belt.id === "orange";
  const background = belt.clothEnd
    ? `linear-gradient(90deg, ${belt.cloth} 50%, ${belt.clothEnd} 50%)`
    : belt.cloth;
  return (
    <span className="cloth" style={{ background }} data-light={light ? "true" : "false"}>
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
