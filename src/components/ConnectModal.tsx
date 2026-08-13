"use client";

import { useConnect, useDisconnect, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { clearWagmiStorage } from "@/lib/wagmi";

/* ── Wallet metadata: display name ── */
const WALLET_META: Record<string, { name: string; mobile?: boolean }> = {
  MetaMask: { name: "MetaMask" },
  "Coinbase Wallet": { name: "Coinbase Wallet" },
  WalletConnect: { name: "WalletConnect", mobile: true },
  "OKX Wallet": { name: "OKX Wallet", mobile: true },
  "Bitget Wallet": { name: "Bitget Wallet", mobile: true },
  "TokenPocket": { name: "TokenPocket", mobile: true },
  Injected: { name: "Browser Wallet" },
};

/* Generic letter icon for wallets to ensure they never break */
function WalletIcon({ name }: { name: string }) {
  const styles: Record<string, string> = {
    MetaMask: "bg-[#F6851B] text-white",
    "Coinbase Wallet": "bg-[#0052FF] text-white",
    WalletConnect: "bg-[#3396FF] text-white",
    "OKX Wallet": "bg-black text-white border border-white/20",
    "Bitget Wallet": "bg-[#00F0FF] text-black",
    "TokenPocket": "bg-[#2980B9] text-white",
  };
  const style = styles[name] || "bg-surface-2 text-text border border-border";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`w-7 h-7 rounded-[10px] flex items-center justify-center font-display font-bold text-sm ${style}`}>
      {initial}
    </div>
  );
}

/* Detect if a specific wallet is installed in the browser */
function detectInstalled(connectorName: string): boolean {
  if (typeof window === "undefined") return false;
  const eth = (window as unknown as { ethereum?: { isMetaMask?: boolean; isOKX?: boolean; isBitKeep?: boolean; isTokenPocket?: boolean; providers?: unknown[] } }).ethereum;
  if (!eth) return false;
  switch (connectorName) {
    case "MetaMask": return !!eth.isMetaMask;
    case "OKX Wallet": return !!eth.isOKX;
    case "Bitget Wallet": return !!eth.isBitKeep;
    case "TokenPocket": return !!eth.isTokenPocket;
    default: return false;
  }
}

export default function ConnectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, connector: activeConnector } = useAccount();
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "success") {
      setConnectingId(null);
      onClose();
    }
    if (status === "error") {
      setConnectingId(null);
    }
  }, [status, onClose]);

  if (!open) return null;

  // De-dupe connectors by name (wagmi sometimes returns duplicates)
  const seen = new Set<string>();
  const unique = connectors.filter((c) => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });

  const handleConnect = (connector: typeof connectors[number]) => {
    setConnectingId(connector.uid);
    connect({ connector });
  };

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch {
      /* state cleared below regardless */
    }
    clearWagmiStorage();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet — slides up on mobile, centered modal on desktop */}
      <div className="relative bg-surface border border-border-strong w-full sm:max-w-xs mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border-strong" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 sm:pt-4 border-b border-border">
          <div>
            <p className="text-[10px] text-dim uppercase tracking-widest mb-0.5 font-mono">
              {isConnected ? "CONNECTED" : "CONNECT WALLET"}
            </p>
            <h2 className="font-display text-base text-text">
              {isConnected ? "Your Wallet" : "Choose a wallet"}
            </h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-colors" aria-label="Close">
            ×
          </button>
        </div>

        <div className="px-5 py-3">
          {/* ── CONNECTED STATE ── */}
          {isConnected && address ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border border-accent/20 bg-accent/5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-dim font-mono mb-0.5">{activeConnector?.name}</p>
                  <p className="text-sm text-text font-mono truncate">{address}</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-400 text-muted text-sm transition-colors rounded-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Disconnect
              </button>
            </div>
          ) : (
            /* ── WALLET LIST ── */
            <div className="space-y-2">
              {unique.map((connector) => {
                const meta = WALLET_META[connector.name] || WALLET_META["Injected"];
                const isInstalled = detectInstalled(connector.name);
                const isConnecting = connectingId === connector.uid;

                return (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    disabled={status === "pending"}
                    className="w-full flex items-center gap-3 px-3 py-2.5 border border-border hover:border-accent hover:bg-surface-2 transition-all rounded-xl text-left group disabled:opacity-50"
                  >
                    {/* Icon */}
                    <div className="shrink-0 flex items-center justify-center">
                      <WalletIcon name={connector.name} />
                    </div>

                    {/* Name + status */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text font-medium">{meta.name}</p>
                      <p className="text-[11px] text-dim font-mono">
                        {isConnecting
                          ? "Connecting..."
                          : isInstalled
                          ? "✓ Detected"
                          : meta.mobile
                          ? "Mobile / QR"
                          : "Not installed"}
                      </p>
                    </div>

                    {/* Arrow */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dim group-hover:text-accent transition-colors shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}

              {/* Divider + WalletConnect note */}
              <div className="pt-2 border-t border-border mt-3">
                <p className="text-[11px] text-dim text-center leading-relaxed">
                  WalletConnect supports 300+ mobile wallets via QR code
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {error.message.slice(0, 120)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-0">
          <p className="text-[10px] text-dim text-center leading-relaxed">
            Connecting to BOT Chain (chain 968) · Never share your private key
          </p>
        </div>
      </div>
    </div>
  );
}
