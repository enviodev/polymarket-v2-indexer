import { createEffect, S } from "envio";

export const getMarketMetadata = createEffect(
  {
    name: "getMarketMetadata",
    input: S.string, // tokenId as decimal string
    output: S.union([
      S.schema({
        question: S.string,
        slug: S.string,
        outcomes: S.string,
        outcomePrices: S.string,
        description: S.string,
        image: S.string,
        startDate: S.string,
        endDate: S.string,
        conditionId: S.string,
      }),
      null,
    ]),
    // Market metadata (question, slug, outcomes, conditionId) is immutable once
    // the market exists. outcomePrices is a snapshot at first-fetch time; if the
    // dashboard needs live prices, it should pull those separately from the CLOB
    // orderbook — the indexer is not the right place for perpetually-fresh prices.
    cache: true,
    rateLimit: { calls: 280, per: 10_000 }, // 280 req / 10s — under Gamma API 300/10s limit
  },
  async ({ input: tokenId }) => {
    // /markets/keyset is the cursor-paginated replacement for /markets.
    // The old /markets endpoint is deprecated on 2026-05-01. Same query
    // params work; the response is wrapped in { markets: [...] } instead
    // of being a bare array.
    //
    // 1s timeout: ~0.5% of Gamma calls hang for 30+ seconds (stale upstream
    // sockets). Legitimate responses are <400ms even under rate-limit pressure,
    // so 1s is ~2.5× the worst observed real latency. Throw on timeout/non-2xx
    // so envio does NOT cache the failure — only valid data lands in the cache.
    // The OrderFill for this event keeps market_id=null; the next event with
    // the same tokenId retries fresh.
    const res = await fetch(
      `https://gamma-api.polymarket.com/markets/keyset?clob_token_ids=${tokenId}`,
      { signal: AbortSignal.timeout(1_000) },
    );
    if (!res.ok) {
      throw new Error(`Gamma API ${res.status} for tokenId ${tokenId}`);
    }

    const body = (await res.json()) as {
      markets?: Array<{
        question?: string;
        slug?: string;
        outcomes?: string;
        outcomePrices?: string;
        description?: string;
        image?: string;
        startDate?: string;
        endDate?: string;
        conditionId?: string;
      }>;
    };
    const market = body.markets?.[0];
    if (!market) return null;

    return {
      question: market.question ?? "",
      slug: market.slug ?? "",
      outcomes: market.outcomes ?? "[]",
      outcomePrices: market.outcomePrices ?? "[]",
      description: market.description ?? "",
      image: market.image ?? "",
      startDate: market.startDate ?? "",
      endDate: market.endDate ?? "",
      conditionId: market.conditionId ?? "",
    };
  },
);
