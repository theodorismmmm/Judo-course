import assert from "node:assert/strict";
import { searchTechniques } from "./search.ts";

const seoi = searchTechniques("Seoi").map((technique) => technique.slug);
assert.ok(seoi.includes("ippon-seoi-nage"));
assert.ok(seoi.includes("morote-seoi-nage"));
assert.ok(seoi.includes("seoi-otoshi"));
assert.equal(searchTechniques("Se").length > 0, true);
assert.equal(searchTechniques("S").length, 0);
assert.equal(searchTechniques("").length, 0);
