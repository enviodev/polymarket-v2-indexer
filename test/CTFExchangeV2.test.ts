import { describe, it } from "vitest";
import { createTestIndexer } from "generated";

describe("CTF Exchange V2", () => {
  it("indexes real OrderFilled + OrdersMatched + FeeCharged from live trading", async (t) => {
    // Block 85050371: first real trades on CTFExchange V2 #1
    const indexer = createTestIndexer();

    t.expect(
      await indexer.process({
        chains: {
          137: { startBlock: 85_050_371, endBlock: 85_050_371 },
        },
      }),
      "Should index OrderFilled, OrdersMatched, and FeeCharged from real V2 trades"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "ExchangeStats": {
              "sets": [
                {
                  "id": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "totalBuilderFills": 0n,
                  "totalFees": 0n,
                  "totalOrdersFilled": 2n,
                  "totalOrdersMatched": 1n,
                  "totalVolume": 5000000n,
                },
              ],
            },
            "Market": {
              "sets": [
                {
                  "conditionId": "0x182390641d3b1b47cc64274b9da290efd04221c586651ba190880713da6347d9",
                  "description": "This market will resolve to "Yes" if an official agreement over Iranian nuclear research and/or nuclear weapon development, defined as a publicly announced mutual agreement, is reached between the United States and Iran by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to “No”.

      If such an agreement is officially reached before the resolution date, this market will resolve to "Yes", regardless of if/when the agreement goes into effect.

      Agreements that include the United States and Iran as parties, even if they also involve other countries (e.g., a multilateral deal like the JCPOA), will qualify for resolution.

      The primary resolution source for this market will be an official announcement by the United States and/or the Islamic Republic of Iran, however an overwhelming consensus of credible reporting confirming an agreement has been reached will also qualify.",
                  "endDate": "2026-12-31T00:00:00Z",
                  "id": "102936224134271070189104847090829839924697394514566827387181305960175107677216",
                  "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/us-x-iran-nuclear-deal-in-2025-3rpCC4Kl23Lc.jpg",
                  "outcomePrices": "["0.525", "0.475"]",
                  "outcomes": "["Yes", "No"]",
                  "question": "US-Iran nuclear deal before 2027?",
                  "slug": "us-iran-nuclear-deal-before-2027",
                  "startDate": "2025-11-05T16:48:16.494Z",
                },
                {
                  "conditionId": "0x182390641d3b1b47cc64274b9da290efd04221c586651ba190880713da6347d9",
                  "description": "This market will resolve to "Yes" if an official agreement over Iranian nuclear research and/or nuclear weapon development, defined as a publicly announced mutual agreement, is reached between the United States and Iran by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to “No”.

      If such an agreement is officially reached before the resolution date, this market will resolve to "Yes", regardless of if/when the agreement goes into effect.

      Agreements that include the United States and Iran as parties, even if they also involve other countries (e.g., a multilateral deal like the JCPOA), will qualify for resolution.

      The primary resolution source for this market will be an official announcement by the United States and/or the Islamic Republic of Iran, however an overwhelming consensus of credible reporting confirming an agreement has been reached will also qualify.",
                  "endDate": "2026-12-31T00:00:00Z",
                  "id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/us-x-iran-nuclear-deal-in-2025-3rpCC4Kl23Lc.jpg",
                  "outcomePrices": "["0.525", "0.475"]",
                  "outcomes": "["Yes", "No"]",
                  "question": "US-Iran nuclear deal before 2027?",
                  "slug": "us-iran-nuclear-deal-before-2027",
                  "startDate": "2025-11-05T16:48:16.494Z",
                },
              ],
            },
            "OrderFill": {
              "sets": [
                {
                  "blockNumber": 85050371,
                  "builder": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "fee": 0n,
                  "id": "137_85050371_255",
                  "maker": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "makerAmountFilled": 2500000n,
                  "market_id": "102936224134271070189104847090829839924697394514566827387181305960175107677216",
                  "metadata": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "orderHash": "0xe6fb5cb4d88c728f34ebc10ba8a641fc646a1baf99e74d89192614973c1af784",
                  "side": 0,
                  "taker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "takerAmountFilled": 5000000n,
                  "timestamp": 1775220779,
                  "tokenId": 102936224134271070189104847090829839924697394514566827387181305960175107677216n,
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                  "txFrom": "0x2f1CC78B6945d57c342273d42f13cdB5488FEb15",
                },
                {
                  "blockNumber": 85050371,
                  "builder": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "fee": 0n,
                  "id": "137_85050371_257",
                  "maker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "makerAmountFilled": 2500000n,
                  "market_id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "metadata": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "orderHash": "0x0c970e909e59bc0632c4687337ae0c1b9a45ac8caa18d18d776d7d692a51b206",
                  "side": 0,
                  "taker": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "takerAmountFilled": 5000000n,
                  "timestamp": 1775220779,
                  "tokenId": 45763018441764333771124945243746174684578244015331389396782339063349542289693n,
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                  "txFrom": "0x2f1CC78B6945d57c342273d42f13cdB5488FEb15",
                },
              ],
            },
            "OrderMatch": {
              "sets": [
                {
                  "blockNumber": 85050371,
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "id": "137_85050371_258",
                  "makerAmountFilled": 2500000n,
                  "market_id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "side": 0,
                  "takerAmountFilled": 5000000n,
                  "takerOrderHash": "0x0c970e909e59bc0632c4687337ae0c1b9a45ac8caa18d18d776d7d692a51b206",
                  "takerOrderMaker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "timestamp": 1775220779,
                  "tokenId": 45763018441764333771124945243746174684578244015331389396782339063349542289693n,
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
              ],
            },
            "PolyUSDAccount": {
              "sets": [
                {
                  "balance": -2500000n,
                  "id": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": -2500000n,
                  "id": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": 0n,
                  "id": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": 0n,
                  "id": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": 0n,
                  "id": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "totalUnwrapped": 5000000n,
                  "totalWrapped": 0n,
                },
              ],
            },
            "PolyUSDStats": {
              "sets": [
                {
                  "id": "polyusd",
                  "totalSupply": -5000000n,
                  "totalTransfers": 4n,
                  "totalUnwrapped": 5000000n,
                  "totalWrapped": 0n,
                },
              ],
            },
            "PolyUSDTransfer": {
              "sets": [
                {
                  "amount": 2500000n,
                  "blockNumber": 85050371,
                  "from": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "id": "137_85050371_242",
                  "timestamp": 1775220779,
                  "to": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
                {
                  "amount": 2500000n,
                  "blockNumber": 85050371,
                  "from": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "id": "137_85050371_243",
                  "timestamp": 1775220779,
                  "to": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
                {
                  "amount": 5000000n,
                  "blockNumber": 85050371,
                  "from": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "id": "137_85050371_244",
                  "timestamp": 1775220779,
                  "to": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
                {
                  "amount": 5000000n,
                  "blockNumber": 85050371,
                  "from": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "id": "137_85050371_247",
                  "timestamp": 1775220779,
                  "to": "0x0000000000000000000000000000000000000000",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
              ],
            },
            "PolyUSDWrap": {
              "sets": [
                {
                  "amount": 5000000n,
                  "asset": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                  "blockNumber": 85050371,
                  "caller": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "eventType": "unwrap",
                  "id": "137_85050371_248",
                  "timestamp": 1775220779,
                  "to": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
              ],
            },
            "block": 85050371,
            "chainId": 137,
            "eventsProcessed": 8,
          },
        ],
      }
    `);
  });

  it("indexes real trades across a small block range", async (t) => {
    // Blocks 85050371-85050645: multiple trading blocks
    const indexer = createTestIndexer();

    t.expect(
      await indexer.process({
        chains: {
          137: { startBlock: 85_050_371, endBlock: 85_050_645 },
        },
      }),
      "Should index multiple fills and matches across blocks"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "Market": {
              "sets": [
                {
                  "conditionId": "0x182390641d3b1b47cc64274b9da290efd04221c586651ba190880713da6347d9",
                  "description": "This market will resolve to "Yes" if an official agreement over Iranian nuclear research and/or nuclear weapon development, defined as a publicly announced mutual agreement, is reached between the United States and Iran by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to “No”.

      If such an agreement is officially reached before the resolution date, this market will resolve to "Yes", regardless of if/when the agreement goes into effect.

      Agreements that include the United States and Iran as parties, even if they also involve other countries (e.g., a multilateral deal like the JCPOA), will qualify for resolution.

      The primary resolution source for this market will be an official announcement by the United States and/or the Islamic Republic of Iran, however an overwhelming consensus of credible reporting confirming an agreement has been reached will also qualify.",
                  "endDate": "2026-12-31T00:00:00Z",
                  "id": "102936224134271070189104847090829839924697394514566827387181305960175107677216",
                  "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/us-x-iran-nuclear-deal-in-2025-3rpCC4Kl23Lc.jpg",
                  "outcomePrices": "["0.525", "0.475"]",
                  "outcomes": "["Yes", "No"]",
                  "question": "US-Iran nuclear deal before 2027?",
                  "slug": "us-iran-nuclear-deal-before-2027",
                  "startDate": "2025-11-05T16:48:16.494Z",
                },
                {
                  "conditionId": "0x182390641d3b1b47cc64274b9da290efd04221c586651ba190880713da6347d9",
                  "description": "This market will resolve to "Yes" if an official agreement over Iranian nuclear research and/or nuclear weapon development, defined as a publicly announced mutual agreement, is reached between the United States and Iran by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to “No”.

      If such an agreement is officially reached before the resolution date, this market will resolve to "Yes", regardless of if/when the agreement goes into effect.

      Agreements that include the United States and Iran as parties, even if they also involve other countries (e.g., a multilateral deal like the JCPOA), will qualify for resolution.

      The primary resolution source for this market will be an official announcement by the United States and/or the Islamic Republic of Iran, however an overwhelming consensus of credible reporting confirming an agreement has been reached will also qualify.",
                  "endDate": "2026-12-31T00:00:00Z",
                  "id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/us-x-iran-nuclear-deal-in-2025-3rpCC4Kl23Lc.jpg",
                  "outcomePrices": "["0.525", "0.475"]",
                  "outcomes": "["Yes", "No"]",
                  "question": "US-Iran nuclear deal before 2027?",
                  "slug": "us-iran-nuclear-deal-before-2027",
                  "startDate": "2025-11-05T16:48:16.494Z",
                },
              ],
            },
            "OrderFill": {
              "sets": [
                {
                  "blockNumber": 85050371,
                  "builder": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "fee": 0n,
                  "id": "137_85050371_255",
                  "maker": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "makerAmountFilled": 2500000n,
                  "market_id": "102936224134271070189104847090829839924697394514566827387181305960175107677216",
                  "metadata": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "orderHash": "0xe6fb5cb4d88c728f34ebc10ba8a641fc646a1baf99e74d89192614973c1af784",
                  "side": 0,
                  "taker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "takerAmountFilled": 5000000n,
                  "timestamp": 1775220779,
                  "tokenId": 102936224134271070189104847090829839924697394514566827387181305960175107677216n,
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                  "txFrom": "0x2f1CC78B6945d57c342273d42f13cdB5488FEb15",
                },
                {
                  "blockNumber": 85050371,
                  "builder": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "fee": 0n,
                  "id": "137_85050371_257",
                  "maker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "makerAmountFilled": 2500000n,
                  "market_id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "metadata": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "orderHash": "0x0c970e909e59bc0632c4687337ae0c1b9a45ac8caa18d18d776d7d692a51b206",
                  "side": 0,
                  "taker": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "takerAmountFilled": 5000000n,
                  "timestamp": 1775220779,
                  "tokenId": 45763018441764333771124945243746174684578244015331389396782339063349542289693n,
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                  "txFrom": "0x2f1CC78B6945d57c342273d42f13cdB5488FEb15",
                },
              ],
            },
            "OrderMatch": {
              "sets": [
                {
                  "blockNumber": 85050371,
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "id": "137_85050371_258",
                  "makerAmountFilled": 2500000n,
                  "market_id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "side": 0,
                  "takerAmountFilled": 5000000n,
                  "takerOrderHash": "0x0c970e909e59bc0632c4687337ae0c1b9a45ac8caa18d18d776d7d692a51b206",
                  "takerOrderMaker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "timestamp": 1775220779,
                  "tokenId": 45763018441764333771124945243746174684578244015331389396782339063349542289693n,
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
              ],
            },
            "PolyUSDTransfer": {
              "sets": [
                {
                  "amount": 2500000n,
                  "blockNumber": 85050371,
                  "from": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "id": "137_85050371_242",
                  "timestamp": 1775220779,
                  "to": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
                {
                  "amount": 2500000n,
                  "blockNumber": 85050371,
                  "from": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "id": "137_85050371_243",
                  "timestamp": 1775220779,
                  "to": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
                {
                  "amount": 5000000n,
                  "blockNumber": 85050371,
                  "from": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "id": "137_85050371_244",
                  "timestamp": 1775220779,
                  "to": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
                {
                  "amount": 5000000n,
                  "blockNumber": 85050371,
                  "from": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "id": "137_85050371_247",
                  "timestamp": 1775220779,
                  "to": "0x0000000000000000000000000000000000000000",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
              ],
            },
            "PolyUSDWrap": {
              "sets": [
                {
                  "amount": 5000000n,
                  "asset": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                  "blockNumber": 85050371,
                  "caller": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "eventType": "unwrap",
                  "id": "137_85050371_248",
                  "timestamp": 1775220779,
                  "to": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "transactionHash": "0x5a829009714d1e2b8e17383078b18f64ef195da5ccd056107ecf01c5a4737ed1",
                },
              ],
            },
            "block": 85050371,
            "chainId": 137,
            "eventsProcessed": 8,
          },
          {
            "ExchangeStats": {
              "sets": [
                {
                  "id": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "totalBuilderFills": 0n,
                  "totalFees": 0n,
                  "totalOrdersFilled": 4n,
                  "totalOrdersMatched": 2n,
                  "totalVolume": 10000000n,
                },
              ],
            },
            "OrderFill": {
              "sets": [
                {
                  "blockNumber": 85050645,
                  "builder": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "fee": 0n,
                  "id": "137_85050645_5194",
                  "maker": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "makerAmountFilled": 2500000n,
                  "market_id": "102936224134271070189104847090829839924697394514566827387181305960175107677216",
                  "metadata": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "orderHash": "0xdca4a82478b15484522636905a5cc2a85fe7b34b4d1e1fdcc24d700bcca6f68e",
                  "side": 0,
                  "taker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "takerAmountFilled": 5000000n,
                  "timestamp": 1775221327,
                  "tokenId": 102936224134271070189104847090829839924697394514566827387181305960175107677216n,
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                  "txFrom": "0x2f1CC78B6945d57c342273d42f13cdB5488FEb15",
                },
                {
                  "blockNumber": 85050645,
                  "builder": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "fee": 0n,
                  "id": "137_85050645_5196",
                  "maker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "makerAmountFilled": 2500000n,
                  "market_id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "metadata": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "orderHash": "0x2817eef50ab3aef3fc394856b3cf8d8712a36d267bf37fe9115f3deb987f7d55",
                  "side": 0,
                  "taker": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "takerAmountFilled": 5000000n,
                  "timestamp": 1775221327,
                  "tokenId": 45763018441764333771124945243746174684578244015331389396782339063349542289693n,
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                  "txFrom": "0x2f1CC78B6945d57c342273d42f13cdB5488FEb15",
                },
              ],
            },
            "OrderMatch": {
              "sets": [
                {
                  "blockNumber": 85050645,
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "id": "137_85050645_5197",
                  "makerAmountFilled": 2500000n,
                  "market_id": "45763018441764333771124945243746174684578244015331389396782339063349542289693",
                  "side": 0,
                  "takerAmountFilled": 5000000n,
                  "takerOrderHash": "0x2817eef50ab3aef3fc394856b3cf8d8712a36d267bf37fe9115f3deb987f7d55",
                  "takerOrderMaker": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "timestamp": 1775221327,
                  "tokenId": 45763018441764333771124945243746174684578244015331389396782339063349542289693n,
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                },
              ],
            },
            "PolyUSDAccount": {
              "sets": [
                {
                  "balance": -5000000n,
                  "id": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": -5000000n,
                  "id": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": 0n,
                  "id": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": 0n,
                  "id": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "totalUnwrapped": 0n,
                  "totalWrapped": 0n,
                },
                {
                  "balance": 0n,
                  "id": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "totalUnwrapped": 10000000n,
                  "totalWrapped": 0n,
                },
              ],
            },
            "PolyUSDStats": {
              "sets": [
                {
                  "id": "polyusd",
                  "totalSupply": -10000000n,
                  "totalTransfers": 8n,
                  "totalUnwrapped": 10000000n,
                  "totalWrapped": 0n,
                },
              ],
            },
            "PolyUSDTransfer": {
              "sets": [
                {
                  "amount": 2500000n,
                  "blockNumber": 85050645,
                  "from": "0xd74b83e161d23ef17C6247d4b2f6Be07160cEd75",
                  "id": "137_85050645_5181",
                  "timestamp": 1775221327,
                  "to": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                },
                {
                  "amount": 2500000n,
                  "blockNumber": 85050645,
                  "from": "0x6e0c80c90ea6c15917308F820Eac91Ce2724B5b5",
                  "id": "137_85050645_5182",
                  "timestamp": 1775221327,
                  "to": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                },
                {
                  "amount": 5000000n,
                  "blockNumber": 85050645,
                  "from": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "id": "137_85050645_5183",
                  "timestamp": 1775221327,
                  "to": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                },
                {
                  "amount": 5000000n,
                  "blockNumber": 85050645,
                  "from": "0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB",
                  "id": "137_85050645_5186",
                  "timestamp": 1775221327,
                  "to": "0x0000000000000000000000000000000000000000",
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                },
              ],
            },
            "PolyUSDWrap": {
              "sets": [
                {
                  "amount": 5000000n,
                  "asset": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                  "blockNumber": 85050645,
                  "caller": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "eventType": "unwrap",
                  "id": "137_85050645_5187",
                  "timestamp": 1775221327,
                  "to": "0xADa100874d00e3331D00F2007a9c336a65009718",
                  "transactionHash": "0xc119e7e1d138c93b94f0a398e5db8fe3b20fb380ca5829b647566c038ad731c9",
                },
              ],
            },
            "block": 85050645,
            "chainId": 137,
            "eventsProcessed": 8,
          },
        ],
      }
    `);

    const allStats = await indexer.ExchangeStats.getAll();
    t.expect(allStats.length).toBeGreaterThanOrEqual(1);
    t.expect(allStats[0]!.totalOrdersFilled).toBeGreaterThanOrEqual(1n);
    t.expect(allStats[0]!.totalOrdersMatched).toBeGreaterThanOrEqual(1n);
  });

  it("indexes OrderFilled with builder codes via simulate", async (t) => {
    const indexer = createTestIndexer();

    t.expect(
      await indexer.process({
        chains: {
          137: {
            simulate: [
              {
                contract: "CTFExchangeV2",
                event: "OrderFilled",
                params: {
                  orderHash: "0xaaaa000000000000000000000000000000000000000000000000000000000001",
                  maker: "0x1111111111111111111111111111111111111111",
                  taker: "0x2222222222222222222222222222222222222222",
                  side: 0n,  // BUY
                  tokenId: 12345n,
                  makerAmountFilled: 5000000n,  // 5 pUSD
                  takerAmountFilled: 10000000n, // 10 pUSD
                  fee: 50000n,
                  builder: "0xbbbb000000000000000000000000000000000000000000000000000000000001",
                  metadata: "0x0000000000000000000000000000000000000000000000000000000000000000",
                },
              },
            ],
          },
        },
      }),
      "Should index fill with non-zero builder code and increment totalBuilderFills"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "ExchangeStats": {
              "sets": [
                {
                  "id": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "totalBuilderFills": 1n,
                  "totalFees": 50000n,
                  "totalOrdersFilled": 1n,
                  "totalOrdersMatched": 0n,
                  "totalVolume": 5000000n,
                },
              ],
            },
            "OrderFill": {
              "sets": [
                {
                  "blockNumber": 84902320,
                  "builder": "0xbbbb000000000000000000000000000000000000000000000000000000000001",
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "fee": 50000n,
                  "id": "137_84902320_0",
                  "maker": "0x1111111111111111111111111111111111111111",
                  "makerAmountFilled": 5000000n,
                  "market_id": undefined,
                  "metadata": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "orderHash": "0xaaaa000000000000000000000000000000000000000000000000000000000001",
                  "side": 0,
                  "taker": "0x2222222222222222222222222222222222222222",
                  "takerAmountFilled": 10000000n,
                  "timestamp": 0,
                  "tokenId": 12345n,
                  "transactionHash": "",
                  "txFrom": "",
                },
              ],
            },
            "block": 84902320,
            "chainId": 137,
            "eventsProcessed": 1,
          },
        ],
      }
    `);

    const allStats = await indexer.ExchangeStats.getAll();
    const stats = allStats[0]!;
    t.expect(stats.totalBuilderFills).toBe(1n);
    t.expect(stats.totalFees).toBe(50000n);
    t.expect(stats.totalVolume).toBe(5000000n);
  });

  it("indexes OrdersMatched via simulate", async (t) => {
    const indexer = createTestIndexer();

    t.expect(
      await indexer.process({
        chains: {
          137: {
            simulate: [
              {
                contract: "CTFExchangeV2",
                event: "OrdersMatched",
                params: {
                  takerOrderHash: "0xcccc000000000000000000000000000000000000000000000000000000000001",
                  takerOrderMaker: "0x3333333333333333333333333333333333333333",
                  side: 1n,  // SELL
                  tokenId: 67890n,
                  makerAmountFilled: 3000000n,
                  takerAmountFilled: 6000000n,
                },
              },
            ],
          },
        },
      }),
      "Should index an order match with side=SELL"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "ExchangeStats": {
              "sets": [
                {
                  "id": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "totalBuilderFills": 0n,
                  "totalFees": 0n,
                  "totalOrdersFilled": 0n,
                  "totalOrdersMatched": 1n,
                  "totalVolume": 0n,
                },
              ],
            },
            "OrderMatch": {
              "sets": [
                {
                  "blockNumber": 84902320,
                  "exchange": "0xE111180000d2663C0091e4f400237545B87B996B",
                  "id": "137_84902320_0",
                  "makerAmountFilled": 3000000n,
                  "market_id": undefined,
                  "side": 1,
                  "takerAmountFilled": 6000000n,
                  "takerOrderHash": "0xcccc000000000000000000000000000000000000000000000000000000000001",
                  "takerOrderMaker": "0x3333333333333333333333333333333333333333",
                  "timestamp": 0,
                  "tokenId": 67890n,
                  "transactionHash": "",
                },
              ],
            },
            "block": 84902320,
            "chainId": 137,
            "eventsProcessed": 1,
          },
        ],
      }
    `);
  });

  it("accumulates exchange stats across fills", async (t) => {
    const indexer = createTestIndexer();

    await indexer.process({
      chains: {
        137: {
          simulate: [
            {
              contract: "CTFExchangeV2",
              event: "OrderFilled",
              params: {
                orderHash: "0x0000000000000000000000000000000000000000000000000000000000000001",
                maker: "0x1111111111111111111111111111111111111111",
                taker: "0x2222222222222222222222222222222222222222",
                side: 0n,
                tokenId: 1n,
                makerAmountFilled: 1000000n,
                takerAmountFilled: 2000000n,
                fee: 10000n,
                builder: "0x0000000000000000000000000000000000000000000000000000000000000000",
                metadata: "0x0000000000000000000000000000000000000000000000000000000000000000",
              },
            },
            {
              contract: "CTFExchangeV2",
              event: "OrderFilled",
              params: {
                orderHash: "0x0000000000000000000000000000000000000000000000000000000000000002",
                maker: "0x3333333333333333333333333333333333333333",
                taker: "0x4444444444444444444444444444444444444444",
                side: 1n,
                tokenId: 2n,
                makerAmountFilled: 5000000n,
                takerAmountFilled: 10000000n,
                fee: 25000n,
                builder: "0xaaaa000000000000000000000000000000000000000000000000000000000001",
                metadata: "0x0000000000000000000000000000000000000000000000000000000000000000",
              },
            },
            {
              contract: "CTFExchangeV2",
              event: "OrdersMatched",
              params: {
                takerOrderHash: "0x0000000000000000000000000000000000000000000000000000000000000003",
                takerOrderMaker: "0x5555555555555555555555555555555555555555",
                side: 0n,
                tokenId: 1n,
                makerAmountFilled: 500000n,
                takerAmountFilled: 1000000n,
              },
            },
          ],
        },
      },
    });

    const allStats = await indexer.ExchangeStats.getAll();
    t.expect(allStats.length).toBe(1);
    const stats = allStats[0]!;
    t.expect(stats.totalOrdersFilled).toBe(2n);
    t.expect(stats.totalOrdersMatched).toBe(1n);
    t.expect(stats.totalVolume).toBe(6000000n);     // 1M + 5M
    t.expect(stats.totalFees).toBe(35000n);          // 10K + 25K
    t.expect(stats.totalBuilderFills).toBe(1n);      // only second fill has builder
  });
});
