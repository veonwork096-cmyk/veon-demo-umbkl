import { test } from "node:test";
import assert from "node:assert/strict";
import { registryStatus } from "../src/scripts/status.ts";

const at = (h: number, m = 0): number => h * 60 + m;

test("open on a workday between 13:00 and 16:00", () => {
  assert.deepEqual(registryStatus(3, at(13)), { text: "Зараз приймає дзвінки — до 16:00", open: true });
  assert.equal(registryStatus(5, at(15, 59)).open, true);
});
test("before 13:00 on a workday", () => {
  assert.equal(registryStatus(1, at(9, 30)).text, "Дзвінки сьогодні з 13:00 до 16:00");
});
test("after 16:00 Mon–Thu points to tomorrow", () => {
  assert.equal(registryStatus(2, at(16)).text, "Дзвінки завтра з 13:00 до 16:00");
});
test("Friday evening and weekend point to Monday", () => {
  assert.equal(registryStatus(5, at(16, 1)).text, "Дзвінки в понеділок з 13:00 до 16:00");
  assert.equal(registryStatus(6, at(14)).text, "Дзвінки в понеділок з 13:00 до 16:00");
  assert.equal(registryStatus(0, at(14)).open, false);
});
