# Ethers-example

This is an example of a project using [Ethers](https://docs.ethers.io/v5/getting-started/) to interact with the Ethereum blockchain.

We integrate the Ethers with MetaMask and trying to connect/disconnect to the wallet and change the account.
We are able to get the active address and get the balance.

We used [ganache-cli](https://github.com/celo-org/ganache-cli) to create a test Ethereum blockchain to test.
You could install it using `npm i -g ganache-cli && ganache-cli`.
See [MetaMask](https://docs.metamask.io/guide/getting-started.html#basic-considerations) for more information.

## Run

Start a test network using ganache-cli.

Run `yarn install && yarn start` to start this project.

Connect the wallet using Localhost:8545 at MetaMask. Restore the account to the wallet.

## Known issues

Failed when we are trying to transfer to another account.
