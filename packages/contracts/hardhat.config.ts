import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.16",
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
    version: "0.8.23",
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