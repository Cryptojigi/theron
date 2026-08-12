import theronFundAbi from '../abi/TheronFund.json';
import theronTokenAbi from '../abi/TheronToken.json';
import restakingAbi from '../abi/Restaking.json';
import nodeRegistryAbi from '../abi/NodeRegistry.json';
import aiSignatureRegistryAbi from '../abi/AISignatureRegistry.json';

export const contracts = {
  theronFund: {
    address: (process.env.NEXT_PUBLIC_THERON_FUND_ADDRESS || '0x') as `0x${string}`,
    abi: theronFundAbi.abi,
  },
  theronToken: {
    address: (process.env.NEXT_PUBLIC_THERON_TOKEN_ADDRESS || '0x') as `0x${string}`,
    abi: theronTokenAbi.abi,
  },
  restaking: {
    address: (process.env.NEXT_PUBLIC_RESTAKING_ADDRESS || '0x') as `0x${string}`,
    abi: restakingAbi.abi,
  },
  nodeRegistry: {
    address: (process.env.NEXT_PUBLIC_NODE_REGISTRY_ADDRESS || '0x') as `0x${string}`,
    abi: nodeRegistryAbi.abi,
  },
  aiSignatureRegistry: {
    address: (process.env.NEXT_PUBLIC_AI_SIGNATURE_REGISTRY_ADDRESS || '0x') as `0x${string}`,
    abi: aiSignatureRegistryAbi.abi,
  },
};
