import { describe, it, expect } from 'vitest';
import {
  scoreNode,
  isEligibleForAllocation,
  shouldRebalance,
  computeUptimeBps,
  smoothUptime,
  WEIGHTS,
} from '../src/lib/scoring';

describe('scoreNode', () => {
  it('scores a strong node high (good uptime, GPU, stake, revenue)', () => {
    const score = scoreNode({
      uptimePct: 99,
      nodeType: 0, // GPU
      stakeRequired: 1000, // 10x min stake
      revenueGenerated: 5000, // strong track record
    });
    // Log scales: strong node lands ~75-80 — clearly above the 70 rebalance floor
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeGreaterThanOrEqual(80 * 0.9);
  });

  it('scores a weak node low (low uptime, CPU, no revenue)', () => {
    const score = scoreNode({
      uptimePct: 60,
      nodeType: 1, // CPU
      stakeRequired: 100, // minimum
      revenueGenerated: 0,
    });
    // 60*0.35 + 60*0.25 + 0*0.2 + 10*0.1 + 50*0.1 = 21+15+0+1+5 = 42
    expect(score).toBeLessThan(50);
  });

  it('score responds to real uptime changes (not constant)', () => {
    const base = { nodeType: 0, stakeRequired: 500, revenueGenerated: 1000 };
    const high = scoreNode({ ...base, uptimePct: 100 });
    const low = scoreNode({ ...base, uptimePct: 50 });
    expect(high).toBeGreaterThan(low);
  });

  it('score responds to real stake changes (not hardcoded)', () => {
    const base = { uptimePct: 95, nodeType: 0, revenueGenerated: 1000 };
    const bigStake = scoreNode({ ...base, stakeRequired: 5000 });
    const minStake = scoreNode({ ...base, stakeRequired: 100 });
    expect(bigStake).toBeGreaterThan(minStake);
  });

  it('score uses the contract-provided minStake', () => {
    const base = { uptimePct: 95, nodeType: 0, revenueGenerated: 1000 };
    // Same absolute stake (10 BOT) scores differently by network minStake:
    const onTestnet = scoreNode({ ...base, stakeRequired: 10 }, 10); // 10 BOT = at minimum
    const onMainnet = scoreNode({ ...base, stakeRequired: 10 }, 0.5); // 10 BOT = 20x minimum
    expect(onMainnet).toBeGreaterThan(onTestnet);
    // A stake exactly at minStake always yields the same baseline score
    expect(scoreNode({ ...base, stakeRequired: 10 }, 10)).toBe(
      scoreNode({ ...base, stakeRequired: 100 }, 100)
    );
  });

  it('score responds to real revenue changes (not hardcoded)', () => {
    const base = { uptimePct: 95, nodeType: 0, stakeRequired: 1000 };
    const rich = scoreNode({ ...base, revenueGenerated: 10000 });
    const poor = scoreNode({ ...base, revenueGenerated: 0 });
    expect(rich).toBeGreaterThan(poor);
  });

  it('clamps scores to 0-100', () => {
    const max = scoreNode({
      uptimePct: 100,
      nodeType: 0,
      stakeRequired: 100000,
      revenueGenerated: 1000000,
    });
    const min = scoreNode({
      uptimePct: 0,
      nodeType: 1,
      stakeRequired: 0,
      revenueGenerated: 0,
    });
    expect(max).toBeLessThanOrEqual(100);
    expect(min).toBeGreaterThanOrEqual(0);
  });

  it('weights sum to 1.0', () => {
    const total = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1.0);
  });
});

describe('isEligibleForAllocation', () => {
  it('allows score >= 80', () => {
    expect(isEligibleForAllocation(80)).toBe(true);
    expect(isEligibleForAllocation(94)).toBe(true);
  });
  it('rejects score < 80', () => {
    expect(isEligibleForAllocation(79)).toBe(false);
    expect(isEligibleForAllocation(42)).toBe(false);
  });
});

describe('shouldRebalance', () => {
  it('triggers below threshold (70)', () => {
    expect(shouldRebalance(69)).toBe(true);
    expect(shouldRebalance(50)).toBe(true);
  });
  it('does not trigger at/above threshold', () => {
    expect(shouldRebalance(70)).toBe(false);
    expect(shouldRebalance(90)).toBe(false);
  });
});

describe('computeUptimeBps', () => {
  it('computes real uptime from block production', () => {
    // 16 blocks produced out of 20 expected = 80% = 8000 bps
    expect(computeUptimeBps(16, 20)).toBe(8000);
    expect(computeUptimeBps(20, 20)).toBe(10000);
    expect(computeUptimeBps(0, 20)).toBe(0);
  });
  it('handles zero expected blocks', () => {
    expect(computeUptimeBps(5, 0)).toBe(0);
  });
  it('caps at 10000 bps', () => {
    expect(computeUptimeBps(25, 20)).toBe(10000);
  });
});

describe('smoothUptime', () => {
  it('blends old and new uptime', () => {
    // old 8000, new 10000, factor 9 → (72000+10000)/10 = 8200
    expect(smoothUptime(8000, 10000)).toBe(8200);
  });
  it('clamps to valid range', () => {
    expect(smoothUptime(9999, 10000)).toBeLessThanOrEqual(10000);
    expect(smoothUptime(0, 0)).toBe(0);
  });
});
