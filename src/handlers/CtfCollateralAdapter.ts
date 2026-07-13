import { indexer } from "envio";

const NEG_RISK_ADAPTER_ADDR = "0xada200001000ef00d07553cee7006808f895c6f1";

const eventId = (event: {
  chainId: number;
  block: { number: number };
  logIndex: number;
}) => `${event.chainId}_${event.block.number}_${event.logIndex}`;

const getOrInitStats = async (context: any, id: string) =>
  context.CtfAdapterStats.getOrCreate({
    id,
    totalSplits: 0n,
    totalMerges: 0n,
    totalRedemptions: 0n,
    totalSplitVolume: 0n,
    totalMergeVolume: 0n,
    totalRedemptionPayout: 0n,
  });

// ── CtfCollateralAdapter (pUSD-backed CTF) ─────────────────────────

indexer.onEvent(
  { contract: "CtfCollateralAdapter", event: "PositionSplit" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context, event.srcAddress);
    const isNegRisk =
      event.srcAddress.toLowerCase() === NEG_RISK_ADAPTER_ADDR.toLowerCase();

    context.CtfSplit.set({
      id: eventId(event),
      stakeholder: event.params.stakeholder,
      collateralToken: event.params.collateralToken,
      parentCollectionId: event.params.parentCollectionId,
      conditionId: event.params.conditionId,
      partition: [...event.params.partition],
      amount: event.params.amount,
      txFrom: event.transaction.from ?? "",
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
      isNegRisk,
    });

    context.CtfAdapterStats.set({
      ...stats,
      totalSplits: stats.totalSplits + 1n,
      totalSplitVolume: stats.totalSplitVolume + event.params.amount,
    });
  },
);

indexer.onEvent(
  { contract: "CtfCollateralAdapter", event: "PositionsMerge" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context, event.srcAddress);
    const isNegRisk =
      event.srcAddress.toLowerCase() === NEG_RISK_ADAPTER_ADDR.toLowerCase();

    context.CtfMerge.set({
      id: eventId(event),
      stakeholder: event.params.stakeholder,
      collateralToken: event.params.collateralToken,
      parentCollectionId: event.params.parentCollectionId,
      conditionId: event.params.conditionId,
      partition: [...event.params.partition],
      amount: event.params.amount,
      txFrom: event.transaction.from ?? "",
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
      isNegRisk,
    });

    context.CtfAdapterStats.set({
      ...stats,
      totalMerges: stats.totalMerges + 1n,
      totalMergeVolume: stats.totalMergeVolume + event.params.amount,
    });
  },
);

indexer.onEvent(
  { contract: "CtfCollateralAdapter", event: "PayoutRedemption" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context, event.srcAddress);
    const isNegRisk =
      event.srcAddress.toLowerCase() === NEG_RISK_ADAPTER_ADDR.toLowerCase();

    context.CtfRedemption.set({
      id: eventId(event),
      redeemer: event.params.redeemer,
      collateralToken: event.params.collateralToken,
      parentCollectionId: event.params.parentCollectionId,
      conditionId: event.params.conditionId,
      indexSets: [...event.params.indexSets],
      payout: event.params.payout,
      txFrom: event.transaction.from ?? "",
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
      isNegRisk,
    });

    context.CtfAdapterStats.set({
      ...stats,
      totalRedemptions: stats.totalRedemptions + 1n,
      totalRedemptionPayout: stats.totalRedemptionPayout + event.params.payout,
    });
  },
);

// ── NegRiskCtfCollateralAdapter — Wrapped/Unwrapped for neg-risk ───
// Same event signatures as PolyUSD wraps; eventType distinguishes them
// so they join with regular pUSD wraps at the query layer.

indexer.onEvent(
  { contract: "NegRiskCtfCollateralAdapter", event: "Wrapped" },
  async ({ event, context }) => {
    context.PolyUSDWrap.set({
      id: eventId(event),
      eventType: "wrap_negrisk_ctf",
      caller: event.params.caller,
      asset: event.params.asset,
      to: event.params.to,
      amount: event.params.amount,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });
  },
);

indexer.onEvent(
  { contract: "NegRiskCtfCollateralAdapter", event: "Unwrapped" },
  async ({ event, context }) => {
    context.PolyUSDWrap.set({
      id: eventId(event),
      eventType: "unwrap_negrisk_ctf",
      caller: event.params.caller,
      asset: event.params.asset,
      to: event.params.to,
      amount: event.params.amount,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });
  },
);
