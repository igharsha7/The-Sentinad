**What is Monad?**

Monad is a high-performance EVM-compatible Layer 1 blockchain designed for exceptional throughput and low transaction costs. It addresses the limitations of existing EVM implementations by introducing parallel execution and other optimizations, enabling developers to build a new generation of decentralized applications that can scale to meet real-world demand.

**Monad's Accelerated EVM:**

The Monad Accelerated EVM unlocks new possibilities for decentralized applications by significantly increasing throughput and reducing transaction costs, all without requiring developers to learn new languages or tools. This means you can build faster, more efficient dApps without sacrificing the familiarity and security of the EVM.

**Quick Links:**

[**Build on Monad**](https://monad.xyz/build)

[**Monad Docs**](https://docs.monad.xyz/)

### Monad Network Details

- https://docs.monad.xyz/developer-essentials/network-information
- https://docs.monad.xyz/developer-essentials/testnets

### Canonical Smart Contract Addresses

- [Mainnet contract addresses](https://docs.monad.xyz/developer-essentials/network-information#canonical-contracts)
- [Testnet contract addresses](https://docs.monad.xyz/developer-essentials/network-information#canonical-contracts)
- [Contract address of protocols deployed on Monad](https://github.com/monad-crypto/protocols) ⭐️
- [Monad token list](https://github.com/monad-crypto/token-list) ⭐️

### Useful Guides

- [Deploying smart contracts](https://docs.monad.xyz/guides/deploy-smart-contract/)
- [Verifying smart contracts](https://docs.monad.xyz/guides/verify-smart-contract/)
- [x402 guide](https://docs.monad.xyz/guides/x402-guide) ⭐️

### Recommended Practices for Submitting Transactions & Queries
⛽️ Gas price ***must*** be set to a base fee of a minimum of `100 gwei` (in MON terms). You can set it higher as well but it shouldn’t be necessary.

- For fetching transaction receipts use `eth_getBlockReceipts` instead of `eth_getTransactionReceipt` to get receipts for all transactions in a block at once.
- For fetching all transaction details included in a block use `eth_getBlockByNumber(number, hydrated=True)` instead of `eth_getTransactionByHash`
- Similarly, use `debug_traceBlockByNumber` instead of `debug_traceTransaction` to get traces of all transactions included in a block in one call request.

### Account Abstraction / Social Login / Embedded Wallets

[Send a transaction](https://docs.privy.io/wallets/using-wallets/ethereum/send-a-transaction)

[Sponsoring transactions on Monad](https://docs.privy.io/wallets/gas-and-asset-management/gas/ethereum) (make sure to change configuration to Monad)

https://docs.pimlico.io/guides/tutorials/tutorial-1

[Privy API reference](https://docs.privy.io/api-reference/introduction)

https://docs.pimlico.io/guides/how-to/signers/privy

### Cross Chain

[CCIP Lanes Monad Mainnet](https://docs.chain.link/ccip/directory/mainnet)

[CCIP Lanes Monad Testnet](https://docs.chain.link/ccip/directory/testnet/chain/monad-testnet)

[CCIP Getting Started](https://docs.chain.link/ccip/getting-started)

[LayerZero Deployments](https://docs.layerzero.network/v2/deployments/deployed-contracts?chains=monad)

[LayerZero Getting Started](https://docs.layerzero.network/v2/developers/evm/getting-started)

### Indexers

[Using Envio HyperIndex](https://docs.monad.xyz/guides/indexers/tg-bot-using-envio)

[QuickNode streams guide](https://docs.monad.xyz/guides/indexers/quicknode-streams)

### APIs / NFT API / Portfolio API

[NFT Holders](https://docs.codex.io/reference/nftholders)

[Wallet NFT Collections](https://docs.codex.io/reference/walletnftcollections)

[NFT Collection Metadata](https://docs.codex.io/reference/getnftcollectionmetadata)

[Get wallet's portfolio](https://developers.zerion.io/reference/getwalletportfolio)

[Get list of wallet's transactions](https://developers.zerion.io/reference/listwallettransactions)

[Get wallet's NFT portfolio](https://developers.zerion.io/reference/getwalletnftportfolio)

[Alchemy NFT API](https://www.alchemy.com/docs/reference/nft-api-quickstart) (testnet only)

[Alchemy Portfolio API](https://www.alchemy.com/docs/reference/portfolio-apis) (testnet only) 

[Alchemy Token API](https://www.alchemy.com/docs/reference/token-api-quickstart) (testnet only)

[Alchemy Webhooks](https://www.alchemy.com/docs/reference/notify-api-quickstart) (testnet only)

### Oracles

[Chainlink Data Streams](https://docs.chain.link/data-streams)

[Pyth Price Feeds](https://www.pyth.network/developers/price-feed-ids)

[Pyth Oracle Addresses](https://docs.pyth.network/price-feeds/contract-addresses/evm)

### Monad Internals

- https://docs.monad.xyz/monad-arch/consensus/monad-bft
- https://docs.monad.xyz/monad-arch/consensus/asynchronous-execution
- https://docs.monad.xyz/monad-arch/execution/parallel-execution
- https://docs.monad.xyz/monad-arch/execution/monaddb
- https://docs.monad.xyz/monad-arch/execution/native-compilation
- https://docs.monad.xyz/monad-arch/realtime-data/