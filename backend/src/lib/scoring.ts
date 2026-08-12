// Pure scoring logic — no chain dependencies, fully unit-testable.
// All inputs are REAL on-chain values passed in by the caller.

export interface ScoreInputs {
  uptimePct: number; // 0-100, from real block production
  nodeType: number; // 0 = GPU, 1 = CPU
  stakeRequired: number; // in BOT (ether units)
  revenueGenerated: number; // in BOT (ether units)
}

export const WEIGHTS = {
  uptime: 0.35,
  hardware: 0.25,
  revenue: 0.2,
  stake: 0.1,
  operator: 0.1,
} as const;

export const MIN_STAKE = 100; // 100 BOT, matches NodeRegistry

export function scoreNode(inputs: ScoreInputs): number {
  const { uptimePct, nodeType, stakeRequired, revenueGenerated } = inputs;

  // Uptime: real (0-100)
  const uptime = Math.max(0, Math.min(100, uptimePct));

  // Hardware: GPU (0) > CPU (1)
  const hardware = nodeType === 0 ? 90 : 60;

  // Stake collateral ratio: stake vs min required.
  // Logarithmic scale: 100 BOT (min) = 20, 1,000 = 60, 10,000+ = 100.
  const stake =
    stakeRequired >= MIN_STAKE
      ? Math.min(100, 20 + Math.log10(stakeRequired / MIN_STAKE) * 20)
      : Math.max(0, (stakeRequired / MIN_STAKE) * 20);

  // Revenue consistency: absolute track record (log scale).
  // 100 BOT revenue = 30, 1,000 = 45, 10,000 = 60, 1M = 90.
  const revenue =
    revenueGenerated > 0
      ? Math.min(100, Math.log10(1 + revenueGenerated) * 15)
      : 0;

  // Operator history: neutral baseline (50). Reduced by slashing events
  // in production (wired to the slashing registry).
  const operator = 50;

  const score =
    uptime * WEIGHTS.uptime +
    hardware * WEIGHTS.hardware +
    revenue * WEIGHTS.revenue +
    stake * WEIGHTS.stake +
    operator * WEIGHTS.operator;

  return Math.floor(score);
}

export function isEligibleForAllocation(score: number): boolean {
  return score >= 80;
}

export function shouldRebalance(
  score: number,
  minScore = 70
): boolean {
  return score < minScore;
}

export function computeUptimeBps(
  blocksProduced: number,
  expectedBlocks: number
): number {
  if (expectedBlocks <= 0) return 0;
  return Math.min(10000, Math.floor((blocksProduced / expectedBlocks) * 10000));
}

export function smoothUptime(
  oldUptimeBps: number,
  newUptimeBps: number,
  factor = 9
): number {
  const smoothed = Math.floor((oldUptimeBps * factor + newUptimeBps) / (factor + 1));
  return Math.min(10000, Math.max(0, smoothed));
}
