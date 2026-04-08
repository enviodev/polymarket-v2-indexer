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
    cache: true,
    rateLimit: { calls: 280, per: 10_000 }, // 280 req / 10s — under Gamma API 300/10s limit
  },
  async ({ input: tokenId }) => {
    const res = await fetch(
      `https://gamma-api.polymarket.com/markets?clob_token_ids=${tokenId}`,
    );
    if (!res.ok) return null;

    const data = (await res.json()) as Array<{
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
    const market = data[0];
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
