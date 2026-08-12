"use client";

import { useConnect } from "wagmi";
import { useEffect } from "react";

export default function ConnectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { connectors, connect, status } = useConnect();

  useEffect(() => {
    if (status === "success") {
      onClose();
    }
  }, [status, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border-strong w-full max-w-sm mx-4 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-dim uppercase tracking-wider mb-1">Connect</p>
            <h2 className="font-display text-lg text-text">Choose a wallet</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text text-xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="w-full flex items-center gap-3 px-4 py-3.5 border border-border hover:border-accent hover:bg-surface-2 transition-colors text-left disabled:opacity-50"
              disabled={status === "pending"}
            >
              <span className="text-sm text-text">{connector.name}</span>
              <span className="ml-auto text-dim text-xs font-mono">
                {status === "pending" ? "CONNECTING..." : "CONNECT"}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-[11px] text-dim text-center leading-relaxed">
          Connecting to BOT Chain testnet (chain 968). Never share your private key.
        </p>
      </div>
    </div>
  );
}
