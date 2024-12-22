import {
    composeContext,
    elizaLogger,
    generateObjectDEPRECATED,
    ModelClass,
} from "@ai16z/eliza";
import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    Plugin,
    State,
} from "@ai16z/eliza";
import { exec } from "child_process";
import { swapTemplate, wrapUnwrapTemplate } from "./templates";

interface SwapParams {
    inputToken: string;
    outputToken: string;
    amount: string;
    slippage: number;
    maxAccounts: number;
}

interface WrapUnwrapParams {
    direction: "wrap" | "unwrap";
    amount?: string;
}

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
    validate: async (runtime: IAgentRuntime, message: Memory) =>
        !!runtime.getSetting("GLAM_CLI_CONTAINER_ID"),
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        const GLAM_CLI_CONTAINER_ID = runtime.getSetting(
            "GLAM_CLI_CONTAINER_ID"
        );

        const dockerCommand = `docker exec ${GLAM_CLI_CONTAINER_ID} node /mnt/glam/dist/cli/main.js fund balances`;
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
    },
    examples: [],
} as Action;

const swapTokens: Action = {
    name: "SWAP_TOKENS",
    similes: ["SWAP_TOKENS", "JUPITER_SWAP", "SWAP", "EXCHANGE_TOKENS"],
    description: "Swap tokens held in a GLAM vault via Jupiter",
    validate: async (runtime: IAgentRuntime, message: Memory) =>
        !!runtime.getSetting("GLAM_CLI_CONTAINER_ID"),
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        const context = composeContext({
            state,
            template: swapTemplate,
        });

        const swapParams = (await generateObjectDEPRECATED({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        })) as SwapParams;
        console.log("swapParams", swapParams);

        if (
            !swapParams.inputToken ||
            !swapParams.outputToken ||
            !swapParams.amount
        ) {
            elizaLogger.error("Missing input or output token or amount");
            return;
        }

        const GLAM_CLI_CONTAINER_ID = runtime.getSetting(
            "GLAM_CLI_CONTAINER_ID"
        );
        const dockerCommand = `docker exec ${GLAM_CLI_CONTAINER_ID} node /mnt/glam/dist/cli/main.js fund swap -s ${swapParams.slippage} -m ${swapParams.maxAccounts} ${swapParams.inputToken} ${swapParams.outputToken} ${swapParams.amount} `;
        exec(dockerCommand, (error: any, stdout: any, stderr: any) => {
            if (error) {
                elizaLogger.error(`exec error: ${error}`);
                const accessDeniedError = error
                    .toString()
                    .includes("Error Message: Asset cannot be swapped.");
                callback({
                    text: accessDeniedError
                        ? "Insufficient permissions to swap to output token"
                        : "Failed to swap tokens",
                });
                return;
            }
            elizaLogger.log(`stdout: ${stdout}`);
            elizaLogger.error(`stderr: ${stderr}`);
            callback({
                text: stdout,
            });
        });
    },
    examples: [],
} as Action;

const wrapUnwrap: Action = {
    name: "WRAP_UNWRAP",
    similes: ["WRAP_SOL", "WRAP_TOKEN", "UNWRAP_WSOL", "UNWRAP"],
    description: "Wrap SOL into wSOL (wrapped SOL) or unwrap wSOL into SOL",
    validate: async (runtime: IAgentRuntime, message: Memory) =>
        !!runtime.getSetting("GLAM_CLI_CONTAINER_ID"),
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        const context = composeContext({
            state,
            template: wrapUnwrapTemplate,
        });

        const wrapUnwrapParams = (await generateObjectDEPRECATED({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        })) as WrapUnwrapParams;
        console.log("wrapUnwrapParams", wrapUnwrapParams);

        const GLAM_CLI_CONTAINER_ID = runtime.getSetting(
            "GLAM_CLI_CONTAINER_ID"
        );
        const dockerCommand = `docker exec ${GLAM_CLI_CONTAINER_ID} node /mnt/glam/dist/cli/main.js fund ${wrapUnwrapParams.direction} ${wrapUnwrapParams.direction === "wrap" ? wrapUnwrapParams.amount : ""}`;
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
    },
    examples: [],
} as Action;

export const glamPlugin: Plugin = {
    name: "getVaultBalances",
    description: "Get holdings of a GLAM vault",
    actions: [getVaultBalances, swapTokens, wrapUnwrap],
    evaluators: [],
    providers: [],
};
