import { indexer } from "envio";
import { getMarketMetadata } from "../effects/marketMetadata";

const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

const eventId = (event: { chainId: number; block: { number: number }; logIndex: number }) =>
  `${event.chainId}_${event.block.number}_${event.logIndex}`;

const getOrInitStats = async (context: any, id: string) =>
  context.ExchangeStats.getOrCreate({
    id,
    totalOrdersFilled: 0n,
    totalOrdersMatched: 0n,
    totalVolume: 0n,
    totalFees: 0n,
    totalBuilderFills: 0n,
  });

const ensureMarket = async (context: any, tokenId: bigint) => {
  const tokenIdStr = tokenId.toString();
  const existing = await context.Market.get(tokenIdStr);
  if (!existing) {
    try {
      const meta = await context.effect(getMarketMetadata, tokenIdStr);
      if (meta) {
        context.Market.set({
          id: tokenIdStr,
          question: meta.question,
          slug: meta.slug,
          outcomes: meta.outcomes,
          outcomePrices: meta.outcomePrices,
          description: meta.description,
          image: meta.image,
          startDate: meta.startDate,
          endDate: meta.endDate,
          conditionId: meta.conditionId,
        });
      }
    } catch (e) {
      context.log.warn(
        `Failed to fetch market metadata for tokenId ${tokenIdStr}: ${e}`,
      );
    }
  }

  // Market.id IS the tokenId, so always link fills by tokenId: the join
  // resolves as soon as metadata lands (a later fill of the same token
  // retries the fetch). Returning undefined on fetch failure would leave
  // the fill permanently unattributed — at backfill speed the Gamma rate
  // limit makes transient failures common.
  return tokenIdStr;
};

// ── Trading ────────────────────────────────────────────────────────

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "OrderFilled" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context, event.srcAddress);
    const marketId = await ensureMarket(context, event.params.tokenId);

    context.OrderFill.set({
      id: eventId(event),
      orderHash: event.params.orderHash,
      maker: event.params.maker,
      taker: event.params.taker,
      side: Number(event.params.side),
      tokenId: event.params.tokenId,
      market_id: marketId,
      makerAmountFilled: event.params.makerAmountFilled,
      takerAmountFilled: event.params.takerAmountFilled,
      fee: event.params.fee,
      builder: event.params.builder,
      metadata: event.params.metadata,
      exchange: event.srcAddress,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
      txFrom: event.transaction.from ?? "",
    });

    const hasBuilder = event.params.builder !== ZERO_BYTES32;
    // Volume in collateral units for both sides: on BUY fills the maker pays
    // collateral (makerAmountFilled); on SELL fills the maker gives outcome
    // tokens and receives collateral (takerAmountFilled).
    const collateralAmount =
      Number(event.params.side) === 0
        ? event.params.makerAmountFilled
        : event.params.takerAmountFilled;

    context.ExchangeStats.set({
      ...stats,
      totalOrdersFilled: stats.totalOrdersFilled + 1n,
      totalVolume: stats.totalVolume + collateralAmount,
      totalFees: stats.totalFees + event.params.fee,
      totalBuilderFills: stats.totalBuilderFills + (hasBuilder ? 1n : 0n),
    });
  },
);

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "OrdersMatched" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context, event.srcAddress);
    const marketId = await ensureMarket(context, event.params.tokenId);

    context.OrderMatch.set({
      id: eventId(event),
      takerOrderHash: event.params.takerOrderHash,
      takerOrderMaker: event.params.takerOrderMaker,
      side: Number(event.params.side),
      tokenId: event.params.tokenId,
      market_id: marketId,
      makerAmountFilled: event.params.makerAmountFilled,
      takerAmountFilled: event.params.takerAmountFilled,
      exchange: event.srcAddress,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });

    context.ExchangeStats.set({
      ...stats,
      totalOrdersMatched: stats.totalOrdersMatched + 1n,
    });
  },
);

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "FeeCharged" },
  async ({ event, context }) => {
    context.FeeEvent.set({
      id: eventId(event),
      receiver: event.params.receiver,
      amount: event.params.amount,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });
  },
);

// ── Pause & Admin (light tracking) ─────────────────────────────────

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "UserPaused" },
  async ({ event, context }) => {
    context.log.info(
      `User ${event.params.user} paused until block ${event.params.effectivePauseBlock}`,
    );
  },
);

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "TradingPaused" },
  async ({ event, context }) => {
    context.log.info(`Trading paused by ${event.params.pauser}`);
  },
);

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "TradingUnpaused" },
  async ({ event, context }) => {
    context.log.info(`Trading unpaused by ${event.params.pauser}`);
  },
);

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "NewAdmin" },
  async ({ event, context }) => {
    context.log.info(
      `New admin ${event.params.newAdminAddress} added by ${event.params.admin}`,
    );
  },
);

indexer.onEvent(
  { contract: "CTFExchangeV2", event: "NewOperator" },
  async ({ event, context }) => {
    context.log.info(
      `New operator ${event.params.newOperatorAddress} added by ${event.params.admin}`,
    );
  },
);
