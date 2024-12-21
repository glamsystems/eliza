import { IAgentRuntime, Client, elizaLogger } from "@ai16z/eliza";
import { validateLstConfig } from "./environment.ts";

export const LstClientInterface: Client = {
    async start(runtime: IAgentRuntime) {
        await validateLstConfig(runtime);

        elizaLogger.log("LST client started");

        const loop = async () => {
            console.log("LST client running ...");

            setTimeout(() => {
                loop();
            }, 10_000);
        };
        loop();
    },
    async stop(_runtime: IAgentRuntime) {
        elizaLogger.warn("LST client does not support stopping yet");
    },
};

export default LstClientInterface;
