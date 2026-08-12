"use client";

import AppShell from "@/components/AppShell";
import { restakeTiers } from "@/lib/data";
import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/lib/wagmi";
import { usePortfolio } from "@/lib/hooks";
import { contracts } from "@/lib/contracts";
import { parseEther } from "viem";

export default function RestakePage() {
  const { address } = useAccount();
  const { data: portfolio } = usePortfolio(address);

  const [selected, setSelected] = useState(0);
  const [amount, setAmount] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [stepMsg, setStepMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Read block constants from contract
  const { data: blocks30 } = useReadContract({
    address: contracts.restaking.address,
    abi: contracts.restaking.abi,
    functionName: "BLOCKS_30D",
  });
  const { data: blocks90 } = useReadContract({
    address: contracts.restaking.address,
    abi: contracts.restaking.abi,
    functionName: "BLOCKS_90D",
  });
  const { data: blocks180 } = useReadContract({
    address: contracts.restaking.address,
    abi: contracts.restaking.abi,
    functionName: "BLOCKS_180D",
  });

  const getLockBlocks = () => {
    if (selected === 0) return blocks30;
    if (selected === 1) return blocks90;
    return blocks180;
  };

  const { writeContractAsync } = useWriteContract();

  const handleRestake = async () => {
    if (!amount || isNaN(Number(amount))) return;
    const blocks = getLockBlocks();
    if (!blocks) return;

    const parsed = parseEther(amount);
    
    setIsWorking(true);
    setSuccessMsg("");
    try {
      setStepMsg("Approving TRN...");
      const approveHash = await writeContractAsync({
        address: contracts.theronToken.address,
        abi: contracts.theronToken.abi,
        functionName: "approve",
        args: [contracts.restaking.address, parsed],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });

      setStepMsg("Restaking TRN...");
      const restakeHash = await writeContractAsync({
        address: contracts.restaking.address,
        abi: contracts.restaking.abi,
        functionName: "restake",
        args: [parsed, blocks],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: restakeHash });
      
      setSuccessMsg("Restake successful!");
      setAmount("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsWorking(false);
      setStepMsg("");
    }
  };

  const handleUnstake = async () => {
    setIsWorking(true);
    setSuccessMsg("");
    try {
      setStepMsg("Unstaking TRN...");
      const hash = await writeContractAsync({
        address: contracts.restaking.address,
        abi: contracts.restaking.abi,
        functionName: "unstake",
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      setSuccessMsg("Unstake successful!");
    } catch (e) {
      console.error(e);
    } finally {
      setIsWorking(false);
      setStepMsg("");
    }
  };

  const tier = restakeTiers[selected];
  // APY is n/a per anti-slop rules
  const baseApy = "n/a";
  const boosted = "n/a";

  return (
    <AppShell>
      <h1 className="font-display text-2xl text-text mb-6">Restaking</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Restake form */}
        <div className="border border-border bg-surface p-6">
          <h2 className="font-display text-lg text-text mb-5">Restake your TRN</h2>

          <div className="mb-5">
            <label className="text-xs text-dim mb-2 block">Amount (TRN)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-surface-2 border border-border px-4 py-3 text-sm text-text placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
              disabled={isWorking}
            />
            <div className="text-xs text-dim mt-1.5">
              Available: {portfolio?.balance?.toLocaleString() || "0"} TRN
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs text-dim mb-2 block">Lock period</label>
            <div className="grid grid-cols-3 gap-2">
              {restakeTiers.map((t, i) => (
                <button
                  key={t.lock}
                  onClick={() => setSelected(i)}
                  className={`border p-3 text-center btn transition-colors ${
                    selected === i
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-border-strong"
                  }`}
                  disabled={isWorking}
                >
                  <div className="text-sm text-text mb-0.5">{t.lock}</div>
                  <div className="text-xs font-mono text-accent">{t.boost}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-border bg-surface-2 p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Base APY</span>
              <span className="text-text font-mono">{baseApy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Boost multiplier</span>
              <span className="text-accent font-mono">{tier.boost}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-text">Boosted APY</span>
              <span className="text-accent font-mono">{boosted}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleRestake}
              disabled={isWorking || !amount}
              className="flex-1 bg-accent text-black font-medium px-6 py-3 btn hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
            >
              {isWorking && stepMsg.includes("Restake") ? stepMsg : "Restake"}
            </button>
            <button 
              onClick={handleUnstake}
              disabled={isWorking}
              className="flex-1 border border-border text-text font-medium px-6 py-3 btn hover:bg-surface-2 transition-colors text-sm disabled:opacity-50"
            >
              {isWorking && stepMsg.includes("Unstake") ? stepMsg : "Unstake"}
            </button>
          </div>
          {isWorking && stepMsg.includes("Approve") && <div className="mt-4 text-xs text-dim">{stepMsg}</div>}
          {successMsg && <div className="mt-4 text-xs text-accent">{successMsg}</div>}
        </div>

        {/* Your positions */}
        <div className="space-y-6">
          <div className="border border-border bg-surface p-6">
            <h2 className="font-display text-lg text-text mb-5">Your Positions</h2>
            <div className="divide-y divide-border">
              <PositionRow 
                label="Base position" 
                value={`${portfolio?.balance?.toLocaleString() || "0"} TRN`} 
                sub="No lock" 
              />
              <PositionRow 
                label="Restaked" 
                value={`${portfolio?.restaked?.toLocaleString() || "0"} TRN`} 
                sub="Boosted yield" 
                accent 
              />
            </div>
          </div>

          <div className="border border-border bg-surface p-6">
            <h2 className="font-display text-lg text-text mb-3">Why restake?</h2>
            <p className="text-sm text-muted leading-relaxed">
              Restaked TRN earns up to 2× the base yield. Your boost applies to new yield instantly —
              compound the machine economy, not just your principal.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function PositionRow({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="py-3.5 flex items-center justify-between">
      <div>
        <div className="text-sm text-text">{label}</div>
        <div className="text-xs text-dim mt-0.5">{sub}</div>
      </div>
      <div className={`font-mono text-sm ${accent ? "text-accent" : "text-text"}`}>{value}</div>
    </div>
  );
}
