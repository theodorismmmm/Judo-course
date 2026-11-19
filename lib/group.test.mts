import assert from "node:assert/strict";
import { isGroupCode, makeCode, memberProgress, normalizeCode, readGroup } from "./group.ts";

assert.equal(normalizeCode(" ab12 cd "), "AB12CD");
assert.equal(isGroupCode("AB12CD"), false);
assert.equal(isGroupCode("K7MQ2P"), true);
assert.equal(isGroupCode("K7MQ2O"), false);

const code = makeCode(() => 0);
assert.equal(code, "AAAAAA");
assert.equal(isGroupCode(makeCode(() => 0.999)), true);

assert.equal(readGroup({ groupRole: "trainer", groupCode: "k7mq2p", groupName: "  Dojo  Mitte " })?.name, "Dojo Mitte");
assert.equal(readGroup({ groupRole: "gast", groupCode: "K7MQ2P" }), null);
assert.equal(readGroup({ groupRole: "judoka", groupCode: "kurz" }), null);

const member = memberProgress({
  id: "kind",
  name: "  ",
  metadata: {
    belt: "gelb",
    onboarded: true,
    goals: [],
    known: ["ippon-seoi-nage"],
    practice: { points: 10, streak: 2, best: 2, lastDay: "2026-01-01", misses: {}, hits: {}, beltPoints: { gelb: 10 } },
  },
});
assert.equal(member.name, "Judoka");
assert.equal(member.beltName, "Gelbgurt");
assert.equal(member.known, 1);
assert.equal(member.points, 10);
assert.equal(member.openThrows.includes("Ippon Seoi Nage"), false);
assert.equal(member.openThrows.includes("O Soto Gari"), true);
