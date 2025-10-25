import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SC2 Skin Marketplace...");

  // Deploy Skin Token
  const SC2SkinToken = await ethers.getContractFactory("SC2SkinToken");
  const skinToken = await SC2SkinToken.deploy("https://api.sc2skins.com/metadata/");
  await skinToken.waitForDeployment();
  console.log("SC2SkinToken deployed to:", await skinToken.getAddress());

  // Deploy Marketplace
  const SC2SkinMarketplace = await ethers.getContractFactory("SC2SkinMarketplace");
  const marketplace = await SC2SkinMarketplace.deploy(await skinToken.getAddress());
  await marketplace.waitForDeployment();
  console.log("SC2SkinMarketplace deployed to:", await marketplace.getAddress());

  // Setup roles
  await skinToken.grantRole(await skinToken.MINTER_ROLE(), await marketplace.getAddress());
  await skinToken.grantRole(await skinToken.BURNER_ROLE(), await marketplace.getAddress());
  console.log("Roles configured");

  // Mint initial skins for testing
  const [owner] = await ethers.getSigners();
  await skinToken.mintSkin(owner.address, 1, 10); // Golden Marine
  await skinToken.mintSkin(owner.address, 2, 5);  // Infernal Zergling
  await skinToken.mintSkin(owner.address, 3, 2);  // Protoss Zealot Armor
  await skinToken.mintSkin(owner.address, 4, 20); // Standard Marine

  console.log("Initial skins minted");
  console.log("Deployment completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});