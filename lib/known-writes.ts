import { createKnownWriter } from "./known-list";
import { readKnown } from "./study";

export const updateKnown = createKnownWriter(readKnown);
