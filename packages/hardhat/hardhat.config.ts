require("@matterlabs/hardhat-zksync");
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.4.0",
    settings: {
      optimizer: {
        enabled: true,
        mode: "3",
      },
    },
  },
  defaultNetwork: "xsolla-zk-sepolia",
  networks: {
    "xsolla-zk-sepolia": {
      url: "https://testnet.xsollazk.com",
      ethNetwork: "sepolia",
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};