import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.4.1",
    settings: {
      optimizer: {
        enabled: true,
        mode: "3",
      },
    },
  },
  defaultNetwork: "xsolla-zk-sepolia",
  networks: { //rpc connect
    "xsolla-zk-sepolia": {
      url: "https://mainnet.era.zksync.io/", // Updated URL
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "explorer-sepolia.xsollazk.com",
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

