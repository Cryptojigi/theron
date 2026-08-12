import { OracleService } from './services/oracle';
import { UnderwriterAgent } from './agents/underwriter';
import { AllocatorAgent } from './agents/allocator';
import { RebalancerAgent } from './agents/rebalancer';
import { startApi } from './services/api';

async function main() {
    console.log("Starting Theron AI Agent Backend...");
    
    startApi();

    const oracle = new OracleService();
    const underwriter = new UnderwriterAgent();
    const allocator = new AllocatorAgent();
    const rebalancer = new RebalancerAgent();

    // The core loop
    setInterval(async () => {
        console.log("\n--- Starting Decision Loop ---");
        try {
            await oracle.pollAndReport();
            
            const scores = await underwriter.evaluateNodes();
            
            await allocator.allocate(scores);
            
            await rebalancer.checkAndRebalance(scores);
        } catch (e: any) {
            console.error("Loop error:", e.message);
        }
    }, 60000); // run every 60s
}

main();
