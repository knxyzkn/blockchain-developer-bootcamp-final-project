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
              <TableCell>Index</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right">Balance (wei)</TableCell>
              <TableCell align="right">Need (wei)</TableCell>
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
