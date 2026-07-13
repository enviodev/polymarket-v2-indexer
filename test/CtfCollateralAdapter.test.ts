import { describe, it } from "vitest";
import { createTestIndexer } from "envio";

const ADAPTER =
  "0xada100874d00e3331d00f2007a9c336a65009718" as `0x${string}`;
const NEG_RISK_ADAPTER =
  "0xada200001000ef00d07553cee7006808f895c6f1" as `0x${string}`;
const USER = "0x1111111111111111111111111111111111111111" as `0x${string}`;
const PUSD = "0xc011a7e12a19f7b1f670d46f03b03f3342e82dfb" as `0x${string}`;
const USDC = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174" as `0x${string}`;
const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const CONDITION_ID =
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";

describe("CtfCollateralAdapter", () => {
  it("records splits, merges, redemptions and accumulates stats", async (t) => {
    const indexer = createTestIndexer();

    await indexer.process({
      chains: {
        137: {
          simulate: [
            {
              contract: "CtfCollateralAdapter",
              srcAddress: ADAPTER,
              event: "PositionSplit",
              params: {
                stakeholder: USER,
                collateralToken: USDC,
                parentCollectionId: ZERO_BYTES32,
                conditionId: CONDITION_ID,
                partition: [1n, 2n],
                amount: 5_000_000n,
              },
            },
            {
              contract: "CtfCollateralAdapter",
              srcAddress: ADAPTER,
              event: "PositionsMerge",
              params: {
                stakeholder: USER,
                collateralToken: USDC,
                parentCollectionId: ZERO_BYTES32,
                conditionId: CONDITION_ID,
                partition: [1n, 2n],
                amount: 2_000_000n,
              },
            },
            {
              contract: "CtfCollateralAdapter",
              srcAddress: ADAPTER,
              event: "PayoutRedemption",
              params: {
                redeemer: USER,
                collateralToken: USDC,
                parentCollectionId: ZERO_BYTES32,
                conditionId: CONDITION_ID,
                indexSets: [1n, 2n],
                payout: 3_000_000n,
              },
            },
          ],
        },
      },
    });

    const splits = await indexer.CtfSplit.getAll();
    t.expect(splits.length).toBe(1);
    t.expect(splits[0]!.amount).toBe(5_000_000n);
    t.expect(splits[0]!.isNegRisk).toBe(false);

    const merges = await indexer.CtfMerge.getAll();
    t.expect(merges.length).toBe(1);

    const redemptions = await indexer.CtfRedemption.getAll();
    t.expect(redemptions.length).toBe(1);
    t.expect(redemptions[0]!.payout).toBe(3_000_000n);

    const stats = await indexer.CtfAdapterStats.getAll();
    t.expect(stats.length).toBe(1);
    t.expect(stats[0]!.totalSplits).toBe(1n);
    t.expect(stats[0]!.totalMerges).toBe(1n);
    t.expect(stats[0]!.totalRedemptions).toBe(1n);
    t.expect(stats[0]!.totalSplitVolume).toBe(5_000_000n);
    t.expect(stats[0]!.totalMergeVolume).toBe(2_000_000n);
    t.expect(stats[0]!.totalRedemptionPayout).toBe(3_000_000n);
  });

  it("records neg-risk wrap/unwrap as PolyUSDWrap rows with distinct eventType", async (t) => {
    const indexer = createTestIndexer();

    await indexer.process({
      chains: {
        137: {
          simulate: [
            {
              contract: "NegRiskCtfCollateralAdapter",
              srcAddress: NEG_RISK_ADAPTER,
              event: "Wrapped",
              params: { caller: USER, asset: PUSD, to: USER, amount: 1_000_000n },
            },
            {
              contract: "NegRiskCtfCollateralAdapter",
              srcAddress: NEG_RISK_ADAPTER,
              event: "Unwrapped",
              params: { caller: USER, asset: PUSD, to: USER, amount: 400_000n },
            },
          ],
        },
      },
    });

    const wraps = await indexer.PolyUSDWrap.getAll();
    t.expect(wraps.length).toBe(2);
    const types = wraps.map((w) => w.eventType).sort();
    t.expect(types).toEqual(["unwrap_negrisk_ctf", "wrap_negrisk_ctf"]);
  });
});

describe("Rewards.Withdrawn", () => {
  it("persists a SponsorshipWithdrawal entity", async (t) => {
    const indexer = createTestIndexer();
    const MARKET_ID =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

    await indexer.process({
      chains: {
        137: {
          simulate: [
            {
              contract: "Rewards",
              event: "MarketCreated",
              params: {
                marketId: MARKET_ID,
                startTime: 1714000000n,
                minSponsorDuration: 60n,
                minSponsorAmount: 1_000_000n,
                marketData: "0x",
              },
            },
            {
              contract: "Rewards",
              event: "Withdrawn",
              params: {
                marketId: MARKET_ID,
                sponsor: USER,
                returnedAmount: 300_000n,
                consumedAmount: 200_000n,
                isEarlyWithdraw: true,
              },
            },
          ],
        },
      },
    });

    const withdrawals = await indexer.SponsorshipWithdrawal.getAll();
    t.expect(withdrawals.length).toBe(1);
    const w = withdrawals[0]! as any;
    t.expect(w.market_id).toBe(MARKET_ID);
    t.expect(w.returnedAmount).toBe(300_000n);
    t.expect(w.consumedAmount).toBe(200_000n);
    t.expect(w.isEarlyWithdraw).toBe(true);
  });
});
