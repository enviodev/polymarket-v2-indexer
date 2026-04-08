import { describe, it } from "vitest";
import { createTestIndexer } from "generated";

describe("PolyUSD", () => {
  it("indexes real PolyUSD events from deployment block", async (t) => {
    // Block 84902320: PolyUSD deployment with initial setup events
    const indexer = createTestIndexer();

    t.expect(
      await indexer.process({
        chains: {
          137: { startBlock: 84_902_320, endBlock: 84_902_320 },
        },
      }),
      "Should index the first PolyUSD events from deployment"
    ).toMatchInlineSnapshot(`
      {
        "changes": [],
      }
    `);
  });

  it("indexes wrap + mint flow via simulate", async (t) => {
    const indexer = createTestIndexer();
    const user = "0x6e0c80c90ea6c15917308f820eac91ce2724b5b5";
    const onramp = "0x93070a847efef7f70739046a929d47a521f5b8ee";
    const usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    const zero = "0x0000000000000000000000000000000000000000";

    t.expect(
      await indexer.process({
        chains: {
          137: {
            simulate: [
              // Mint (Transfer from zero)
              {
                contract: "PolyUSD",
                event: "Transfer",
                params: { from: zero, to: user, amount: 200000000n },
              },
              // Wrapped event
              {
                contract: "PolyUSD",
                event: "Wrapped",
                params: { caller: onramp, asset: usdc, to: user, amount: 200000000n },
              },
            ],
          },
        },
      }),
      "Should track mint + wrap: balance, totalWrapped, and supply stats"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "PolyUSDAccount": {
              "sets": [
                {
                  "balance": 200000000n,
                  "id": "0x6e0c80c90ea6c15917308f820eac91ce2724b5b5",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 200000000n,
                },
              ],
            },
            "PolyUSDStats": {
              "sets": [
                {
                  "id": "polyusd",
                  "totalSupply": 200000000n,
                  "totalTransfers": 1n,
                  "totalUnwrapped": 0n,
                  "totalWrapped": 200000000n,
                },
              ],
            },
            "PolyUSDTransfer": {
              "sets": [
                {
                  "amount": 200000000n,
                  "blockNumber": 84902320,
                  "from": "0x0000000000000000000000000000000000000000",
                  "id": "137_84902320_0",
                  "timestamp": 0,
                  "to": "0x6e0c80c90ea6c15917308f820eac91ce2724b5b5",
                  "transactionHash": "",
                },
              ],
            },
            "PolyUSDWrap": {
              "sets": [
                {
                  "amount": 200000000n,
                  "asset": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                  "blockNumber": 84902320,
                  "caller": "0x93070a847efef7f70739046a929d47a521f5b8ee",
                  "eventType": "wrap",
                  "id": "137_84902320_1",
                  "timestamp": 0,
                  "to": "0x6e0c80c90ea6c15917308f820eac91ce2724b5b5",
                  "transactionHash": "",
                },
              ],
            },
            "block": 84902320,
            "chainId": 137,
            "eventsProcessed": 2,
          },
        ],
      }
    `);

    const account = await indexer.PolyUSDAccount.getOrThrow(user);
    t.expect(account.balance).toBe(200000000n);
    t.expect(account.totalWrapped).toBe(200000000n);

    const stats = await indexer.PolyUSDStats.getOrThrow("polyusd");
    t.expect(stats.totalSupply).toBe(200000000n);
    t.expect(stats.totalWrapped).toBe(200000000n);
    t.expect(stats.totalTransfers).toBe(1n);
  });

  it("indexes unwrap + burn flow via simulate", async (t) => {
    const indexer = createTestIndexer();
    const user = "0xaaaa111111111111111111111111111111111111";
    const adapter = "0xada100874d00e3331d00f2007a9c336a65009718";
    const usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    const zero = "0x0000000000000000000000000000000000000000";

    t.expect(
      await indexer.process({
        chains: {
          137: {
            simulate: [
              // Mint first
              { contract: "PolyUSD", event: "Transfer", params: { from: zero, to: user, amount: 100000000n } },
              // Unwrap
              { contract: "PolyUSD", event: "Unwrapped", params: { caller: adapter, asset: usdc, to: adapter, amount: 50000000n } },
              // Burn (Transfer to zero)
              { contract: "PolyUSD", event: "Transfer", params: { from: user, to: zero, amount: 50000000n } },
            ],
          },
        },
      }),
      "Should track unwrap + burn: decreased balance and supply"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "PolyUSDAccount": {
              "sets": [
                {
                  "balance": 50000000n,
                  "id": "0xaaaa111111111111111111111111111111111111",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": 0n,
                  "id": "0xada100874d00e3331d00f2007a9c336a65009718",
                  "totalUnwrapped": 50000000n,
                  "totalWrapped": 0n,
                },
              ],
            },
            "PolyUSDStats": {
              "sets": [
                {
                  "id": "polyusd",
                  "totalSupply": 50000000n,
                  "totalTransfers": 2n,
                  "totalUnwrapped": 50000000n,
                  "totalWrapped": 0n,
                },
              ],
            },
            "PolyUSDTransfer": {
              "sets": [
                {
                  "amount": 100000000n,
                  "blockNumber": 84902320,
                  "from": "0x0000000000000000000000000000000000000000",
                  "id": "137_84902320_0",
                  "timestamp": 0,
                  "to": "0xaaaa111111111111111111111111111111111111",
                  "transactionHash": "",
                },
                {
                  "amount": 50000000n,
                  "blockNumber": 84902320,
                  "from": "0xaaaa111111111111111111111111111111111111",
                  "id": "137_84902320_2",
                  "timestamp": 0,
                  "to": "0x0000000000000000000000000000000000000000",
                  "transactionHash": "",
                },
              ],
            },
            "PolyUSDWrap": {
              "sets": [
                {
                  "amount": 50000000n,
                  "asset": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                  "blockNumber": 84902320,
                  "caller": "0xada100874d00e3331d00f2007a9c336a65009718",
                  "eventType": "unwrap",
                  "id": "137_84902320_1",
                  "timestamp": 0,
                  "to": "0xada100874d00e3331d00f2007a9c336a65009718",
                  "transactionHash": "",
                },
              ],
            },
            "block": 84902320,
            "chainId": 137,
            "eventsProcessed": 3,
          },
        ],
      }
    `);

    const stats = await indexer.PolyUSDStats.getOrThrow("polyusd");
    t.expect(stats.totalSupply).toBe(50000000n);    // 100M minted - 50M burned
    t.expect(stats.totalUnwrapped).toBe(50000000n);
  });

  it("tracks transfers between accounts", async (t) => {
    const indexer = createTestIndexer();
    const alice = "0xaaaa000000000000000000000000000000000001";
    const bob = "0xbbbb000000000000000000000000000000000002";
    const zero = "0x0000000000000000000000000000000000000000";

    await indexer.process({
      chains: {
        137: {
          simulate: [
            { contract: "PolyUSD", event: "Transfer", params: { from: zero, to: alice, amount: 1000n } },
            { contract: "PolyUSD", event: "Transfer", params: { from: alice, to: bob, amount: 400n } },
          ],
        },
      },
    });

    const aliceAccount = await indexer.PolyUSDAccount.getOrThrow(alice);
    t.expect(aliceAccount.balance).toBe(600n);

    const bobAccount = await indexer.PolyUSDAccount.getOrThrow(bob);
    t.expect(bobAccount.balance).toBe(400n);

    const stats = await indexer.PolyUSDStats.getOrThrow("polyusd");
    t.expect(stats.totalSupply).toBe(1000n);
    t.expect(stats.totalTransfers).toBe(2n);
  });
});
