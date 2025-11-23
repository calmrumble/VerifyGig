require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    localhost: {
      url: "http://0.0.0.0:8545"
    }
  }
};
