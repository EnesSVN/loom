import test from "node:test";
import assert from "node:assert/strict";
import { lis } from "../src/lis.js";

test("lis returns an empty array for an empty input", () => {
  assert.deepEqual(lis([]), []);
});

test("lis returns every index when the input is already increasing", () => {
  assert.deepEqual(lis([0, 1, 2]), [0, 1, 2]);
});

test("lis returns the indices of the longest increasing subsequence", () => {
  assert.deepEqual(lis([0, 2, 3, 1, 4]), [0, 1, 2, 4]);
});

test("lis returns a single index when the input is strictly decreasing", () => {
  assert.equal(lis([2, 1, 0]).length, 1);
});
