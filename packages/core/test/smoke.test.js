import test from "node:test";
import assert from "node:assert/strict";
import { version } from "@loom/core";

test("core paketi bare specifier ile import edilebiliyor", () => {
  assert.equal(version, "0.0.0");
});
