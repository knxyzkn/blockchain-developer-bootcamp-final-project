import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CryptoDonater from "./contracts/CryptoDonater.json";
import getWeb3 from "./getWeb3";
import { MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Input, Button, TextField } from '@mui/material';
import CategoryTable from "./components/CategoryTable.js";
// Requires react 17.x and over for material-ui. Truffle Unbox React install react 16.x.


import "./App.css";

class App extends Component {
  state = {
    contractAddress: null,
    storageValue: 0,
    catListLength: null,
    web3: null,
    accounts: null,
    contract: null,
    catList: null,
    catName: null,
    catbalance: null,
    catNeed: null,
    inputCategoryValue: "",
    inputAmountValue: ""
  };

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

      const deployedNetwork = CryptoDonater.networks[networkId];
      console.log("DEPLOYED NETWORK", deployedNetwork);

      const instance = new web3.eth.Contract(
        CryptoDonater.abi,
        deployedNetwork && deployedNetwork.address,
      );

      console.log("INSTANCE", instance);

      const catListLength = await instance.methods.getCatListLenght().call();

      let catList = [];
      for(let i=0; i<catListLength; i++) {
        const catValue = await instance.methods.getCatValues(i).call();
        catList.push({name: catValue[0], balance: catValue[1], need: catValue[2]});
        console.log("CAT VALUE", catValue);
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contracts methods.
      this.setState({
        web3,
        accounts,
        contract: instance ,
        contractAddress: deployedNetwork.address,
        catListLength,
        catList
      }, this.runExample);

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

    // await contract.methods.sendDonation(0, 20).send({ from: accounts[0], value: 1 });
    // await contract.methods.createCategory("Research and Development", 200, 300).send({ from: accounts[0] });
    // const sendCharityReturnValue = await contract.methods.sendCharity(0).send({from: accounts[0], value: 1000000000});
    // console.log("SEND CHARITY RETURN VALUE", sendCharityReturnValue);
    // await contract.methods.sendDonation(2, 20).send({ from: accounts[0], value: 1 });

    console.log("THIS.STATE", this.state);
  };

  handleCategoryInputChange(event) {
    console.log("Category Input Clicked", event.target.value);
    this.setState({inputCategoryValue: event.target.value});
  }

  handleAmountInputChange(event) {
    console.log("Amount Input Clicked", event.target.value);
    this.setState({inputAmountValue: event.target.value});
  }

  handleCategoryResetButtonClick(event) {
    console.log("RESET CLICKED", event)
    this.setState({ inputCategoryValue: "", inputAmountValue: "" });
  }

  handleDonateButtonClick = async (event) => {
    console.log("DONATE CLICKED", event);
    let catList = [];
    await this.state.contract.methods
    .sendDonation(this.state.inputCategoryValue,this.state.inputAmountValue)
    .send({ from: this.state.accounts[0], value: this.state.inputAmountValue });
    for(let i=0; i<this.state.catListLength; i++) {
      const catValue = await this.state.contract.methods.getCatValues(i).call();
      catList.push({name: catValue[0], balance: catValue[1], need: catValue[2]});
      console.log("CAT VALUE", catValue);
    }
    this.setState({ inputCategoryValue: "", inputAmountValue: "", catList });
  }

  render() {
    if (!this.state.web3) {
      return <div>Welcome to Crypto Donater! Please login to your Metamask wallet and connect your account on the Rinkeby Test Network. </div>;
    }
    return (
      <div className="App">
        <h1>Crypto Donater</h1>
        <div>Donors can donate crypto to category pools held in the smart contract.</div>
        <div>Charity organizations can transfer funds from the smart contract to their charity org address when the need arises.</div>
        <div>If the balance of a category pool is in sufficent, then charity orgs can set current needs so that donors can donate to category pools accordingly.</div>

        <hr style={{margin: '3vw'}}/>

        <h2>Donor</h2>
        <div>
          <TextField
           id="read-only-connected-account"
           label="Connected Account (Read Only)"
           defaultValue={this.state.accounts[0]}
           InputProps={{
             readOnly: true,
           }}
           style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px', width: '90vw'}}
         />
        </div>
        <div>
          <TextField
           id="read-only-connected-account"
           label="Contract Address (Read Only)"
           defaultValue={this.state.contractAddress}
           InputProps={{
             readOnly: true,
           }}
           style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px', width: '90vw'}}
         />
        </div>

        <div>
          {
            this.state.catListLength ?
            <div style={{margin: '3vw'}}>
              <CategoryTable catList={this.state.catList}/>
            </div>
            :
            <div>
              No categories yet.
            </div>
          }
        </div>

        <div>
          <div
            style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
          >
            Enter the index number below to select the catagory and donate crypto.
          </div>
          <TextField
            id="select-category"
            select
            label="Select"
            value={this.state.inputCategoryValue}
            helperText="Please select category"
            onChange={this.handleCategoryInputChange.bind(this)}
            size="small"
            style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
          >
            {this.state.catList.map((item, index) => (
              <MenuItem key={index} value={index}>
                {index} {item.name}
              </MenuItem>
            ))}
          </TextField>

          <div>
            <TextField
              id="enter-amount"
              label="Outlined"
              variant="outlined"
              value={this.state.inputAmountValue}
              helperText="Please enter amount (wei)"
              onChange={this.handleAmountInputChange.bind(this)}
              size="small"
              style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
            />
          </div>

          <div>
            <Button size="small" variant="outlined"
              onClick={this.handleCategoryResetButtonClick.bind(this)}
            >RESET</Button>
            <Button size="small" variant="outlined"
              onClick={this.handleDonateButtonClick.bind(this)}
            >DONATE</Button>
          </div>
        </div>


          <hr style={{margin: '3vw'}}/>
        <h2>Charity Organization</h2>
      </div>
    );
  }
}

export default App;
