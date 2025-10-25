export const SC2SkinMarketplaceABI = [
  "function listSkin(uint256 skinId, uint256 amount, uint256 price) external",
  "function purchaseSkin(uint256 listingId) external payable",
  "function delistSkin(uint256 listingId) external",
  "function getListing(uint256 listingId) external view returns (tuple(address seller, uint256 skinId, uint256 amount, uint256 price, bool active))",
  "function getSkinMetadata(uint256 skinId) external view returns (tuple(string name, string rarity, string gameUnit, string imageURI))",
  "function listingCounter() external view returns (uint256)",
  "event SkinListed(uint256 indexed listingId, address indexed seller, uint256 indexed skinId, uint256 amount, uint256 price)",
  "event SkinPurchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 skinId, uint256 amount, uint256 price)"
];

export const SC2SkinTokenABI = [
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function mintSkin(address to, uint256 skinId, uint256 amount) external",
  "function burnSkin(address from, uint256 skinId, uint256 amount) external"
];