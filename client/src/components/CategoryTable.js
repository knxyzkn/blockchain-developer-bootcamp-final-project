import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Input, Button } from '@mui/material';
import React, { Component } from "react";

class CategoryTable extends Component {
  render() {
    return (
      <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell style={{fontWeight: 'bold'}}>INDEX</TableCell>
              <TableCell align="left" style={{fontWeight: 'bold'}}>CATEGORY POOL NAME</TableCell>
              <TableCell align="right" style={{fontWeight: 'bold'}}>BALANCE (wei)</TableCell>
              <TableCell align="right" style={{fontWeight: 'bold'}}>NEED (wei)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.catList.map((item, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="item">{index}</TableCell>
                <TableCell align="left">{item.name}</TableCell>
                <TableCell align="right">{item.balance}</TableCell>
                <TableCell align="right">{item.need}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    )
  }
}

export default CategoryTable;
