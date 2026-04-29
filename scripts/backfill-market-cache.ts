// One-off backfill: enriches .envio/cache/getMarketMetadata.tsv with
// metadata for every tokenId seen in OrderFill / OrderMatch that isn't
// already cached with valid data. Removes all null entries so they retry
// next time the indexer encounters them.
//
// USAGE (indexer can stay running — this script only WRITES the TSV file
// and READS postgres):
//   npx tsx scripts/backfill-market-cache.ts
//
// Caveat: if the indexer is still running, on its next graceful shutdown
// it will rewrite the TSV from its in-memory/postgres state, which may
// re-introduce nulls. Run this script close to when you plan to do a
// fresh reindex/reset.

import { Client } from "pg";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { Agent, fetch as undiciFetch } from "undici";

// Dedicated dispatcher: idle sockets close after 1s, no socket reused
// beyond 5s, tight per-stage timeouts. Without this, undici's global pool
// accumulates stuck sockets and ~94% of requests time out under sustained
// load. (Indexer runtime keeps the default global pool — this Agent is
// only used by this offline backfill script.)
const gammaAgent = new Agent({
  keepAliveTimeout: 1_000,
  keepAliveMaxTimeout: 5_000,
  connectTimeout: 1_000,
  headersTimeout: 1_500,
  bodyTimeout: 2_000,
  connections: 16,
});

// ── config ─────────────────────────────────────────────────────────
const PG = {
  host: process.env.PG_HOST ?? "localhost",
  port: Number(process.env.PG_PORT ?? 5433),
  user: process.env.PG_USER ?? "postgres",
  password: process.env.PG_PASSWORD ?? "testing",
  database: process.env.PG_DATABASE ?? "envio-dev",
};
const ENDPOINT = "https://gamma-api.polymarket.com/markets/keyset";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 16);
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS ?? 3_000);
const TSV_PATH = ".envio/cache/getMarketMetadata.tsv";
// Polymarket Gamma /markets limit: 300 req/10s. Stay under 25/sec to leave
// headroom for retries and any other traffic on this IP.
const RPS = Number(process.env.RPS ?? 25);

// ── token bucket: gate every request to stay within RPS ────────────
let tokens = RPS;
const tokenInterval = 1000 / RPS;
setInterval(() => {
  if (tokens < RPS) tokens++;
}, tokenInterval).unref();
const acquire = async () => {
  while (tokens <= 0) await new Promise((r) => setTimeout(r, 20));
  tokens--;
};

// ── types ──────────────────────────────────────────────────────────
type Meta = {
  question: string;
  slug: string;
  outcomes: string;
  outcomePrices: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  conditionId: string;
};
type FetchResult =
  | { tokenId: string; meta: Meta | null }
  | { tokenId: string; error: string };

// ── TSV helpers (postgres TEXT-format COPY encoding) ───────────────
const escapeTsv = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
const unescapeTsv = (s: string) =>
  s.replace(/\\t/g, "\t").replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\\\/g, "\\");

// id in the cache is JSON-encoded (literal quotes around the string)
const cacheId = (tokenId: string) => `"${tokenId}"`;

// ── load existing TSV — keep both data and confirmed-empty entries ─
// Map value: string = JSON metadata, null = confirmed-empty (\N in TSV).
const loadExistingTsv = async (): Promise<Map<string, string | null>> => {
  const map = new Map<string, string | null>();
  let raw: string;
  try {
    raw = await readFile(TSV_PATH, "utf8");
  } catch {
    return map;
  }
  const lines = raw.split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const tabIdx = line.indexOf("\t");
    if (tabIdx < 0) continue;
    const idEsc = line.slice(0, tabIdx);
    const outEsc = line.slice(tabIdx + 1);
    const idDecoded = unescapeTsv(idEsc);
    const tokenId = idDecoded.replace(/^"|"$/g, "");
    map.set(tokenId, outEsc === "\\N" ? null : unescapeTsv(outEsc));
  }
  return map;
};

const fetchOnce = async (tokenId: string) => {
  await acquire();
  const res = await undiciFetch(`${ENDPOINT}?clob_token_ids=${tokenId}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    dispatcher: gammaAgent,
  });
  if (!res.ok) {
    await res.body?.cancel();
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as { markets?: Array<Partial<Meta>> };
};

const fetchMetadata = async (tokenId: string): Promise<FetchResult> => {
  let lastErr: any;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const body = await fetchOnce(tokenId);
      const market = body.markets?.[0];
      if (!market) return { tokenId, meta: null };
      return {
        tokenId,
        meta: {
          question: market.question ?? "",
          slug: market.slug ?? "",
          outcomes: market.outcomes ?? "[]",
          outcomePrices: market.outcomePrices ?? "[]",
          description: market.description ?? "",
          image: market.image ?? "",
          startDate: market.startDate ?? "",
          endDate: market.endDate ?? "",
          conditionId: market.conditionId ?? "",
        },
      };
    } catch (e: any) {
      lastErr = e;
      // 100ms, 400ms backoff with small jitter
      if (attempt < 2) {
        const ms = (attempt === 0 ? 100 : 400) + Math.floor(Math.random() * 100);
        await new Promise((r) => setTimeout(r, ms));
      }
    }
  }
  return {
    tokenId,
    error: lastErr?.name === "TimeoutError" ? "timeout" : String(lastErr).slice(0, 80),
  };
};

const writeTsv = async (entries: Map<string, string | null>) => {
  await mkdir(dirname(TSV_PATH), { recursive: true });
  let body = "id\toutput\n";
  for (const [tokenId, out] of [...entries.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const cell = out === null ? "\\N" : escapeTsv(out);
    body += `${escapeTsv(cacheId(tokenId))}\t${cell}\n`;
  }
  await writeFile(TSV_PATH, body);
};

const main = async () => {
  const client = new Client(PG);
  await client.connect();
  console.log(`connected to postgres (read-only) @ ${PG.host}:${PG.port}/${PG.database}`);

  console.log("\n[1/4] reading existing TSV (keeping only non-null entries) …");
  const enriched = await loadExistingTsv();
  console.log(`  ${enriched.size} valid entries already in TSV`);

  console.log("\n[2/4] querying tokenIds from OrderFill + OrderMatch …");
  const { rows } = await client.query<{ tokenId: string }>(`
    SELECT DISTINCT "tokenId"::text AS "tokenId" FROM "OrderFill"
    UNION
    SELECT DISTINCT "tokenId"::text AS "tokenId" FROM "OrderMatch"
  `);
  const allTokens = new Set(rows.map((r) => r.tokenId));
  console.log(`  ${allTokens.size} unique tokenIds in trade events`);

  await client.end();

  const missing = [...allTokens].filter((t) => !enriched.has(t));
  console.log(`\n[3/4] fetching ${missing.length} missing tokenIds (concurrency=${CONCURRENCY}, timeout=${TIMEOUT_MS}ms) …`);

  let idx = 0;
  let done = 0;
  let withData = 0;
  let empty = 0;
  let failed = 0;
  let lastSave = Date.now();

  const worker = async () => {
    while (idx < missing.length) {
      const tokenId = missing[idx++]!;
      const result = await fetchMetadata(tokenId);
      done++;
      if ("error" in result) {
        failed++;
        // skip — leave it absent so the indexer retries it later
      } else if (result.meta === null) {
        empty++;
        enriched.set(tokenId, null); // cache as confirmed-empty (\N)
      } else {
        withData++;
        enriched.set(tokenId, JSON.stringify(result.meta));
      }
      if (done % 200 === 0) {
        process.stdout.write(
          `\r  progress: ${done}/${missing.length}  data=${withData} empty=${empty} failed=${failed}`,
        );
      }
      // periodic save so a crash doesn't lose work
      if (Date.now() - lastSave > 30_000) {
        await writeTsv(enriched);
        lastSave = Date.now();
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(
    `\n  fetched: ${done}/${missing.length}  data=${withData} empty=${empty} failed=${failed}`,
  );

  console.log("\n[4/4] writing final TSV …");
  await writeTsv(enriched);
  console.log(`  wrote ${enriched.size} entries to ${TSV_PATH} (no nulls)`);

  console.log("\nbackfill complete.");
};

main().catch((e) => {
  console.error("\nfailed:", e);
  process.exit(1);
});
