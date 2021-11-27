// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title Accepts donations into category pools
/// @author Kaushik Nagaraj
/// @notice Performs the following functions:
/// @notice 1. Create a new category pool
/// @notice 2. Update the need of an existing category pool
/// @notice 3. Donate ether to an existing category pool
/// @notice 4. Converts ether to USD using the Chainlink Data Feeds
/// @notice 5. Obtain the length of the catagory pool list
/// @notice 6. Obtain the details (id, name, balance, need) of a given category pool
/// @dev Once the contract is compile and deployed, use the following to run functions from command line
/// @dev 1. let charity;
/// @dev 2. CryptoDonater.at("<Deployed Contract Address").then(function(x) { charity = x });
/// @dev 3. Then run the corresponding command for function of your choice (see @dev for each function below)

contract CryptoDonater {

  /// @notice Struct to capture ID, Name, Balance, and Need of a Category Pool.
  struct Category {
    uint catId;
    string catName;
    uint catBalance;
    uint catNeed;
  }

  /// @notice Future development
  // struct Charity {
  //   string charityName;
  //   address charityAddress;
  // }

  /// @notice Future development
  // struct Donor {
  //   address donorAddress;
  //   uint donorValue;
  // }

  /// @notice Captures the ID that can be assigned to the newly created category pool
  uint currentCatId;

  /// @notice Future development
  // Charity[] public charityListings;

  /// @notice Array of type Category to capture category pool list in storage
  Category[] public catList;

  /// @notice Future development
  // mapping(address => Charity) public charityList;
  // mapping(address => Donor) public donorList;

  /// @notice Interface declaration for Chainlink data feeds
  AggregatorV3Interface internal priceFeed;

  /// @notice Initializes ID and Chainlink pricefeed
  constructor() public {
    currentCatId = catList.length;
    priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
  }

  /// @notice Get the Ether to USD conversion price from Chainlink data feeds
  /// @notice Could not get this function to work
  /// @notice So I have used Chainlink data feeds from Web3.js on the front-end
  /// @dev Use the following from command line to call this function
  /// @dev charity.getLatestPrice().then(function(x) { return x; });
  function getLatestPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

  /// @notice Create a new category pool
  /// @dev Use the following from command line to call this function
  /// @dev charity.createCategory("Logistics Costs", 200).then(function(x) { return x; });
  /// @param 1. Name of the category pool
  /// @param 2. Need of the category pool
  /// @return True to indicate success
  function createCategory(string memory _catName, uint _catNeed)
    public
    returns(bool)
  {
    catList.push(Category({catId: currentCatId, catName: _catName, catBalance: 0, catNeed: _catNeed}));
    currentCatId++;
    return true;
  }

  /// @notice Update the need for an existing category pool
  /// @dev Use the following from command line to call this function
  /// @dev charity.updateCategoryNeed(1, 200).then(function(x) { return x; });
  /// @param 1. _catId of the existing category pool
  /// @param 2. _catNeed to be added to existing category pool
  /// @return True to indicate success
  function updateCategoryNeed(uint _catId, uint _catNeed)
    public
    returns(bool)
  {
    catList[_catId].catNeed += _catNeed;
    return true;
  }

  /// @notice Get the length of the category pool list
  /// @dev Use the following from command line to call this function
  /// @dev charity.getCatListLength().then(function(x) { return x; });
  /// @return Length of category pool list
  function getCatListLength()
    public
    view
    returns(uint)
  {
    return catList.length;
  }

  /// @notice Send donation to category pool
  /// @dev Use the following from command line to call this function
  /// @dev charity.sendDonation(4).then(function(x) { return x; });
  /// @param catId of the category pool. Txn should also have 'from' and 'value'.
  /// @return True to indicate success
  function sendDonation(uint catId)
    public
    payable
    returns(bool)
  {
    /// @notice Increments balance of category pool
    catList[catId].catBalance+=msg.value;
    /// @notice Decrements need of category pool till it reaches 0
    if(msg.value > catList[catId].catNeed) catList[catId].catNeed = 0;
    else catList[catId].catNeed-=msg.value;
    return true;
  }

  /// @notice Get the details (id, name, balance, need) of the specified category pool
  /// @dev Use the following from command line to call this function
  /// @dev charity.getCatValues(2).then(function(x) { return x; });
  /// @param catId of the existing category pool
  /// @return 1. Name of the category pool
  /// @return 2. Balance of the category pool
  /// @return 3. Need of the category pool
  function getCatValues(uint catId)
    public
    view
    returns(string memory, uint, uint)
  {
    return (catList[catId].catName, catList[catId].catBalance, catList[catId].catNeed);
  }

  /// @notice Future Development: Send payabale transaction from smart contract to charity org address.
  // function sendDonationToCharity(uint catId) public payable returns(uint) { }

}
