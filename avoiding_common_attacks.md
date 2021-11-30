# Avoiding Common Attacks

## Using Specific Compiler Pragma
Used `pragma solidity ^0.8.0` to indicate the lowest compiler version so as to ensure all contracts and dependencies are compiled accurately.

## Proper Use of require, assert, and revert
Used `require` to perform validations of input parameters in functions.
Used `assert` to validate situations that should never happen, especially after state changes. Used this towards the end of functions.

## Use Modifiers Only for Validation
Used function modifiers to only perform validations of input parameters.

## SWC-131 Presence of unused variables
Removed or commented out unused variables.
