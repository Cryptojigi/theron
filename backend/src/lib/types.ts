// Shared types for contract read results (viem JSON ABIs return unknown
// for struct returns — these interfaces restore type safety).

export interface TheronNode {
  operator: `0x${string}`;
  hardwareSpecsURI: string;
  nodeType: number;
  stakeRequired: bigint;
  registeredAt: bigint;
  lastVerifiedAt: bigint;
  uptimePercentage: bigint;
  revenueGenerated: bigint;
  active: boolean;
}
