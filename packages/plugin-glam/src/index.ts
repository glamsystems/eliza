import { elizaLogger } from "@ai16z/eliza";
import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    Plugin,
    State,
} from "@ai16z/eliza";
import { exec } from "child_process";

const getVaultBalances: Action = {
    name: "GET_VAULT_BALANCES",
    similes: [
        "VAULT_BALANCES",
        "VAULT_ASSETS",
        "VAULT_TOKENS",
        "VAULT_HOLDINGS",
        "VAULT_PORTFOLIO",
    ],
    description: "Get holdings of a GLAM vault",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        console.log("message", message);
        const dockerCommand = `docker exec dc2c26671358f522df193e96bfb0d570029a267ad03008c277b1ed52bd027869 node /mnt/glam/dist/cli/main.js fund balances`;
        exec(dockerCommand, (error: any, stdout: any, stderr: any) => {
            if (error) {
                elizaLogger.error(`exec error: ${error}`);
                return;
            }
            elizaLogger.log(`stdout: ${stdout}`);
            elizaLogger.error(`stderr: ${stderr}`);
            callback({
                text: stdout,
            });
        });

        const response = "";
        if (response) {
            callback({
                text: response,
            });
        } else {
            elizaLogger.error("failed to get vault balances.");
        }
    },
    examples: [],
} as Action;

export const glamPlugin: Plugin = {
    name: "getVaultBalances",
    description: "Get holdings of a GLAM vault",
    actions: [getVaultBalances],
    evaluators: [],
    providers: [],
};
