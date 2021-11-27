import React, { Component } from "react";
import { Typography, MenuItem, Button, TextField } from '@mui/material';

class GeneralSection extends Component {
  render() {
    return (
      <div>
        <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          Donors can donate crypto to category pools held in the smart contract.
        </Typography>
        <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          Charity organizations can transfer funds from the smart contract to their charity org address when the need arises.
        </Typography>
        <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          If the balance of a category pool is in sufficent, then charity orgs can set current needs so that donors can donate to category pools accordingly.
        </Typography>
        <div>
          <TextField
           id="read-only-connected-account"
           label="Smart Contract Address (Read Only)"
           defaultValue={this.props.contractAddress}
           InputProps={{
             readOnly: true,
           }}
           style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px', width: '90vw'}}
         />
        </div>
        <div>
          <TextField
           id="read-only-connected-account"
           label="Connected Account (Read Only)"
           defaultValue={this.props.accounts[0]}
           InputProps={{
             readOnly: true,
           }}
           style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px', width: '90vw'}}
         />
        </div>
      </div>
    )
  }
}

export default GeneralSection;
