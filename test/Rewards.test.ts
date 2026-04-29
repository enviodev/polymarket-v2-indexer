import { describe, it } from "vitest";
import { createTestIndexer } from "generated";

describe("Rewards", () => {
  it("indexes MarketCreated + Sponsored via simulate", async (t) => {
    const indexer = createTestIndexer();
    const marketId = "0xaaaa000000000000000000000000000000000000000000000000000000000001";

    t.expect(
      await indexer.process({
        chains: {
          137: {
            simulate: [
              {
                contract: "Rewards",
                event: "MarketCreated",
                params: {
                  marketId,
                  startTime: 1700000000n,
                  minSponsorDuration: 86400n,
                  minSponsorAmount: 1000000n,
                  marketData: "0x746573746d61726b6574",
                },
              },
              {
                contract: "Rewards",
                event: "Sponsored",
                params: {
                  marketId,
                  sponsor: "0x1111111111111111111111111111111111111111",
                  amount: 5000000n,
                  startTime: 1700000000n,
                  endTime: 1700086400n,
                  ratePerMinute: 3472n,
                },
              },
            ],
          },
        },
      }),
      "Should create SponsoredMarket and Sponsorship entities"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "SponsoredMarket": {
              "sets": [
                {
                  "closed": false,
                  "closedAt": undefined,
                  "createdAt": 0,
                  "createdAtBlock": 84902320,
                  "id": "0xaaaa000000000000000000000000000000000000000000000000000000000001",
                  "marketData": "0x746573746d61726b6574",
                  "minSponsorAmount": 1000000n,
                  "minSponsorDuration": 86400,
                  "startTime": 1700000000,
                },
              ],
            },
            "Sponsorship": {
              "sets": [
                {
                  "amount": 5000000n,
                  "blockNumber": 84902320,
                  "consumedAmount": undefined,
                  "endTime": 1700086400,
                  "id": "137_84902320_1",
                  "isEarlyWithdraw": undefined,
                  "market_id": "0xaaaa000000000000000000000000000000000000000000000000000000000001",
                  "ratePerMinute": 3472n,
                  "returnedAmount": undefined,
                  "sponsor": "0x1111111111111111111111111111111111111111",
                  "startTime": 1700000000,
                  "timestamp": 0,
                  "withdrawn": false,
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

    const market = await indexer.SponsoredMarket.getOrThrow(marketId);
    t.expect(market.closed).toBe(false);
    t.expect(market.minSponsorDuration).toBe(86400);
  });

  it("indexes Withdrawn and updates Sponsorship totals", async (t) => {
    const indexer = createTestIndexer();
    const marketId = "0xdddd000000000000000000000000000000000000000000000000000000000001";

    await indexer.process({
      chains: {
        137: {
          simulate: [
            {
              contract: "Rewards",
              event: "MarketCreated",
              params: {
                marketId,
                startTime: 1700000000n,
                minSponsorDuration: 86400n,
                minSponsorAmount: 1000000n,
                marketData: "0x",
              },
            },
            {
              contract: "Rewards",
              event: "Sponsored",
              params: {
                marketId,
                sponsor: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                amount: 5000000n,
                startTime: 1700000000n,
                endTime: 1700086400n,
                ratePerMinute: 3472n,
              },
            },
            {
              contract: "Rewards",
              event: "Withdrawn",
              params: {
                marketId,
                sponsor: "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
                returnedAmount: 1000000n,
                consumedAmount: 900000n,
                isEarlyWithdraw: true,
              },
            },
          ],
        },
      },
    });

    const spId = "137_84902320_1";
    const sponsorship = await indexer.Sponsorship.getOrThrow(spId);
    t.expect(sponsorship.withdrawn).toBe(true);
    t.expect(sponsorship.returnedAmount).toBe(1000000n);
    t.expect(sponsorship.consumedAmount).toBe(900000n);
    t.expect(sponsorship.isEarlyWithdraw).toBe(true);
  });

  it("indexes MarketClosed via simulate", async (t) => {
    const indexer = createTestIndexer();
    const marketId = "0xbbbb000000000000000000000000000000000000000000000000000000000001";

    t.expect(
      await indexer.process({
        chains: {
          137: {
            simulate: [
              {
                contract: "Rewards",
                event: "MarketCreated",
                params: {
                  marketId,
                  startTime: 1700000000n,
                  minSponsorDuration: 3600n,
                  minSponsorAmount: 100000n,
                  marketData: "0x",
                },
              },
              {
                contract: "Rewards",
                event: "MarketClosed",
                params: { marketId, closedAt: 1700100000n },
              },
            ],
          },
        },
      }),
      "Should update SponsoredMarket to closed"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "SponsoredMarket": {
              "sets": [
                {
                  "closed": true,
                  "closedAt": 1700100000,
                  "createdAt": 0,
                  "createdAtBlock": 84902320,
                  "id": "0xbbbb000000000000000000000000000000000000000000000000000000000001",
                  "marketData": "0x",
                  "minSponsorAmount": 100000n,
                  "minSponsorDuration": 3600,
                  "startTime": 1700000000,
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

    const market = await indexer.SponsoredMarket.getOrThrow(marketId);
    t.expect(market.closed).toBe(true);
    t.expect(market.closedAt).toBe(1700100000);
  });

  it("indexes DistributedRewards via simulate", async (t) => {
    const indexer = createTestIndexer();

    t.expect(
      await indexer.process({
        chains: {
          137: {
            simulate: [
              {
                contract: "Rewards",
                event: "DistributedRewards",
                params: {
                  user: "0x5555555555555555555555555555555555555555",
                  amount: 250000n,
                },
              },
            ],
          },
        },
      }),
      "Should create a RewardDistribution entity"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "RewardDistribution": {
              "sets": [
                {
                  "amount": 250000n,
                  "blockNumber": 84902320,
                  "id": "137_84902320_0",
                  "timestamp": 0,
                  "transactionHash": "",
                  "user": "0x5555555555555555555555555555555555555555",
                },
              ],
            },
            "block": 84902320,
            "chainId": 137,
            "eventsProcessed": 1,
          },
        ],
      }
    `);
  });
});
