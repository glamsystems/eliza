export const transferTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested transfer:
- Chain to execute on (like in viem/chains)
- Amount to transfer (only number without coin symbol)
- Recipient address

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "fromChain": SUPPORTED_CHAINS,
    "amount": string,
    "toAddress": string
}
\`\`\`
`;

export const swapTemplate = `Given the recent messages below:

{{recentMessages}}

Here are some tokens' symbols and addresses:
- WSOL: So11111111111111111111111111111111111111112
- SOL: So11111111111111111111111111111111111111112
- USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
- mSOL: mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So
- hSOL: he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A
- JLP: 27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4

Extract the following information about the requested token swap:
- Input token address (the token being sold)
- Output token address (the token being bought)
- Slippage tolerance (convert to basis points if users provide percentage, default to 50)
- Amount to swap (use exact amount user specified, do not use lamports)
- maxAccounts allowed (default to 20)

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "inputToken": string | null,
    "outputToken": string | null,
    "amount": string | null,
    "slippage": number | null,
    "maxAccounts": number | null
}
\`\`\`
`;

export const wrapUnwrapTemplate = `Given the recent messages below:

{{recentMessages}}

Conversion from SOL to wSOL is called wrapping, and from wSOL to SOL is called unwrapping.

Extract the following information about the requested action:
- Direction of the action (wrap or unwrap)
- Amount to wrap (use exact amount user specified, do not use lamports), for unwrap amount is not meaningful and should be null

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "direction": "wrap" | "unwrap",
    "amount": string | null,
}
\`\`\`
`;
