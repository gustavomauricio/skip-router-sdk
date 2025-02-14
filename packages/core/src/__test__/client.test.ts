import { rest } from "msw";
import { setupServer } from "msw/node";

import { SKIP_API_URL, SkipRouter } from "../client";
import { Chain, ChainJSON } from "../types/types";

export const server = setupServer();

describe("client", () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  describe("/v1/info/chains", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.money/v1/info/chains", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              chains: [
                {
                  chain_name: "osmosis",
                  chain_id: "osmosis-1",
                  pfm_enabled: true,
                  cosmos_sdk_version: "v0.47.3",
                  modules: {
                    "github.com/cosmos/ibc-go": {
                      path: "github.com/cosmos/ibc-go/v4",
                      version: "v4.3.1",
                      sum: "h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=",
                    },
                    "github.com/osmosis-labs/osmosis/x/ibc-hooks": {
                      path: "github.com/osmosis-labs/osmosis/x/ibc-hooks",
                      version: "v0.0.7",
                      sum: "h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=",
                    },
                    "github.com/strangelove-ventures/packet-forward-middleware":
                      {
                        path: "github.com/strangelove-ventures/packet-forward-middleware/v4",
                        version: "v4.0.5",
                        sum: "h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=",
                      },
                  },
                  cosmos_module_support: {
                    authz: true,
                    feegrant: false,
                  },
                  supports_memo: true,
                  logo_uri:
                    "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
                  bech32_prefix: "osmo",
                  fee_assets: [
                    {
                      denom: "uosmo",
                      gas_price: {
                        low: "0.0025",
                        average: "0.025",
                        high: "0.04",
                      },
                    },
                  ],
                },
              ] as ChainJSON[],
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.chains();

      expect(response).toEqual([
        {
          chainName: "osmosis",
          chainID: "osmosis-1",
          pfmEnabled: true,
          cosmosSDKVersion: "v0.47.3",
          modules: {
            "github.com/cosmos/ibc-go": {
              path: "github.com/cosmos/ibc-go/v4",
              version: "v4.3.1",
              sum: "h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=",
            },
            "github.com/osmosis-labs/osmosis/x/ibc-hooks": {
              path: "github.com/osmosis-labs/osmosis/x/ibc-hooks",
              version: "v0.0.7",
              sum: "h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=",
            },
            "github.com/strangelove-ventures/packet-forward-middleware": {
              path: "github.com/strangelove-ventures/packet-forward-middleware/v4",
              version: "v4.0.5",
              sum: "h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=",
            },
          },
          cosmosModuleSupport: {
            authz: true,
            feegrant: false,
          },
          supportsMemo: true,
          logoURI:
            "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
          bech32Prefix: "osmo",
          feeAssets: [
            {
              denom: "uosmo",
              gasPrice: {
                low: "0.0025",
                average: "0.025",
                high: "0.04",
              },
            },
          ],
        },
      ] as Chain[]);
    });
  });

  describe("/v1/fungible/assets", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.money/v1/fungible/assets", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              chain_to_assets_map: {
                "cosmoshub-4": {
                  assets: [
                    {
                      denom:
                        "ibc/6B8A3F5C2AD51CD6171FA41A7E8C35AD594AB69226438DB94450436EA57B3A89",
                      chain_id: "cosmoshub-4",
                      origin_denom: "ustrd",
                      origin_chain_id: "stride-1",
                      is_cw20: false,
                      trace: "transfer/channel-391",
                      symbol: "STRD",
                      name: "STRD",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/stride/asset/strd.png",
                      decimals: 6,
                    },
                    {
                      denom: "uatom",
                      chain_id: "cosmoshub-4",
                      origin_denom: "uatom",
                      origin_chain_id: "cosmoshub-4",
                      is_cw20: false,
                      trace: "",
                      symbol: "ATOM",
                      name: "ATOM",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/cosmos/asset/atom.png",
                      decimals: 6,
                    },
                  ],
                },
                "osmosis-1": {
                  assets: [
                    {
                      denom: "uosmo",
                      chain_id: "osmosis-1",
                      origin_denom: "uosmo",
                      origin_chain_id: "osmosis-1",
                      is_cw20: false,
                      trace: "",
                      symbol: "OSMO",
                      name: "OSMO",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                      decimals: 6,
                    },
                  ],
                },
              },
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const assets = await client.assets();

      expect(assets).toEqual({
        "cosmoshub-4": [
          {
            denom:
              "ibc/6B8A3F5C2AD51CD6171FA41A7E8C35AD594AB69226438DB94450436EA57B3A89",
            chainID: "cosmoshub-4",
            originDenom: "ustrd",
            originChainID: "stride-1",
            isCW20: false,
            trace: "transfer/channel-391",
            symbol: "STRD",
            name: "STRD",
            logoURI:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/stride/asset/strd.png",
            decimals: 6,
          },
          {
            denom: "uatom",
            chainID: "cosmoshub-4",
            originDenom: "uatom",
            originChainID: "cosmoshub-4",
            isCW20: false,
            trace: "",
            symbol: "ATOM",
            name: "ATOM",
            logoURI:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/cosmos/asset/atom.png",
            decimals: 6,
          },
        ],
        "osmosis-1": [
          {
            denom: "uosmo",
            chainID: "osmosis-1",
            originDenom: "uosmo",
            originChainID: "osmosis-1",
            isCW20: false,
            trace: "",
            symbol: "OSMO",
            name: "OSMO",
            logoURI:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
      });
    });

    it("handles 200 OK - with parameters", async () => {
      server.use(
        rest.get(
          "https://api.skip.money/v1/fungible/assets",
          (req, res, ctx) => {
            const chainID = req.url.searchParams.get("chain_id");
            const nativeOnly = req.url.searchParams.get("native_only");
            const includeNoMetadataAssets = req.url.searchParams.get(
              "include_no_metadata_assets",
            );

            if (chainID && nativeOnly && includeNoMetadataAssets) {
              return res(
                ctx.status(200),
                ctx.json({
                  chain_to_assets_map: {
                    "osmosis-1": {
                      assets: [
                        {
                          denom: "uosmo",
                          chain_id: "osmosis-1",
                          origin_denom: "uosmo",
                          origin_chain_id: "osmosis-1",
                          is_cw20: false,
                          trace: "",
                          symbol: "OSMO",
                          name: "OSMO",
                          logo_uri:
                            "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                          decimals: 6,
                        },
                      ],
                    },
                  },
                }),
              );
            }

            return res(
              ctx.status(500),
              ctx.json({ message: "should not have reached this" }),
            );
          },
        ),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const assets = await client.assets({
        chainID: "osmosis-1",
        nativeOnly: true,
        includeNoMetadataAssets: true,
      });

      expect(assets).toEqual({
        "osmosis-1": [
          {
            denom: "uosmo",
            chainID: "osmosis-1",
            originDenom: "uosmo",
            originChainID: "osmosis-1",
            trace: "",
            isCW20: false,
            symbol: "OSMO",
            name: "OSMO",
            logoURI:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
      });
    });

    it("handles 400 Bad Request", async () => {
      server.use(
        rest.get("https://api.skip.money/v1/fungible/assets", (_, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              code: 3,
              message: "Invalid chain_id",
              details: [],
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      await expect(client.assets()).rejects.toThrow("Invalid chain_id");
    });

    it("handles 500 Internal Server Error", async () => {
      server.use(
        rest.get("https://api.skip.money/v1/fungible/assets", (_, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: "internal server error",
              details: [],
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      await expect(client.assets()).rejects.toThrow("internal server error");
    });
  });

  describe("/v1/fungible/assets_from_source", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post(
          "https://api.skip.money/v1/fungible/assets_from_source",
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                dest_assets: {
                  "osmosis-1": {
                    assets: [
                      {
                        denom:
                          "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
                        chain_id: "cosmoshub-4",
                        origin_denom: "uosmo",
                        origin_chain_id: "osmosis-1",
                        trace: "transfer/channel-141",
                        symbol: "OSMO",
                        name: "OSMO",
                        logo_uri:
                          "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                        decimals: 6,
                      },
                    ],
                  },
                  "neutron-1": {
                    assets: [
                      {
                        denom:
                          "ibc/376222D6D9DAE23092E29740E56B758580935A6D77C24C2ABD57A6A78A1F3955",
                        chain_id: "neutron-1",
                        origin_denom: "uosmo",
                        origin_chain_id: "osmosis-1",
                        trace: "transfer/channel-10",
                        symbol: "OSMO",
                        name: "OSMO",
                        logo_uri:
                          "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                        decimals: 6,
                      },
                    ],
                  },
                },
              }),
            );
          },
        ),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const assetsFromSource = await client.assetsFromSource({
        sourceAssetChainID: "osmosis-1",
        sourceAssetDenom: "uosmo",
      });

      expect(assetsFromSource).toEqual({
        "osmosis-1": [
          {
            denom:
              "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
            chainID: "cosmoshub-4",
            originDenom: "uosmo",
            originChainID: "osmosis-1",
            trace: "transfer/channel-141",
            symbol: "OSMO",
            name: "OSMO",
            logoURI:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
        "neutron-1": [
          {
            denom:
              "ibc/376222D6D9DAE23092E29740E56B758580935A6D77C24C2ABD57A6A78A1F3955",
            chainID: "neutron-1",
            originDenom: "uosmo",
            originChainID: "osmosis-1",
            trace: "transfer/channel-10",
            symbol: "OSMO",
            name: "OSMO",
            logoURI:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
      });
    });

    it("handles 400 Bad Request", async () => {
      server.use(
        rest.post(
          "https://api.skip.money/v1/fungible/assets_from_source",
          (_, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                code: 3,
                message: "Invalid source_asset_chain_id",
                details: [],
              }),
            );
          },
        ),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      await expect(
        client.assetsFromSource({
          sourceAssetChainID: "osmosis-1",
          sourceAssetDenom: "uosmo",
        }),
      ).rejects.toThrow("Invalid source_asset_chain_id");
    });

    it("handles 500 Internal Server Error", async () => {
      server.use(
        rest.post(
          "https://api.skip.money/v1/fungible/assets_from_source",
          (_, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({
                code: 2,
                message: "internal server error",
                details: [],
              }),
            );
          },
        ),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      await expect(
        client.assetsFromSource({
          sourceAssetChainID: "osmosis-1",
          sourceAssetDenom: "uosmo",
        }),
      ).rejects.toThrow("internal server error");
    });
  });

  describe("/v1/fungible/recommend_assets", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post(
          "https://api.skip.money/v1/fungible/recommend_assets",
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                recommendations: [
                  {
                    asset: {
                      denom:
                        "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
                      chain_id: "cosmoshub-4",
                      origin_denom: "uosmo",
                      origin_chain_id: "osmosis-1",
                      trace: "transfer/channel-141",
                      symbol: "OSMO",
                      name: "OSMO",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                      decimals: 6,
                    },
                    reason: "MOST_LIQUID",
                  },
                ],
              }),
            );
          },
        ),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.recommendAssets({
        sourceAssetChainID: "osmosis-1",
        sourceAssetDenom: "uosmo",
        destChainID: "cosmoshub-4",
      });

      expect(response).toEqual([
        {
          asset: {
            denom:
              "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
            chainID: "cosmoshub-4",
            originDenom: "uosmo",
            originChainID: "osmosis-1",
            trace: "transfer/channel-141",
            symbol: "OSMO",
            name: "OSMO",
            logoURI:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
          reason: "MOST_LIQUID",
        },
      ]);
    });
  });

  describe("/v1/fungible/msgs", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.money/v1/fungible/msgs", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              msgs: [
                {
                  chain_id: "osmosis-1",
                  path: ["osmosis-1", "cosmoshub-4"],
                  msg: '{"sender":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"54946"},"timeout_timestamp":1693012979767514087,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"1000000"}]}',
                  msg_type_url: "/cosmwasm.wasm.v1.MsgExecuteContract",
                },
              ],
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.messages({
        sourceAssetDenom: "uosmo",
        sourceAssetChainID: "osmosis-1",
        destAssetDenom: "uatom",
        destAssetChainID: "cosmoshub-4",
        amountIn: "1000000",
        amountOut: "54946",
        operations: [
          {
            swap: {
              swapIn: {
                swapVenue: {
                  name: "osmosis-poolmanager",
                  chainID: "osmosis-1",
                },
                swapOperations: [
                  {
                    pool: "1",
                    denomIn: "uosmo",
                    denomOut:
                      "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                  },
                ],
                swapAmountIn: "1000000",
              },
              estimatedAffiliateFee:
                "0ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
            },
          },
          {
            transfer: {
              port: "transfer",
              channel: "channel-0",
              chainID: "osmosis-1",
              pfmEnabled: true,
              destDenom: "uatom",
              supportsMemo: true,
            },
          },
        ],
        addressList: [
          "osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e",
          "cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet",
        ],
        estimatedAmountOut: "54946",
      });

      expect(response).toEqual([
        {
          chainID: "osmosis-1",
          path: ["osmosis-1", "cosmoshub-4"],
          msg: '{"sender":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"54946"},"timeout_timestamp":1693012979767514087,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"1000000"}]}',
          msgTypeURL: "/cosmwasm.wasm.v1.MsgExecuteContract",
        },
      ]);
    });
  });

  describe("/v1/fungible/route", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.money/v1/fungible/route", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              source_asset_denom: "uosmo",
              source_asset_chain_id: "osmosis-1",
              dest_asset_denom: "uatom",
              dest_asset_chain_id: "cosmoshub-4",
              amount_in: "1000000",
              amount_out: "54906",
              operations: [
                {
                  swap: {
                    swap_in: {
                      swap_venue: {
                        name: "neutron-astroport",
                        chain_id: "neutron-1",
                      },
                      swap_operations: [
                        {
                          pool: "pool-0",
                          denom_in: "uosmo",
                          denom_out: "uatom",
                        },
                      ],
                      swap_amount_in: "1000000",
                    },
                    estimated_affiliate_fee: "1000000",
                  },
                },
                {
                  transfer: {
                    port: "transfer",
                    channel: "channel-0",
                    chain_id: "osmosis-1",
                    pfm_enabled: true,
                    dest_denom: "uatom",
                    supports_memo: true,
                  },
                },
              ],
              chain_ids: ["osmosis-1", "cosmoshub-4"],
              does_swap: true,
              estimated_amount_out: "54906",
              swap_venue: {
                name: "osmosis-poolmanager",
                chain_id: "osmosis-1",
              },
              txs_required: 1,
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.route({
        sourceAssetChainID: "osmosis-1",
        sourceAssetDenom: "uosmo",
        destAssetChainID: "cosmoshub-4",
        destAssetDenom: "uatom",
        amountIn: "1000000",
      });

      expect(response).toEqual({
        sourceAssetDenom: "uosmo",
        sourceAssetChainID: "osmosis-1",
        destAssetDenom: "uatom",
        destAssetChainID: "cosmoshub-4",
        amountIn: "1000000",
        amountOut: "54906",
        operations: [
          {
            swap: {
              swapIn: {
                swapVenue: {
                  name: "neutron-astroport",
                  chainID: "neutron-1",
                },
                swapOperations: [
                  {
                    pool: "pool-0",
                    denomIn: "uosmo",
                    denomOut: "uatom",
                  },
                ],
                swapAmountIn: "1000000",
              },
              estimatedAffiliateFee: "1000000",
            },
          },
          {
            transfer: {
              port: "transfer",
              channel: "channel-0",
              chainID: "osmosis-1",
              pfmEnabled: true,
              destDenom: "uatom",
              supportsMemo: true,
            },
          },
        ],
        chainIDs: ["osmosis-1", "cosmoshub-4"],
        doesSwap: true,
        estimatedAmountOut: "54906",
        swapVenue: { name: "osmosis-poolmanager", chainID: "osmosis-1" },
        txsRequired: 1,
      });
    });
  });

  describe("/v1/fungible/venues", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.money/v1/fungible/venues", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              venues: [
                {
                  name: "neutron-astroport",
                  chain_id: "neutron-1",
                },
                {
                  name: "osmosis-poolmanager",
                  chain_id: "osmosis-1",
                },
              ],
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.venues();

      expect(response).toEqual([
        {
          name: "neutron-astroport",
          chainID: "neutron-1",
        },
        {
          name: "osmosis-poolmanager",
          chainID: "osmosis-1",
        },
      ]);
    });
  });

  describe("submitTransaction", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.money/v1/tx/submit", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              tx_hash: "tx_hash123",
              success: true,
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.submitTransaction({
        chainID: "cosmoshub-4",
        tx: "txbytes123",
      });

      expect(response).toEqual({
        txHash: "tx_hash123",
        success: true,
      });
    });
  });

  describe("trackTransaction", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.money/v1/tx/track", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              tx_hash: "tx_hash123",
              success: true,
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.trackTransaction({
        chainID: "cosmoshub-4",
        txHash: "tx_hash123",
      });

      expect(response).toEqual({
        txHash: "tx_hash123",
        success: true,
      });
    });
  });

  describe("transactionStatus", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.money/v1/tx/status", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              status: "STATE_COMPLETED",
              transfer_sequence: [
                {
                  src_chain_id: "axelar-dojo-1",
                  dst_chain_id: "osomosis-1",
                  state: "TRANSFER_SUCCESS",
                  packet_txs: {
                    send_tx: {
                      chain_id: "axelar-dojo-1",
                      tx_hash:
                        "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
                    },
                    receive_tx: {
                      chain_id: "osmosis-1",
                      tx_hash:
                        "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
                    },
                    acknowledge_tx: {
                      chain_id: "axelar-dojo-1",
                      tx_hash:
                        "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
                    },
                    timeout_tx: null,
                    error: null,
                  },
                },
                {
                  src_chain_id: "osmosis-1",
                  dst_chain_id: "cosmoshub-4",
                  state: "TRANSFER_SUCCESS",
                  packet_txs: {
                    send_tx: {
                      chain_id: "osmosis-1",
                      tx_hash:
                        "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
                    },
                    receive_tx: {
                      chain_id: "cosmoshub-4",
                      tx_hash:
                        "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
                    },
                    acknowledge_tx: {
                      chain_id: "osmosis-1",
                      tx_hash:
                        "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
                    },
                    timeout_tx: null,
                    error: null,
                  },
                },
              ],
              next_blocking_transfer: null,
              transfer_asset_release: {
                chain_id: "cosmoshub-4",
                denom: "uatom",
              },
              error: null,
            }),
          );
        }),
      );

      const client = new SkipRouter({
        apiURL: SKIP_API_URL,
      });

      const response = await client.transactionStatus({
        chainID: "cosmoshub-4",
        txHash: "tx_hash123",
      });

      expect(response).toEqual({
        status: "STATE_COMPLETED",
        transferSequence: [
          {
            srcChainID: "axelar-dojo-1",
            dstChainID: "osomosis-1",
            state: "TRANSFER_SUCCESS",
            packetTXs: {
              sendTx: {
                chainID: "axelar-dojo-1",
                txHash:
                  "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              },
              receiveTx: {
                chainID: "osmosis-1",
                txHash:
                  "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              },
              acknowledgeTx: {
                chainID: "axelar-dojo-1",
                txHash:
                  "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              },
              timeoutTx: null,
              error: null,
            },
          },
          {
            srcChainID: "osmosis-1",
            dstChainID: "cosmoshub-4",
            state: "TRANSFER_SUCCESS",
            packetTXs: {
              sendTx: {
                chainID: "osmosis-1",
                txHash:
                  "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              },
              receiveTx: {
                chainID: "cosmoshub-4",
                txHash:
                  "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              },
              acknowledgeTx: {
                chainID: "osmosis-1",
                txHash:
                  "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              },
              timeoutTx: null,
              error: null,
            },
          },
        ],
        nextBlockingTransfer: null,
        transferAssetRelease: {
          chainID: "cosmoshub-4",
          denom: "uatom",
        },
        error: null,
      });
    });
  });
});
