var CryptoDonater = artifacts.require("./CryptoDonater.sol");

module.exports = function(deployer) {
  deployer.deploy(CryptoDonater);
};
