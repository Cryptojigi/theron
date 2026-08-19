"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useFundStats, useNodes, usePortfolio } from "@/lib/hooks";
import { useAccount, useBalance, useChainId, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/lib/wagmi";
import { contracts } from "@/lib/contracts";
import { parseEther } from "viem";
import Skeleton from "@/components/Skeleton";

export default function FundPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useFundStats();
  const { data: nodes } = useNodes();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({ address });
  const { data: portfolio } = usePortfolio(address);

  const [action, setAction] = useState<"Deposit" | "Withdraw">("Deposit");
  const [amount, setAmount] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [stepMsg, setStepMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [txError, setTxError] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const activeNodes = nodes?.filter(n => n.active).length || 0;
  const totalNodes = nodes?.length || 0;

  // ── Network + balance guards (block bad txs before the wallet does) ──
  const botBalance = balanceData
    ? Number(balanceData.value) / 10 ** balanceData.decimals
    : 0;
  const trnBalance = Number(portfolio?.balance || 0);
  const isWrongNetwork = isConnected && chainId !== 677;

  const amountNum = Number(amount);
  let guard: string | null = null;
  if (!isConnected) guard = "Connect your wallet first";
  else if (isWrongNetwork)
    guard = `Wrong network: your wallet reports chain ID ${chainId ?? "unknown"} (needs 677)`;
  else if (attempted && (!amount || isNaN(amountNum) || amountNum <= 0))
    guard = "Enter an amount";
  else if (action === "Deposit" && amountNum > botBalance)
    guard = `Insufficient BOT balance: you have ${botBalance.toFixed(4)} BOT`;
  else if (action === "Withdraw" && amountNum > trnBalance)
    guard = `Insufficient TRN balance: you have ${trnBalance.toFixed(4)} TRN`;

  const handleTx = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setAttempted(true);
      return;
    }
    const parsedAmount = parseEther(amount);

    setIsWorking(true);
    setSuccessMsg("");
    setTxError("");
    try {
      if (action === "Deposit") {
        setStepMsg("Depositing BOT...");
        const hash = await writeContractAsync({
          address: contracts.theronFund.address,
          abi: contracts.theronFund.abi,
          functionName: "deposit",
          value: parsedAmount, // Native BOT
        });
        await waitForTransactionReceipt(wagmiConfig, { hash });
      } else {
        setStepMsg("Approving TRN...");
        const approveHash = await writeContractAsync({
          address: contracts.theronToken.address,
          abi: contracts.theronToken.abi,
          functionName: "approve",
          args: [contracts.theronFund.address, parsedAmount],
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });

        setStepMsg("Withdrawing BOT...");
        const withdrawHash = await writeContractAsync({
          address: contracts.theronFund.address,
          abi: contracts.theronFund.abi,
          functionName: "withdraw",
          args: [parsedAmount],
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: withdrawHash });
      }
      setSuccessMsg("Transaction successful!");
      setAmount("");
    } catch (e: any) {
      console.error(e);
      setTxError(e?.shortMessage || e?.message || "Transaction failed");
    } finally {
      setIsWorking(false);
      setStepMsg("");
    }
  };

  // MAX button: fills the input with the full available amount
  // (BOT balance for deposits, TRN balance for withdrawals). Rounds DOWN
  // so it never exceeds the real balance.
  const showMax = inputFocused || amount.trim() !== "";
  const fillMax = () => {
    const max = action === "Deposit" ? botBalance : trnBalance;
    setAmount(String(Math.floor(max * 1e4) / 1e4));
    setAttempted(false);
  };

  return (
    <AppShell>
      <h1 className="font-display text-2xl text-text mb-6">Fund Dashboard</h1>

      {statsError ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-sm">
          Backend offline. Real-time data unavailable.
        </div>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Net Asset Value" value={`${stats?.nav?.toFixed(3) || "1.000"} BOT`} loading={statsLoading} />
        <StatCard label="TVL" value={`${stats?.tvl?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "0"} BOT`} accent loading={statsLoading} />
        <StatCard label="APY" value="n/a" accent loading={statsLoading} />
        <StatCard label="Yield / block" value={`${stats?.yieldPerBlock || 0} BOT`} mono loading={statsLoading} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main panel: deposit/withdraw + allocation */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deposit / Withdraw */}
          <section className="border border-border bg-surface p-6">
            <h2 className="font-display text-lg text-text mb-5">Deposit / Withdraw</h2>
            <div className="flex gap-2 mb-4">
              {(["Deposit", "Withdraw"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setAction(t);
                    setAttempted(false);
                    setAmount(""); // different units per tab (BOT vs TRN), start fresh
                  }}
                  className={`px-4 py-2 text-sm btn border ${
                    action === t
                      ? "bg-accent text-black border-accent"
                      : "border-border text-muted hover:text-text"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {isConnected && (
              <div className="mb-3 text-xs text-dim">
                {action === "Deposit" ? "Balance" : "Your TRN"}:
                <span className="font-mono text-text ml-1">
                  {action === "Deposit"
                    ? `${botBalance.toFixed(4)} BOT`
                    : `${trnBalance.toFixed(4)} TRN`}
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setAttempted(false);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder={action === "Deposit" ? "0.0 BOT" : "0.0 TRN (Shares)"}
                  className="w-full bg-surface-2 border border-border px-4 py-3 pr-14 text-sm text-text placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
                  disabled={isWorking}
                />
                {showMax && (
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      // Fire before the input's blur hides this button (classic
                      // unmount-before-click bug), also keep the input focused.
                      e.preventDefault();
                      fillMax();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-mono text-accent border border-accent/40 hover:bg-accent/10 px-2 py-0.5 rounded transition-colors"
                  >
                    MAX
                  </button>
                )}
              </div>
              <button 
                onClick={handleTx}
                disabled={isWorking || !!guard}
                className="bg-primary text-white px-6 py-3 btn hover:bg-primary-hover transition-colors text-sm whitespace-nowrap disabled:opacity-50"
              >
                {isWorking ? stepMsg : action}
              </button>
            </div>
            {guard && (
              <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {guard}
                {isWrongNetwork && (
                  <button
                    onClick={() => switchChain({ chainId: 677 })}
                    className="mt-2 w-full bg-accent text-black text-xs font-medium px-3 py-2 btn hover:opacity-90 transition-opacity"
                  >
                    Switch to BOT Chain (677)
                  </button>
                )}
              </div>
            )}
            {txError && (
              <div className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {txError}
              </div>
            )}
            <div className="mt-4 text-xs text-dim">
              {action === "Deposit" 
                ? <>You will receive <span className="text-accent font-mono">TRN</span> at current NAV · Estimated gas: ~0.001 BOT</>
                : <>Withdraw <span className="text-accent font-mono">BOT</span> by burning your TRN shares.</>}
            </div>
            {successMsg && <div className="mt-4 text-xs text-accent">{successMsg}</div>}
          </section>

          {/* Allocation chart */}
          <section className="border border-border bg-surface p-6">
            <h2 className="font-display text-lg text-text mb-5">Capital Allocation</h2>
            <div className="space-y-4">
              {[
                { label: "GPU: H100 class", pct: 42, color: "bg-primary" },
                { label: "GPU: A100/L40S", pct: 28, color: "bg-accent" },
                { label: "CPU: EPYC/Xeon", pct: 22, color: "bg-primary/50" },
                { label: "Reserve / USDT", pct: 8, color: "bg-muted/50" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-text font-mono">{row.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-2 overflow-hidden">
                    <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: live yield + quick facts */}
        <div className="space-y-6">
          <div className="border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-text font-medium">Live Yield</h3>
              <span className="text-xs font-mono text-accent flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-accent animate-pulse" /> STREAMING
              </span>
            </div>
            <div className="font-display text-3xl text-accent mb-2">
              {statsLoading ? <Skeleton className="h-8 w-24" /> : `+${stats?.yieldPerBlock || 0} BOT`}
            </div>
            <p className="text-xs text-dim">earned in the last block (0.75s)</p>
            <div className="mt-5 pt-4 border-t border-border space-y-2 text-sm">
              <Row label="Your TRN" value={portfolio?.balance?.toString() || "0.00"} mono />
              <Row label="TRN price" value={stats?.trnPrice ? `$${stats.trnPrice.toFixed(2)}` : "—"} mono />
              <Row label="Value in BOT" value={`${portfolio?.valueInBOT?.toString() || "0.00"} BOT`} accent mono />
            </div>
          </div>

          <div className="border border-border bg-surface p-6">
            <h3 className="text-sm text-text font-medium mb-4">Fund Health</h3>
            <div className="space-y-2 text-sm">
              <Row label="Nodes online" value={`${activeNodes}/${totalNodes}`} />
              <Row label="Avg uptime" value="Real-time" />
              <Row label="Rebalance cycle" value="1 min" />
              <Row label="Protocol fee" value="1%" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, loading, accent, mono }: { label: string; value: string; loading?: boolean; accent?: boolean; mono?: boolean }) {
  return (
    <div className="border border-border bg-surface p-5">
      <div className={`text-xs text-dim mb-1.5 ${mono ? "font-mono" : ""}`}>{label}</div>
      {loading ? (
        <Skeleton className="h-7 w-24" />
      ) : (
        <div className={`font-display text-xl sm:text-2xl ${accent ? "text-accent" : "text-text"}`}>{value}</div>
      )}
    </div>
  );
}

function Row({ label, value, accent, mono }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={`${mono ? "font-mono" : ""} ${accent ? "text-accent" : "text-text"}`}>{value}</span>
    </div>
  );
}
