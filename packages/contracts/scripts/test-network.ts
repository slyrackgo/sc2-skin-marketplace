import { ethers } from "hardhat";

async function main() {
  console.log("Testing network connection...");
  
  try {
    // Test provider connection
    const provider = ethers.provider;
    console.log("Provider:", provider);
    
    // Test network info
    const network = await provider.getNetwork();
    console.log("Network:", network);
    
    // Test block number
    const blockNumber = await provider.getBlockNumber();
    console.log("Block number:", blockNumber);
    
    // Test getting signers
    const signers = await ethers.getSigners();
    console.log("Number of signers:", signers.length);
    
    if (signers.length > 0) {
      const deployer = signers[0];
      console.log("Deployer address:", deployer.address);
      
      // Test balance
      const balance = await provider.getBalance(deployer.address);
      console.log("Deployer balance:", ethers.formatEther(balance), "ETH");
    } else {
      console.log("No signers available");
    }
    
  } catch (error: any) {
    console.error("Network test failed:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
  }
}

main().catch(console.error);
