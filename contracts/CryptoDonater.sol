// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CryptoDonater {

  struct Category {
    uint catId;
    string catName;
    uint catBalance;
    uint catNeed;
  }

  struct Charity {
    string charityName;
    address charityAddress;
  }

  struct Donor {
    address donorAddress;
    uint donorValue;
  }

  uint currentCatId;

  Charity[] public charityListings;
  Category[] public catList;

  mapping(address => Charity) public charityList;
  mapping(address => Donor) public donorList;

  event logCreateCharity(string name, address addr);
  event logGetCharity(string name, address addr);

  constructor() public {
    currentCatId = catList.length;
  }

  // let charity;
  // CryptoDonater.at("0xA8a51239A735a6BA00d20e282d2A56Eae5439191").then(function(x) { charity = x });
  // charity.createCharity("Fred's Team", "0x160dBbe421aC2A88fc4f1dbAE62D7D6357141a16", 73).then(function(x) { return x; });

  function createCharity(string memory _charityName, address _charityAddress, uint _charityNeed)
    public
    returns(string memory charityName, address charityAddress)
  {
    charityListings.push(Charity({
      charityName: _charityName,
      charityAddress: _charityAddress
    }));
    charityList[_charityAddress] = Charity({
      charityName: _charityName,
      charityAddress: _charityAddress
    });
    emit logCreateCharity(
      charityList[_charityAddress].charityName,
      charityList[_charityAddress].charityAddress
    );
    return (
      charityList[_charityAddress].charityName,
      charityList[_charityAddress].charityAddress
    );
  }

  // charity.getCharity("0x3F33D19b5E79fD52E387f795d878F4b392683471").then(function(x) { return x; });
  function getCharity(address _charityAddress)
    public
    returns(string memory charityName, address charityAddress)
  {
    emit logGetCharity(
      charityList[_charityAddress].charityName,
      charityList[_charityAddress].charityAddress
    );
    return (
      charityList[_charityAddress].charityName,
      charityList[_charityAddress].charityAddress
    );
  }

  // charity.createCategory("Logistics Costs", 200).then(function(x) { return x; });
  function createCategory(string memory _catName, uint _catNeed)
    public
    returns(bool)
  {
    catList.push(Category({catId: currentCatId, catName: _catName, catBalance: 0, catNeed: _catNeed}));
    currentCatId++;
    return true;
  }

  // charity.updateCategoryNeed(1, 200).then(function(x) { return x; });
  function updateCategoryNeed(uint _catId, uint _catNeed)
    public
    returns(bool)
  {
    catList[_catId].catNeed += _catNeed;
    return true;
  }

  // charity.getCatListLength().then(function(x) { return x; });
  function getCatListLength()
    public
    returns(uint)
  {
    return catList.length;
  }

  // charity.sendDonation(4).then(function(x) { return x; });
  function sendDonation(uint catId)
    public
    payable
    returns(bool)
  {
    catList[catId].catBalance+=msg.value;
    if(msg.value > catList[catId].catNeed) catList[catId].catNeed = 0;
    else catList[catId].catNeed-=msg.value;
    return true;
  }

  // charity.getCatValues(2).then(function(x) { return x; });
  function getCatValues(uint catId)
    public
    returns(string memory, uint, uint)
  {
    return (catList[catId].catName, catList[catId].catBalance, catList[catId].catNeed);
  }

  // Future: Send payabale transaction from smart contract to charity org address.
  // function sendDonationToCharity(uint catId) public payable returns(uint) { }

}
