import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SC2 Skin Marketplace...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy Skin Token
  console.log("Deploying SC2SkinToken...");
  const SC2SkinToken = await ethers.getContractFactory("SC2SkinToken");
  const skinToken = await SC2SkinToken.deploy("https://api.sc2skins.com/metadata/");
  await skinToken.waitForDeployment();
  const skinTokenAddress = await skinToken.getAddress();
  console.log("SC2SkinToken deployed to:", skinTokenAddress);

  // Deploy Marketplace
  console.log("Deploying SC2SkinMarketplace...");
  const SC2SkinMarketplace = await ethers.getContractFactory("SC2SkinMarketplace");
  const marketplace = await SC2SkinMarketplace.deploy(skinTokenAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("SC2SkinMarketplace deployed to:", marketplaceAddress);

  // Setup roles
  console.log("Configuring roles...");
  const MINTER_ROLE = await skinToken.MINTER_ROLE();
  const BURNER_ROLE = await skinToken.BURNER_ROLE();
  
  await skinToken.grantRole(MINTER_ROLE, marketplaceAddress);
  await skinToken.grantRole(BURNER_ROLE, marketplaceAddress);
  console.log("Roles configured");

  // Mint initial skins for testing
  console.log("Minting initial skins...");
  await skinToken.mintSkin(deployer.address, 1, 10); // Golden Marine
  await skinToken.mintSkin(deployer.address, 2, 5);  // Infernal Zergling
  await skinToken.mintSkin(deployer.address, 3, 2);  // Protoss Zealot Armor
  await skinToken.mintSkin(deployer.address, 4, 20); // Standard Marine

  console.log("Initial skins minted");
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("SC2SkinToken:", skinTokenAddress);
  console.log("SC2SkinMarketplace:", marketplaceAddress);
  console.log("Deployer:", deployer.address);
  console.log("===========================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});