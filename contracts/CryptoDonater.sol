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
/// @dev 2. CryptoDonater.at("0xA8a51239A735a6BA00d20e282d2A56Eae5439191").then(function(x) { charity = x });
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

  /// @notice Create events to be emitted whenever there are state changes
  event LogCreateCategory(string message, uint catId, string catName, uint catBalance, uint catNeed);
  event LogNeedUpdated(string message, uint catId, string catName, uint catBalance, uint catNeed);
  event LogDonation(string message, uint catId, string catName, uint catBalance, uint catNeed);

  /// @notice Modifier to ensure that _catId is >= 0 and < catList.length
  modifier catIdValidity(uint _catId) {
    require(
      _catId >= 0 && _catId < catList.length,
      "Category ID should be >= 0 and < catList.length"
    );
    _;
  }

  /// @notice Modifier to ensure that _catNeed is greater or equal to 0
  modifier catNeedValidity(uint _catNeed) {
    require(
      _catNeed >= 0,
      "Category Need should be >= 0"
    );
    _;
  }

  /// @notice Modifier to ensure that donation (msg.value) is greater or equal to 0
  modifier donationValidity() {
    require(
      msg.value >= 0,
      "Donation (msg.value) should be >= 0"
    );
    _;
  }

  /// @notice Initializes ID and Chainlink pricefeed
  constructor() public {
    currentCatId = catList.length;
    priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
  }

  /// @notice Get the Ether to USD conversion price from Chainlink data feeds
  /// @notice Could not get this function to work
  /// @notice However, I have successfully used web3.js Chainlink data feeds on the front-end
  /// @dev Use the following from command line to call this function
  /// @dev charity.getLatestPrice().then(function(x) { return x; });
  function getLatestPrice() external view returns (int) {
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
    catNeedValidity(_catNeed)
    returns(bool)
  {
    catList.push(Category({catId: currentCatId, catName: _catName, catBalance: 0, catNeed: _catNeed}));
    assert(catList[currentCatId].catBalance == 0);
    emit LogCreateCategory(
      "Category Successfully Created",
      catList[currentCatId].catId,
      catList[currentCatId].catName,
      catList[currentCatId].catBalance,
      catList[currentCatId].catNeed
    );
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
    catIdValidity(_catId)
    catNeedValidity(_catNeed)
    returns(bool)
  {
    uint oldCatNeed = catList[_catId].catNeed;
    catList[_catId].catNeed += _catNeed;
    assert(catList[_catId].catNeed >= oldCatNeed);
    emit LogNeedUpdated(
      "Category Need Successfully Updated",
      catList[_catId].catId,
      catList[_catId].catName,
      catList[_catId].catBalance,
      catList[_catId].catNeed
    );
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
  /// @dev charity.sendDonation(1).then(function(x) { return x; });
  /// @param catId of the category pool. Txn should also have 'from' and 'value'.
  /// @return True to indicate success
  function sendDonation(uint catId)
    public
    payable
    donationValidity()
    catIdValidity(catId)
    returns(bool)
  {
    /// @notice Increments balance of category pool
    uint oldCatBalance = catList[catId].catBalance;
    catList[catId].catBalance+=msg.value;
    assert(catList[catId].catBalance >= oldCatBalance);
    /// @notice Decrements need of category pool till it reaches 0
    uint oldCatNeed = catList[catId].catNeed;
    if(msg.value > catList[catId].catNeed) catList[catId].catNeed = 0;
    else catList[catId].catNeed-=msg.value;
    assert(catList[catId].catNeed >= 0 && catList[catId].catNeed <= oldCatNeed);
    emit LogDonation(
      "Donation Successful",
      catList[catId].catId,
      catList[catId].catName,
      catList[catId].catBalance,
      catList[catId].catNeed
    );
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
    catIdValidity(catId)
    returns(string memory, uint, uint)
  {
    return (catList[catId].catName, catList[catId].catBalance, catList[catId].catNeed);
  }

  /// @notice Future Development: Send payabale transaction from smart contract to charity org address.
  // function sendDonationToCharity(uint catId) public payable returns(uint) { }

}
