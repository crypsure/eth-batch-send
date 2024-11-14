# Batch Sender

Frontend and contract code for sending a batch of ERC20 transfers.

**[https://batch.crypsure.app](https://batch.crypsure.app)**

## Usage

The contract is available on Ethereum mainnet at:

[Insert etherscan link]

### Contracts

See the [contracts readme](./contracts)

### Frontend

See the [frontend readme](./frontend)

## Development

Install Foundry: https://book.getfoundry.sh/getting-started/installation

Run a local Eth testnet (`--chain-id 1337` is required, otherwise MetaMask transactions will fail):

```bash
anvil --chain-id 1337
```

Deploy the BatchSender contract:

```bash
forge script script/BatchSend.s.sol:BatchSendScript --rpc-url "http://127.0.0.1:8545" --private-key "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
```

Run the frontend:

```bash
cd frontend
npm run dev
```
