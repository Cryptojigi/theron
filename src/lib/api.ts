export interface FundStats {
  tvl: number;
  nav: number;
  trnPrice: number;
  apy: number;
  yieldPerBlock: number;
}

export interface TheronNode {
  id: string;
  operator: string;
  uptime: number;
  revenue: number;
  active: boolean;
}

export interface Decision {
  id: number;
  hash: string;
  category: string;
  timestamp: number;
  summary: string;
}

export interface Portfolio {
  address: string;
  balance: number;
  valueInBOT: number;
  restaked: number;
  restakeBoost?: number;
  restakeLocked?: boolean;
  restakeUnlockBlock?: number;
  restakeBoostedValue?: number;
  currentBlock?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetcher<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`API fetch error on ${endpoint}:`, error);
    return null; // Return null on network error, never fake data
  }
}

export const api = {
  getFundStats: () => fetcher<FundStats>('/api/fund/stats'),
  getNodes: () => fetcher<TheronNode[]>('/api/nodes'),
  getDecisions: () => fetcher<Decision[]>('/api/decisions'),
  getPortfolio: (address: string) => fetcher<Portfolio>(`/api/portfolio/${address}`),
};
