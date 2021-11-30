# Consensys Blockchain Developer Bootcamp Final Project

## Crypto Donater by Kaushik Nagaraj

1. Donors can donate crypto to category pools (such as R&D, Admin, Logistics, Technology, etc.) held in the smart contract.
2. Charity organizations can transfer funds from the smart contract to their charity organization's address when the need arises.
3. If the balance of a category pool is insufficient, then charity orgs can update need so that donors can donate to category pools accordingly. Charity orgs can also create new category pools.
4. Admin can update name of an existing category pool.

Note: Effort has been made to communicate the above through the Dapp UI with descriptive text where appropriate.

## Link to Dapp

URL: https://crypto-donater.vercel.app/

## User Journey

1. Visit Crypto Donater Dapp.
2. You will see an intro page. Follow the instructions. Open MetaMask and connect your account (please select Rinkeby Test Network).
3. You'll be taken to the main page. Read through the descriptive text.
4. Review the Category Pool Table.
5. **Donor**: If you're a donor, you can donate by following the instructions to submit the form. A transaction will be initiated when you click 'Donate,' assuming all validations pass. Once the transaction is complete, the category pool table will update with the latest values read from the blockchain.
6. **Charity Organization**: If you're a charity organization, you can perform the below mentioned actions. In both cases, please follow the instructions to submit the form. A transaction will be initiated when you click 'Create Category Pool' or 'Update Category Need,' assuming all validations pass. Once the transaction is complete, the category pool table will update with the latest values read from the blockchain.
  - Create a new category pool.
  - Update the need of an existing category pool.
7. **Admin**: If you're the admin (the owner of the smart contract), you can update the names of the category pools. This has not yet been implemented on the UI, but it has been implemented/tested as a function in the smart contract. Used OpenZeppelin's Ownable contract.

## Future Development

1. **Charity Organization**: Initiate transfer of funds from smart contract to org's address for a given category pool.
2. **Admin**: Implement on UI the ability to update names of category pools.
3. **Data Feeds**: Implement Chainlink's ETH/USD data feeds for real-time conversion rates. Attempted in Solidity and Web3.js, but unsuccessful.

## Dapp Architecture

- Blockchain: **Ethereum**
- Smart Contracts: **Solidity**
- Development Framework: **Truffle**
- Dapp Framework: **React Box in Truffle**
- Frontend: **React**
- UI Components: **Material-UI**
- Oracles: **Chainlink Data Feeds**
- Libraries: **OpenZeppelin Access**


## Steps to run this Dapp on a local machine

### Prerequisites

- Node.js >= v14
- React >=v17 (needed for material-ui)
- Truffle
- Ganache
- NPM
- `git clone https://github.com/knxyzkn/blockchain-developer-bootcamp-final-project`

### Contracts

- Open a new terminal
- Navigate to the project folder
- Run `npm install`
  - install smart contract dependencies
- Run `truffle develop`
  - Truffle Develop starts at `http://127.0.0.1:8545/`
  - Host: `127.0.0.1`
  - Port: `8545`
- Run `compile`
- Run `migrate`
  - Network Name: `develop`
  - Network ID: `5777` or `*`
- Run `test` to run test cases
- Optional: Running smart contract functions from the terminal may not be required because all functions can be actioned from the UI, except for the Admin capability to update category pool name. If you wish to run any of these functions from the terminal, the commands to do so are given in the `CryptoDonater.sol` file. Please review the comments tagged with @dev.

### Frontend

- Open a new terminal
- Navigate to the project folder
- Run `cd client`
- Run `npm install`
- Run `npm run start`
- Open `http://localhost:3000` in web browser that has MetaMask
- Troubleshooting steps in case of errors:
  - Refresh the dapp page
  - Verify that you're connected to `localhost 8545` in MetaMask
  - Reset your account in MetaMask settings
  - Verify that your account has sufficient funds to initiate a transaction

## Screencast link

https://www.loom.com/share/ea8dd8f2c8cf47b4aeaa152f78dd2a0b

## Ethereum Account for Certification:

`0xD88D5F94B9a10fC6AB4e29A7dB18E49b9Af64979`

## Directory Structure

- `client`: React frontend.
- `contracts`: Smart contracts deployed on the Rinkeby Test Network.
- `migrations`: Migration files for deploying smart contracts.
- `test`: Tests for smart contracts.

## Environment Variables (not needed for running project locally)

```
RINKEBY_INFURA_PROJECT_ID=
RINKEBY_MNEMONIC=
```
