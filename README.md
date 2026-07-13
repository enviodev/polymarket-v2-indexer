# Polymarket V2 Indexer

Indexes the new Polymarket V2 exchange stack on Polygon, built with [Envio HyperIndex](https://docs.envio.dev).

## Contracts Indexed

| Contract | Address | What it tracks |
|----------|---------|----------------|
| **CTFExchange V2** (x3) | `0xe11118...`, `0xe2222d...0f59`, `0xe2222d...0036` | OrderFilled (with builder codes + metadata), OrdersMatched, FeeCharged (pause/admin events are logged but not persisted) |
| **PolyUSD** | `0xc011a7e1...82dfb` | Transfers, balances, Wrapped/Unwrapped (USDC/USDC.e to pUSD) |
| **CtfCollateralAdapter** | `0xada100...9718` | pUSD-backed CTF position lifecycle: splits, merges, redemptions |
| **NegRiskCtfCollateralAdapter** | `0xada200...c6f1` | Neg-risk wrap/unwrap flows |
| **Rewards** | `0xdd8db7...e8b` | Market sponsorship, withdrawals, reward distribution |

## What's new in V2

- **Builder codes** on every order fill for on-chain attribution
- **PolyUSD** (pUSD) replaces USDC.e as collateral, backed 1:1 by USDC
- **EIP-1271** smart contract wallet signatures
- **Per-user pause** capability
- **Market sponsorship** rewards system

## Schema

- `OrderFill`: every V2 trade with maker, taker, side, tokenId, fee, builder code
- `OrderMatch`: matched order pairs
- `FeeEvent`: fee collection
- `Market`: question, slug, outcomes and metadata from the Gamma API (closed
  markets included — the keyset endpoint hides them by default)
- `PolyUSDTransfer` / `PolyUSDWrap` / `PolyUSDAccount`: pUSD flow and balances
- `PolyUSDStats`: total supply, wrapped/unwrapped volumes
- `ExchangeStats`: per-exchange aggregates (volume in collateral units for
  both sides, fills, fees, builder fills)
- `CtfSplit` / `CtfMerge` / `CtfRedemption` / `CtfAdapterStats`: pUSD-backed
  CTF position lifecycle via the collateral adapters
- `SponsoredMarket` / `Sponsorship` / `SponsorshipWithdrawal` /
  `RewardDistribution`: rewards system (withdrawals are separate rows —
  `Sponsorship` is an insert-only ClickHouse stream; join on market + sponsor)

## Run locally

A HyperSync API token is required. Create one at https://envio.dev/app/api-tokens, then:

```bash
cp .env.example .env
# edit .env and set ENVIO_API_TOKEN to your token
```

Then:

```bash
pnpm install
pnpm codegen
pnpm dev
```

Visit http://localhost:8080 for the GraphQL playground (password: `testing`).

## Test

```bash
pnpm test
```

15 tests covering all handlers with real on-chain data (via HyperSync) and simulated events.

## Pre-requisites

- [Node.js v22+](https://nodejs.org/en/download/current)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/products/docker-desktop/) or [Podman](https://podman.io/)

