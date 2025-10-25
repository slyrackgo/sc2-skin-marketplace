import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@matterlabs/hardhat-zksync";
import * as dotenv from 'dotenv';
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.16", // Updated to a stable version
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
      verifyURL: "https://verification-sepolia.xsollazk.com/contract_verification",
    },
    hardhat: {
      zksync: false,
    }
  },
  solidity: {
    version: "0.8.23", // Updated to a version that zkSync supports
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "artifacts-zk",
    cache: "cache-zk",
  },
};

export default config;