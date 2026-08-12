# THERON — The AI Fund Manager

An AI-managed RWA fund on BOT Chain. Money sits idle. Markets are slow. Humans are slower — THERON is an autonomous agent that moves capital into real DePIN infrastructure (GPUs, CPUs, compute nodes) and streams the returns back.

**Core principle: zero simulation.** Every number the agent uses comes from real on-chain state and the live block explorer.

## Live Demo

[BOT Chain testnet (968) — live app](http://145.241.206.217)

## How it works

The agent runs a decision loop every 60 seconds:

```
poll chain → underwrite nodes → allocate capital → rebalance
```

| Agent | Job |
|---|---|
| **Oracle** | Reads real block production from the live explorer, computes real uptime per node, writes it on-chain |
| **Underwriter** | Scores every node using only real on-chain inputs (uptime, hardware type, stake, revenue) and records each decision on-chain |
| **Allocator** | Moves capital to nodes that pass the underwriting threshold |
| **Rebalancer** | Shifts capital from underperforming to top-performing nodes |

Every AI decision (underwrite / allocate / rebalance) is recorded on-chain with its intent hash — a verifiable audit trail of the agent's behavior.

## Repository structure

```
├── contracts/     # 7 Solidity contracts (Foundry) — 61 tests passing
├── backend/       # TypeScript AI agent — Express API + decision loop
└── src/           # Next.js frontend — wagmi wallet connect, live data
```

## Contracts

- `NodeRegistry` — node registration, stake, uptime tracking, revenue reporting
- `TheronFund` — deposit / withdraw (native BOT in, TRN shares out), AI allocation
- `TheronToken` — ERC-4626 vault (WBOT in → TRN out)
- `YieldDistributor` — yield claim engine
- `Restaking` — restake yield for up to 2× boost
- `AISignatureRegistry` — on-chain record of every AI decision
- `EmergencyGuard` — 3-guardian circuit breaker

## Getting started

```bash
# Contracts (Foundry)
cd contracts
forge build
forge test          # 61 tests

# Backend
cd backend
npm ci
# configure your own env (RPC URL, chain id, contract addresses, agent key)
npm run build
npm start

# Frontend
npm ci
# set NEXT_PUBLIC_* env vars (chain id, contract addresses, API URL)
npm run dev
```

## Deployment

Deployed on **BOT Chain testnet (chain 968)**. Deployment records (transactions, addresses) live in `contracts/broadcast/`.
