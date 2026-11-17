import assert from "node:assert/strict";
import { createKnownWriter } from "./known-list.ts";

const read = (metadata: unknown) => {
  if (!metadata || typeof metadata !== "object") return [];
  const raw = (metadata as { known?: unknown }).known;
  return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];
};

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

async function settled() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

const writer = createKnownWriter(read);
const metadata = { known: [] as string[] };
const gates: Array<() => void> = [];
const writes: string[][] = [];
const user = {
  id: "judoka",
  unsafeMetadata: metadata,
  updateMetadata: async ({ unsafeMetadata }: { unsafeMetadata: { known: string[] } }) => {
    writes.push([...unsafeMetadata.known]);
    const gate = deferred();
    gates.push(gate.resolve);
    await gate.promise;
  },
};

const first = writer(user, (current) => [...current, "o-goshi"]);
const second = writer(user, (current) => [...current, "o-soto-gari"]);
await settled();
assert.equal(writes.length, 1);
assert.deepEqual(writes[0], ["o-goshi"]);
gates[0]();
await settled();
assert.deepEqual(writes[1], ["o-goshi", "o-soto-gari"]);
gates[1]();
await Promise.all([first, second]);

const failing = createKnownWriter(read);
let calls = 0;
let saved: string[] = [];
const stale = {
  id: "judoka",
  unsafeMetadata: { known: ["kesa-gatame"] },
  updateMetadata: async ({ unsafeMetadata }: { unsafeMetadata: { known: string[] } }) => {
    calls += 1;
    if (calls === 1) throw new Error("network");
    saved = [...unsafeMetadata.known];
  },
};
await failing(stale, (current) => [...current, "yoko-shiho"]).then(
  () => assert.fail("first write should reject"),
  () => undefined,
);
await failing(stale, (current) => [...current, "kami-shiho"]);
assert.deepEqual(saved, ["kesa-gatame", "kami-shiho"]);

const switched = createKnownWriter(read);
const stored = new Map<string, string[]>();
const account = (id: string, known: string[]) => ({
  id,
  unsafeMetadata: { known },
  updateMetadata: async ({ unsafeMetadata }: { unsafeMetadata: { known: string[] } }) => {
    stored.set(id, [...unsafeMetadata.known]);
  },
});
await switched(account("one", ["ippon-seoi"]), (current) => [...current, "tai-otoshi"]);
await switched(account("two", ["juji-gatame"]), (current) => [...current, "ude-garami"]);
assert.deepEqual(stored.get("two"), ["juji-gatame", "ude-garami"]);
