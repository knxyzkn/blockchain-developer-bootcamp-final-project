var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var CryptoDonater = artifacts.require("./CryptoDonater.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(CryptoDonater);
};
