import { indexer } from "generated";

const eventId = (event: { chainId: number; block: { number: number }; logIndex: number }) =>
  `${event.chainId}_${event.block.number}_${event.logIndex}`;

// ── Reward Distribution ────────────────────────────────────────────

indexer.onEvent(
  { contract: "Rewards", event: "DistributedRewards" },
  async ({ event, context }) => {
    context.RewardDistribution.set({
      id: eventId(event),
      user: event.params.user,
      amount: event.params.amount,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });
  },
);

// ── Market Sponsorship ─────────────────────────────────────────────

indexer.onEvent(
  { contract: "Rewards", event: "MarketCreated" },
  async ({ event, context }) => {
    context.SponsoredMarket.set({
      id: event.params.marketId,
      startTime: Number(event.params.startTime),
      minSponsorDuration: Number(event.params.minSponsorDuration),
      minSponsorAmount: event.params.minSponsorAmount,
      marketData: event.params.marketData,
      closed: false,
      closedAt: undefined,
      createdAt: event.block.timestamp,
      createdAtBlock: event.block.number,
    });
  },
);

indexer.onEvent(
  { contract: "Rewards", event: "Sponsored" },
  async ({ event, context }) => {
    context.Sponsorship.set({
      id: eventId(event),
      market_id: event.params.marketId,
      sponsor: event.params.sponsor,
      amount: event.params.amount,
      startTime: Number(event.params.startTime),
      endTime: Number(event.params.endTime),
      ratePerMinute: event.params.ratePerMinute,
      withdrawn: false,
      returnedAmount: undefined,
      consumedAmount: undefined,
      isEarlyWithdraw: undefined,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
    });
  },
);

indexer.onEvent(
  { contract: "Rewards", event: "Withdrawn" },
  async ({ event, context }) => {
    // Find the sponsorship to update — use market+sponsor as lookup
    // Since we can't easily find the exact sponsorship entity, log it
    context.log.info(
      `Withdrawal from market ${event.params.marketId} by ${event.params.sponsor}: returned=${event.params.returnedAmount} consumed=${event.params.consumedAmount} early=${event.params.isEarlyWithdraw}`,
    );
  },
);

indexer.onEvent(
  { contract: "Rewards", event: "MarketClosed" },
  async ({ event, context }) => {
    const market = await context.SponsoredMarket.get(event.params.marketId);
    if (!market) return;

    context.SponsoredMarket.set({
      ...market,
      closed: true,
      closedAt: Number(event.params.closedAt),
    });
  },
);
