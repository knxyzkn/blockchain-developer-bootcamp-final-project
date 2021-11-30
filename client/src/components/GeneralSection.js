import React, { Component } from "react";
import { Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

class GeneralSection extends Component {
  render() {
    const StyledTextFieldAccount = styled(TextField)({
      '& input + fieldset': {
        borderColor: '#42a5f5',
        borderWidth: 2,
      }
    });

    return (
      <div>
        <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          Donors can donate crypto to category pools held in the smart contract.
        </Typography>
        <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          Charity organizations can transfer funds from the smart contract to their charity org address when the need arises.
        </Typography>
        <Typography align="left" style={{marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px'}}>
          If the balance of a category pool is insufficient, then charity orgs can update need so that donors can donate to category pools accordingly.
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
          <StyledTextFieldAccount
           id="read-only-connected-account"
           label="Connected Account (Read Only)"
           defaultValue={this.props.accounts[0]}
           helperText="You can disconnect this account by opening Metamask. After that, please refresh this page."
           InputProps={{
             readOnly: true,
           }}
           style={{ marginLeft: '3vw', marginRight: '3vw', marginBottom: '20px', width: '90vw'}}
         />
        </div>
      </div>
    )
  }
}

export default GeneralSection;
