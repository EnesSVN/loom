import test from "node:test";
import assert from "node:assert/strict";
import { version } from "@loom/core";

test("core package is importable via bare specifier", () => {
  assert.equal(version, "0.0.0");
});
