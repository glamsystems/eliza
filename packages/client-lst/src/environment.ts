import { IAgentRuntime } from "@ai16z/eliza";
import { z } from "zod";

export const DEFAULT_MAX_TWEET_LENGTH = 280;

export const lstConfigSchema = z.object({});

export type LstConfig = z.infer<typeof lstConfigSchema>;

export async function validateLstConfig(
    runtime: IAgentRuntime
): Promise<LstConfig> {
    return lstConfigSchema.parse({});
}
