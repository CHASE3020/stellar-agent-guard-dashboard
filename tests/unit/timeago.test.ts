import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatTimeAgo } from "../../lib/guard/time";

describe("formatTimeAgo", () => {
  const fixedNow = 1700000000n; // arbitrary deterministic "now"

  it("returns 'just now' for diff < 10s (boundary at 9s)", () => {
    assert.equal(formatTimeAgo(fixedNow - 0n, fixedNow), "just now");
    assert.equal(formatTimeAgo(fixedNow - 9n, fixedNow), "just now");
  });

  it("returns seconds for diff < 60s (boundary at 10s and 59s)", () => {
    assert.equal(formatTimeAgo(fixedNow - 10n, fixedNow), "10s");
    assert.equal(formatTimeAgo(fixedNow - 59n, fixedNow), "59s");
  });

  it("returns minutes for diff < 60m (boundary at 60s and 3599s)", () => {
    assert.equal(formatTimeAgo(fixedNow - 60n, fixedNow), "1m");
    assert.equal(formatTimeAgo(fixedNow - 119n, fixedNow), "1m");
    assert.equal(formatTimeAgo(fixedNow - 3599n, fixedNow), "59m");
  });

  it("returns hours for diff < 24h (boundary at 3600s and 86399s)", () => {
    assert.equal(formatTimeAgo(fixedNow - 3600n, fixedNow), "1h");
    assert.equal(formatTimeAgo(fixedNow - 7199n, fixedNow), "1h");
    assert.equal(formatTimeAgo(fixedNow - 86399n, fixedNow), "23h");
  });

  it("returns days for diff >= 24h (boundary at 86400s)", () => {
    assert.equal(formatTimeAgo(fixedNow - 86400n, fixedNow), "1d");
    assert.equal(formatTimeAgo(fixedNow - 172800n, fixedNow), "2d");
  });

  it("handles clock skew gracefully by capping at 0s (future timestamps)", () => {
    assert.equal(formatTimeAgo(fixedNow + 10n, fixedNow), "just now");
    assert.equal(formatTimeAgo(fixedNow + 3600n, fixedNow), "just now");
  });

  it("supports number input deterministically", () => {
    const fixedNowNum = 1700000000;
    assert.equal(formatTimeAgo(fixedNowNum - 45, fixedNowNum), "45s");
    assert.equal(formatTimeAgo(fixedNowNum - 4000, fixedNowNum), "1h");
  });
});
