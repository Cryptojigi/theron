import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export function useFundStats() {
  return useQuery({
    queryKey: ['fundStats'],
    queryFn: () => api.getFundStats(),
    refetchInterval: 15000,
  });
}

export function useNodes() {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: () => api.getNodes(),
    refetchInterval: 30000,
  });
}

export function useDecisions() {
  return useQuery({
    queryKey: ['decisions'],
    queryFn: () => api.getDecisions(),
    refetchInterval: 15000,
  });
}

export function usePortfolio(address?: string) {
  return useQuery({
    queryKey: ['portfolio', address],
    queryFn: () => (address ? api.getPortfolio(address) : null),
    enabled: !!address, // Only fetch if address is connected
    refetchInterval: 15000,
  });
}
