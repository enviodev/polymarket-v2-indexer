import { indexer } from "generated";

const eventId = (event: { chainId: number; block: { number: number }; logIndex: number }) =>
  `${event.chainId}_${event.block.number}_${event.logIndex}`;

const getOrInitStats = async (context: any) =>
  context.PolyUSDStats.getOrCreate({
    id: "polyusd",
    totalSupply: 0n,
    totalWrapped: 0n,
    totalUnwrapped: 0n,
    totalTransfers: 0n,
  });

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

// ── Transfers ──────────────────────────────────────────────────────

indexer.onEvent(
  { contract: "PolyUSD", event: "Transfer" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context);
    const isMint = event.params.from === ZERO_ADDR;
    const isBurn = event.params.to === ZERO_ADDR;

    context.PolyUSDTransfer.set({
      id: eventId(event),
      from: event.params.from,
      to: event.params.to,
      amount: event.params.amount,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });

    // Track balances for non-zero addresses
    if (!isMint) {
      const sender = await context.PolyUSDAccount.getOrCreate({
        id: event.params.from,
        balance: 0n,
        totalWrapped: 0n,
        totalUnwrapped: 0n,
      });
      context.PolyUSDAccount.set({
        ...sender,
        balance: sender.balance - event.params.amount,
      });
    }

    if (!isBurn) {
      const receiver = await context.PolyUSDAccount.getOrCreate({
        id: event.params.to,
        balance: 0n,
        totalWrapped: 0n,
        totalUnwrapped: 0n,
      });
      context.PolyUSDAccount.set({
        ...receiver,
        balance: receiver.balance + event.params.amount,
      });
    }

    context.PolyUSDStats.set({
      ...stats,
      totalSupply: isMint
        ? stats.totalSupply + event.params.amount
        : isBurn
          ? stats.totalSupply - event.params.amount
          : stats.totalSupply,
      totalTransfers: stats.totalTransfers + 1n,
    });
  },
);

// ── Wrapping / Unwrapping ──────────────────────────────────────────

indexer.onEvent(
  { contract: "PolyUSD", event: "Wrapped" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context);

    context.PolyUSDWrap.set({
      id: eventId(event),
      eventType: "wrap",
      caller: event.params.caller,
      asset: event.params.asset,
      to: event.params.to,
      amount: event.params.amount,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });

    const account = await context.PolyUSDAccount.getOrCreate({
      id: event.params.to,
      balance: 0n,
      totalWrapped: 0n,
      totalUnwrapped: 0n,
    });
    context.PolyUSDAccount.set({
      ...account,
      totalWrapped: account.totalWrapped + event.params.amount,
    });

    context.PolyUSDStats.set({
      ...stats,
      totalWrapped: stats.totalWrapped + event.params.amount,
    });
  },
);

indexer.onEvent(
  { contract: "PolyUSD", event: "Unwrapped" },
  async ({ event, context }) => {
    const stats = await getOrInitStats(context);

    context.PolyUSDWrap.set({
      id: eventId(event),
      eventType: "unwrap",
      caller: event.params.caller,
      asset: event.params.asset,
      to: event.params.to,
      amount: event.params.amount,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });

    const account = await context.PolyUSDAccount.getOrCreate({
      id: event.params.caller,
      balance: 0n,
      totalWrapped: 0n,
      totalUnwrapped: 0n,
    });
    context.PolyUSDAccount.set({
      ...account,
      totalUnwrapped: account.totalUnwrapped + event.params.amount,
    });

    context.PolyUSDStats.set({
      ...stats,
      totalUnwrapped: stats.totalUnwrapped + event.params.amount,
    });
  },
);
