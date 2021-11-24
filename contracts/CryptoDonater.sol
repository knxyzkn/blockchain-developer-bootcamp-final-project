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
  // CryptoDonater.at("0x0AAa9064D3B5B597a4Ef8Ab5d20f6e00CD5fd177").then(function(x) { charity = x });
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
  // charity.createCategory("Logistics Costs", 2300, 200).then(function(x) { return x; });
  function createCategory(string memory _catName, uint _catBalance, uint _catNeed)
    public
    returns(bool successful)
  {
    catList.push(Category({catId: currentCatId, catName: _catName, catBalance: 0, catNeed: 0}));
    currentCatId++;
    return true;
  }

  // charity.sendDonation(4, 25).then(function(x) { return x; });
  function sendDonation(uint catId, uint catNeed)
    public
    payable
    returns(bool completed)
  {
    catList[catId].catBalance+=msg.value;
    catList[catId].catNeed+=catNeed;
    return true;
  }

}
