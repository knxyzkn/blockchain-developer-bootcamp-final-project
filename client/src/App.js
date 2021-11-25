import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CryptoDonater from "./contracts/CryptoDonater.json";
import getWeb3 from "./getWeb3";
// import { Input, Button } from '@mui/material';

import "./App.css";

class App extends Component {
  state = { contractAddress: null, storageValue: 0, web3: null, accounts: null, contract: null, catList: null, catName: null, catbalance: null, catNeed: null};

  componentDidMount = async () => {
    console.log("Component Did Mount")

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("NETWORK ID", networkId);

      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // console.log("DEPLOYED NETWORK", deployedNetwork);

      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      const deployedNetwork = CryptoDonater.networks[networkId];
      console.log("DEPLOYED NETWORK", deployedNetwork);

      const instance = new web3.eth.Contract(
        CryptoDonater.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ contractAddress: deployedNetwork.address });

      console.log("INSTANCE", instance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);

      //Subscribe to all events
      // instance.events.allEvents({
      //   fromBlock: 0,
      //   toBlock: 'latest'
      // }, function(error, events){ console.log(events); })
      // .then(function(events){
      //   console.log("Current Event", events.returnValues)
      // });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();


    // await contract.methods.createCategory("R&D", 200, 300).send({ from: accounts[0] });
    await contract.methods.sendDonation(2, 20).send({ from: accounts[0], value: 10000000000000000 });
    // await contract.methods.sendCharity(2).send({from: accounts[0]});


    // await contract.methods.sendDonation(2, 20).send({ from: accounts[0], value: 1 });

    // const response = await contract.methods.getCatList().call();
    // this.setState({ catList: response });



    const response1 = await contract.methods.getCatValues(2).call();
    console.log("RESPONSE 1", response1);

    console.log("THIS.STATE", this.state);

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
