import { Rewards } from "generated";

const eventId = (event: { chainId: number; block: { number: number }; logIndex: number }) =>
  `${event.chainId}_${event.block.number}_${event.logIndex}`;

/** Canonical form for Sponsor lookups across Sponsored / Withdrawn. */
const normAddr = (a: string) => a.toLowerCase();

// ── Reward Distribution ────────────────────────────────────────────

Rewards.DistributedRewards.handler(async ({ event, context }) => {
  context.RewardDistribution.set({
    id: eventId(event),
    user: event.params.user,
    amount: event.params.amount,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
});

// ── Market Sponsorship ─────────────────────────────────────────────

Rewards.MarketCreated.handler(async ({ event, context }) => {
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
});

Rewards.Sponsored.handler(async ({ event, context }) => {
  context.Sponsorship.set({
    id: eventId(event),
    market_id: event.params.marketId,
    sponsor: normAddr(event.params.sponsor),
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
});

Rewards.Withdrawn.handler(async ({ event, context }) => {
  const marketId = event.params.marketId;
  const sponsor = normAddr(event.params.sponsor);

  const byMarket = await context.Sponsorship.getWhere({
    market_id: { _eq: marketId },
  });

  const opens = byMarket.filter((s) => normAddr(s.sponsor) === sponsor && !s.withdrawn);

  if (!opens.length) {
    context.log.warn(
      `withdrawn: no open sponsorship for market=${marketId} sponsor=${sponsor}`
    );
    return;
  }

  const row = [...opens].sort((a, b) => b.blockNumber - a.blockNumber)[0]!;
  context.Sponsorship.set({
    ...row,
    withdrawn: true,
    returnedAmount: event.params.returnedAmount,
    consumedAmount: event.params.consumedAmount,
    isEarlyWithdraw: event.params.isEarlyWithdraw,
  });
});

Rewards.MarketClosed.handler(async ({ event, context }) => {
  const market = await context.SponsoredMarket.get(event.params.marketId);
  if (!market) return;

  context.SponsoredMarket.set({
    ...market,
    closed: true,
    closedAt: Number(event.params.closedAt),
  });
});
