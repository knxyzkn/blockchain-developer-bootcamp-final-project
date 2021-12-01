# Design Patterns Used

## Access Control Design Patterns
Used OpenZeppelin's `Ownable` contract to create a smart contract function that allows only the admin (contract owner) to update the name of an existing category pool.

## Optimizing Gas
Created efficient solidity code by avoiding costly computations. Even though an array is used to store list of category pools, a loop was never used to run though the array. Instead, decided to identify category pools by Id for quick array lookup. Furthermore, client code is used to run a loop off-chain and inexpensively read on-chain data by looking up array indexes. Decision was also made to implement all field validations in the client code to avoid making similar validations in the contract code. All values passed as params to the contract code are valid values.

## Oracles
Used Chainlink's `ETH/USD` data feeds to obtain real-time conversion rates. Attempted to implement this using Solidity and Web3.js, but was unsuccessful.
