import assert from "node:assert/strict";
import { buildExam } from "./exam.ts";

const exam = buildExam("gelb", 4);
assert.ok(exam.length >= 3);
assert.ok(exam.length <= 8);
for (const question of exam) {
  assert.equal(question.choices.length, 4);
  assert.equal(new Set(question.choices.map((choice) => choice.slug)).size, 4);
  assert.ok(question.choices.some((choice) => choice.slug === question.slug));
  const reading = question.choices.find((choice) => choice.slug === question.slug)?.reading ?? "";
  assert.equal(question.prompt.toLowerCase().includes(reading.toLowerCase()), false);
}
