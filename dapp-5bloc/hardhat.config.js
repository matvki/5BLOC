require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: { // Réseau de test Ethereum compatible avec MetaMask
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
