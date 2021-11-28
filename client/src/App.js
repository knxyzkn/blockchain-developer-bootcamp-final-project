// Requires react 17.x and over for material-ui. Truffle Unbox React installs react 16.x.
import React, { Component } from "react";
import CryptoDonater from "./contracts/CryptoDonater.json";
import getWeb3 from "./getWeb3";
import { Typography, MenuItem, Button, TextField } from '@mui/material';
import CategoryTable from "./components/CategoryTable.js";
import NotWeb3 from "./components/NotWeb3.js";
import GeneralSection from "./components/GeneralSection.js";
import Bottom from "./components/Bottom.js";

import Web3 from "web3";

import "./App.css";

class App extends Component {
  state = {
    contractAddress: null,
    catListLength: null,
    web3: null,
    accounts: null,
    contract: null,
    catList: null,
    catName: null,
    catbalance: null,
    catNeed: null,
    inputCategoryValue: "",
    inputCategoryValueError: false,
    inputAmountValue: "",
    inputAmountValueError: false,
    inputCreateCategoryValue: "",
    inputCreateCategoryValueError: false,
    inputCreateNeedAmount: "",
    inputCreateNeedAmountError: false,
    inputUpdateCategoryValue: "",
    inputUpdateCategoryValueError: false,
    inputUpdateNeedAmount: "",
    inputUpdateNeedAmountError: false,
    usd: null
  };

  componentDidMount = async () => {
    // console.log("Component Did Mount")

    try {

      // Chainlink Data Feeds for ETH/USD coversion rates
      const web3oracle = new Web3("https://kovan.infura.io/v3/61666a4908b1429ca998ea7bd985a362")
      const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
      const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331"
      const priceFeed = new web3oracle.eth.Contract(aggregatorV3InterfaceABI, addr)
      priceFeed.methods.latestRoundData().call()
          .then((roundData) => {
              this.setState({usd: (roundData.answer/100000000).toFixed(2)});
              // console.log("Latest Round Data", roundData.answer/100000000)
          })

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      // console.log("NETWORK ID", networkId);

      const deployedNetwork = CryptoDonater.networks[networkId];
      // console.log("DEPLOYED NETWORK", deployedNetwork);

      const instance = new web3.eth.Contract(
        CryptoDonater.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // console.log("INSTANCE", instance);

      // Get the length of the category pool list stored in the smart contract.
      const catListLength = await instance.methods.getCatListLength().call();

      // Get the details (name, balance, need) of the category pool list.
      // Iterating off-chain to optimize for gas costs.
      let catList = [];
      for(let i=0; i<catListLength; i++) {
        const catValue = await instance.methods.getCatValues(i).call();
        catList.push({name: catValue[0], balance: catValue[1], need: catValue[2]});
        // console.log("CAT VALUE", catValue);
      }

      // Set web3, accounts, contract, category pool list length/details
      this.setState({
        web3,
        accounts,
        contract: instance ,
        contractAddress: deployedNetwork.address,
        catListLength,
        catList
      }, this.runExample);

      // Subscribe to all events
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
        `Failed to load web3, accounts, or contract. Please ensure you have logged into you Metamask wallet and connected your account on the Rinkeby Test Network. You can do this by refreshing your page.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    // const { accounts, contract } = this.state;
    // await contract.methods.sendDonation(0).send({ from: accounts[0], value: 100 });
    // await contract.methods.createCategory("Research and Development", 300).send({ from: accounts[0] });
    // const sendCharityReturnValue = await contract.methods.sendCharity(0).send({from: accounts[0], value: 1000000000});
    // console.log("SEND CHARITY RETURN VALUE", sendCharityReturnValue);
    // await contract.methods.sendDonation(2, 20).send({ from: accounts[0], value: 1 });
    // console.log("THIS.STATE", this.state);
  };


  // ---------------------------------------------------------------------------------------------
  // The functions below are written to handle actions that can be performed in the Donate section of the Dapp.
  // Pending code refactoring.
  // ---------------------------------------------------------------------------------------------

  handleCategoryInputChange(event) {
    // console.log("Category Input Clicked", event.target.value);
    this.setState({inputCategoryValue: event.target.value});
  }

  handleAmountInputChange(event) {
    // console.log("Amount Input Clicked", event.target.value);
    this.setState({inputAmountValue: event.target.value});
  }

  handleCategoryResetButtonClick(event) {
    // console.log("RESET CLICKED", event)
    this.setState({
      inputCategoryValue: "",
      inputAmountValue: "",
      inputAmountValueError: false,
      inputCategoryValueError: false
    });
  }

  handleDonateButtonClick = async (event) => {
    try{
      // console.log("DONATE CLICKED", event);
      // console.log(this.state.inputCategoryValue, this.state.inputAmountValue);
      if(this.state.inputCategoryValue === "")
        await this.setState({inputCategoryValueError: true});
      else
        await this.setState({inputCategoryValueError: false});

      if(this.state.inputAmountValue === "")
        await this.setState({inputAmountValueError: true});
      else if(isNaN(this.state.inputAmountValue)) {
        // console.log(isNaN(this.state.inputAmountValue))
        await this.setState({inputAmountValueError: true});
      } else if(this.state.inputAmountValue<0)
        await this.setState({inputAmountValueError: true});
      else
        await this.setState({inputAmountValueError: false});

      // console.log(this.state.inputCategoryValueError, this.state.inputAmountValueError);
      if(!this.state.inputCategoryValueError && !this.state.inputAmountValueError) {
        let catList = [];
        await this.state.contract.methods
        .sendDonation(this.state.inputCategoryValue)
        .send({ from: this.state.accounts[0], value: Math.round(this.state.inputAmountValue) })
        .catch((error) => { alert(`Transaction was NOT sent. Please try again, perhaps after resetting your account. ${'\n'} Error: ${error.message}` )});
        for(let i=0; i<this.state.catListLength; i++) {
          const catValue = await this.state.contract.methods
          .getCatValues(i)
          .call()
          .catch((error) => { console.log("Error", error) });
          catList.push({name: catValue[0], balance: catValue[1], need: catValue[2]});
          // console.log("CAT VALUE", catValue);
        }
        this.setState({ inputCategoryValue: "", inputAmountValue: "", catList });
      }
    } catch(error) {
      console.log("ERROR2", error)
    }
  }

  // ---------------------------------------------------------------------------------------------
  // The functions below are written to handle actions that can be performed in the Create Category Pool section of the Dapp.
  // Pending code refactoring.
  // ---------------------------------------------------------------------------------------------

    handleCreateCategoryInputChange(event) {
      // console.log("Create Category Input Clicked", event.target.value);
      this.setState({inputCreateCategoryValue: event.target.value});
    }

    handleCreateNeedInputChange(event) {
      // console.log("Create Need Input Clicked", event.target.value);
      this.setState({inputCreateNeedAmount: event.target.value});
    }

    handleCreateResetButtonClick(event) {
      // console.log("RESET CLICKED in Create Category", event)
      this.setState({
        inputCreateCategoryValue: "",
        inputCreateNeedAmount: "",
        inputCreateCategoryValueError: false,
        inputCreateNeedAmountError: false
      });
    }

    handleCreateButtonClick = async (event) => {
      try{
        // console.log("CREATE CLICKED", event);
        // console.log(this.state.inputCreateCategoryValue, this.state.inputCreateNeedAmount);
        if(this.state.inputCreateCategoryValue === "")
          await this.setState({inputCreateCategoryValueError: true});
        else
          await this.setState({inputCreateCategoryValueError: false});

        if(this.state.inputCreateNeedAmount === "")
          await this.setState({inputCreateNeedAmountError: true});
        else if(isNaN(this.state.inputCreateNeedAmount)) {
          // console.log(isNaN(this.state.inputCreateNeedAmount))
          await this.setState({inputCreateNeedAmountError: true});
        } else if(this.state.inputCreateNeedAmount<0)
          await this.setState({inputCreateNeedAmountError: true});
        else
          await this.setState({inputCreateNeedAmountError: false});

        // console.log(this.state.inputCreateCategoryValueError, this.state.inputCreateNeedAmountError);
        if(!this.state.inputCreateCategoryValueError && !this.state.inputCreateNeedAmountError) {
          let catList = [];
          await this.state.contract.methods
          .createCategory(this.state.inputCreateCategoryValue, Math.round(this.state.inputCreateNeedAmount))
          .send({ from: this.state.accounts[0] })
          .catch((error) => { alert(`Transaction was NOT sent. Please try again, perhaps after resetting your account. ${'\n'} Error: ${error.message}`)});
          const catListLength = await this.state.contract.methods.getCatListLength().call();
          for(let i=0; i<catListLength; i++) {
            const catValue = await this.state.contract.methods
              .getCatValues(i)
              .call()
              .catch((error) => { console.log("Error", error)});
            catList.push({name: catValue[0], balance: catValue[1], need: catValue[2]});
            // console.log("CAT VALUE", catValue);
          }
          this.setState({ inputCreateCategoryValue: "", inputCreateNeedAmount: "", catList, catListLength });
        }
      } catch(error) {
          console.log("ERROR2", error)
      }
    }



  // ---------------------------------------------------------------------------------------------
  // The functions below are written to handle actions that can be performed in the Update Need for Category Pool section of the Dapp.
  // Pending code refactoring.
  // ---------------------------------------------------------------------------------------------

    handleUpdateCategoryInputChange(event) {
      // console.log("Update Category Input Clicked", event.target.value);
      this.setState({inputUpdateCategoryValue: event.target.value});
    }

    handleUpdateNeedInputChange(event) {
      // console.log("Update Need Input Clicked", event.target.value);
      this.setState({inputUpdateNeedAmount: event.target.value});
    }

    handleUpdateResetButtonClick(event) {
      // console.log("RESET CLICKED in Update Category", event)
      this.setState({
        inputUpdateCategoryValue: "",
        inputUpdateNeedAmount: "",
        inputUpdateCategoryValueError: false,
        inputUpdateNeedAmountError: false
      });
    }

    handleUpdateButtonClick = async (event) => {
      try{
        // console.log("Update CLICKED", event);
        // console.log(this.state.inputUpdateCategoryValue, this.state.inputUpdateNeedAmount);
        if(this.state.inputUpdateCategoryValue === "")
          await this.setState({inputUpdateCategoryValueError: true});
        else
          await this.setState({inputUpdateNeedAmountError: false});

        if(this.state.inputUpdateNeedAmount === "")
          await this.setState({inputUpdateNeedAmountError: true});
        else if(isNaN(this.state.inputUpdateNeedAmount)) {
          // console.log(isNaN(this.state.inputUpdateNeedAmount))
          await this.setState({inputUpdateNeedAmountError: true});
        } else if(this.state.inputUpdateNeedAmount<0)
          await this.setState({inputUpdateNeedAmountError: true});
        else
          await this.setState({inputUpdateNeedAmountError: false});

        // console.log(this.state.inputUpdateCategoryValueError, this.state.inputUpdateNeedAmountError);
        if(!this.state.inputUpdateCategoryValueError && !this.state.inputUpdateNeedAmountError) {
          let catList = [];
          await this.state.contract.methods
          .updateCategoryNeed(this.state.inputUpdateCategoryValue, Math.round(this.state.inputUpdateNeedAmount))
          .send({ from: this.state.accounts[0] })
          .catch((error) => { alert(`Transaction was NOT sent. Please try again, perhaps after resetting your account. ${'\n'} Error: ${error.message}`)});
          const catListLength = await this.state.contract.methods.getCatListLength().call();
          for(let i=0; i<catListLength; i++) {
            const catValue = await this.state.contract.methods
              .getCatValues(i)
              .call()
              .catch((error) => { console.log("Error", error)});
            catList.push({name: catValue[0], balance: catValue[1], need: catValue[2]});
            // console.log("CAT VALUE", catValue);
          }
          this.setState({ inputUpdateCategoryValue: "", inputUpdateNeedAmount: "", catList, catListLength });
        }
      } catch(error) {
          console.log("ERROR2", error)
      }
    }


  render() {
    if (!this.state.web3) {
      return <NotWeb3/>
    }
    return (
      <div className="App">
        <h1>Crypto Donater</h1>
        <GeneralSection
          contractAddress={this.state.contractAddress}
          accounts={this.state.accounts}
        />

        <hr style={{margin: '3vw'}}/>

        <h2>Category Pool Table</h2>

        <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          Please review the category pools, balances, and need below.
        </Typography>

        <div>
          {
            this.state.catListLength ?
            <div style={{margin: '3vw'}}>
              <CategoryTable catList={this.state.catList}/>
            </div>
            :
            <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
              No category pools yet.
            </Typography>
          }
        </div>

        <hr style={{margin: '3vw'}}/>

        <h2>Donor</h2>

        <div>
          <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
            Enter the category pool and amount. Click 'Donate' to initiate a transaction. Once the transaction is complete, please check the category pool table above for updated values. 'Balance' will be incremented and 'Need' will be decremented. USD conversion rate is obtained in real-time from Chainlink data feeds.
          </Typography>

          <div>
            <TextField
              id="select-category"
              select
              label="Select Category Pool"
              required
              value={this.state.inputCategoryValue}
              helperText={this.state.inputCategoryValueError ? "This is a required field" : "Please select category pool"}
              error={this.state.inputCategoryValueError}
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
          </div>

          <div>
            <TextField
              id="enter-amount"
              label="Amount"
              variant="outlined"
              required
              value={this.state.inputAmountValue}
              helperText={this.state.inputAmountValueError ? "Requires a positive number" : "Please enter amount (wei)"}
              error={this.state.inputAmountValueError}
              onChange={this.handleAmountInputChange.bind(this)}
              size="small"
              style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
            />
            <TextField
              id="enter-amount"
              label="Amount in USD"
              variant="outlined"
              required
              disabled
              value={(Math.round(this.state.inputAmountValue*this.state.usd/Math.pow(10,18) * 100) / 100).toFixed(2)}
              helperText={`1 Ether = USD ${this.state.usd}`}
              size="small"
              style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
            />
          </div>

          <div>
            <Button size="small" variant="contained" disableElevation
                onClick={this.handleDonateButtonClick.bind(this)}
                style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              >DONATE</Button>
            <Button size="small" variant="outlined" disableElevation
              onClick={this.handleCategoryResetButtonClick.bind(this)}
              style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
            >RESET</Button>
          </div>
        </div>

        <hr style={{margin: '3vw'}}/>

        <h2>Charity Organization</h2>
        <div>
          <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
            If you wish to create a new category pool, please submit the form below. Click 'Create Category Pool' to initiate a transaction. Once the transaction is complete, please check the category pool table above for updated values. A new category will be created, its 'Balance' will be set to 0, and its 'Need' will be updated.
          </Typography>
          <div>
            <div>
              <TextField
                id="enter-category"
                label="Category Pool Name"
                variant="outlined"
                required
                value={this.state.inputCreateCategoryValue}
                helperText={this.state.inputCreateCategoryValueError ? "This is a required field" : "Please enter name of category pool"}
                error={this.state.inputCreateCategoryValueError}
                onChange={this.handleCreateCategoryInputChange.bind(this)}
                size="small"
                style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              />
              <TextField
                id="enter-need"
                label="Category Pool Need"
                variant="outlined"
                required
                value={this.state.inputCreateNeedAmount}
                helperText={this.state.inputCreateNeedAmountError ? "Requires a positive number" : "Please enter need amount (wei)"}
                error={this.state.inputCreateNeedAmountError}
                onChange={this.handleCreateNeedInputChange.bind(this)}
                size="small"
                style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              />
            </div>
            <div>
              <Button size="small" variant="contained" disableElevation
                  onClick={this.handleCreateButtonClick.bind(this)}
                  style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              >CREATE CATEGORY POOL</Button>
              <Button size="small" variant="outlined" disableElevation
                onClick={this.handleCreateResetButtonClick.bind(this)}
                style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              >RESET</Button>
            </div>
          </div>
        </div>


        <div>
          <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
            If you wish to submit additional need for one of the existing category pools, please submit the form below. Click 'Update Category Need' to initiate a transaction. Once the transaction is complete, please check the category pool table above for the updated values. 'Need' total will be incremented by the value you entered here.
          </Typography>
          <div>
            <div>
              <TextField
                id="select-category"
                select
                label="Select Category Pool"
                required
                value={this.state.inputUpdateCategoryValue}
                helperText={this.state.inputUpdateCategoryValueError ? "This is a required field" : "Please select category pool"}
                error={this.state.inputUpdateCategoryValueError}
                onChange={this.handleUpdateCategoryInputChange.bind(this)}
                size="small"
                style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              >
                {this.state.catList.map((item, index) => (
                  <MenuItem key={index} value={index}>
                    {index} {item.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="enter-need"
                label="Additional Category Pool Need"
                variant="outlined"
                required
                value={this.state.inputUpdateNeedAmount}
                helperText={this.state.inputUpdateNeedAmountError ? "Requires a positive number" : "Please enter need amount (wei)"}
                error={this.state.inputUpdateNeedAmountError}
                onChange={this.handleUpdateNeedInputChange.bind(this)}
                size="small"
                style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              />
            </div>
            <div>
              <Button size="small" variant="contained" disableElevation
                  onClick={this.handleUpdateButtonClick.bind(this)}
                  style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              >UPDATE CATEGORY NEED</Button>
              <Button size="small" variant="outlined" disableElevation
                onClick={this.handleUpdateResetButtonClick.bind(this)}
                style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}
              >RESET</Button>
            </div>
          </div>
        </div>

        <Typography align="left" style={{backgroundColor: '#ECECEC', marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          [Future Development]: Charity organization can initiate a transaction to transfer funds from the category pools to their respective org's address.
        </Typography>

        <hr style={{margin: '3vw'}}/>

        <h2>Admin</h2>
        <Typography align="left" style={{backgroundColor: '#ECECEC', marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          [Future Development] Admin (contract owner) can edit/update name of an existing category pool. Non-owners will not be able to do this.
          However, the smart contract function has been implemented/tested already using OpenZeppelin's ownable access contract.
        </Typography>


        <Bottom/>

      </div>
    );
  }
}

export default App;
