// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface ISC2Skin {
    function mintSkin(address to, uint256 skinId, uint256 amount) external;
    function burnSkin(address from, uint256 skinId, uint256 amount) external;
    function balanceOf(address account, uint256 id) external view returns (uint256);
}

contract SC2SkinMarketplace is ReentrancyGuard, Ownable {
    using Strings for uint256;
    
    ISC2Skin public skinToken;
    
    struct Listing {
        address seller;
        uint256 skinId;
        uint256 amount;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;
    
    // Skin metadata
    struct SkinMetadata {
        string name;
        string rarity; // Common, Rare, Epic, Legendary
        string gameUnit; // Marine, Zergling, Zealot, etc.
        string imageURI;
    }
    
    mapping(uint256 => SkinMetadata) public skinMetadata;
    
    event SkinListed(
        uint256 indexed listingId,
        address indexed seller,
        uint256 indexed skinId,
        uint256 amount,
        uint256 price
    );
    
    event SkinPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 skinId,
        uint256 amount,
        uint256 price
    );
    
    event SkinDelisted(uint256 indexed listingId);
    
    constructor(address _skinToken) {
        skinToken = ISC2Skin(_skinToken);
        _initializeDefaultSkins();
    }
    
    function _initializeDefaultSkins() internal {
        // Initialize some default SC2 skins
        skinMetadata[1] = SkinMetadata(
            "Golden Marine",
            "Rare",
            "Marine",
            "https://via.placeholder.com/300x200/FFD700/000000?text=Golden+Marine"
        );
        
        skinMetadata[2] = SkinMetadata(
            "Infernal Zergling",
            "Epic", 
            "Zergling",
            "https://via.placeholder.com/300x200/FF4500/000000?text=Infernal+Zergling"
        );
        
        skinMetadata[3] = SkinMetadata(
            "Protoss Zealot Armor",
            "Legendary",
            "Zealot",
            "https://via.placeholder.com/300x200/00BFFF/000000?text=Protoss+Zealot"
        );
        
        skinMetadata[4] = SkinMetadata(
            "Standard Marine",
            "Common",
            "Marine", 
            "https://via.placeholder.com/300x200/808080/000000?text=Standard+Marine"
        );
    }
    
    function listSkin(
        uint256 skinId,
        uint256 amount,
        uint256 price
    ) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(price > 0, "Price must be positive");
        require(skinToken.balanceOf(msg.sender, skinId) >= amount, "Insufficient skins");
        
        // Transfer skins to marketplace (escrow)
        skinToken.burnSkin(msg.sender, skinId, amount);
        
        listingCounter++;
        listings[listingCounter] = Listing({
            seller: msg.sender,
            skinId: skinId,
            amount: amount,
            price: price,
            active: true
        });
        
        emit SkinListed(listingCounter, msg.sender, skinId, amount, price);
    }
    
    function purchaseSkin(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value == listing.price, "Incorrect payment amount");
        require(msg.sender != listing.seller, "Cannot purchase your own listing");
        
        listing.active = false;
        
        // Transfer payment to seller
        payable(listing.seller).transfer(msg.value);
        
        // Mint skin to buyer
        skinToken.mintSkin(msg.sender, listing.skinId, listing.amount);
        
        emit SkinPurchased(
            listingId,
            msg.sender,
            listing.seller,
            listing.skinId,
            listing.amount,
            listing.price
        );
    }
    
    function delistSkin(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Only seller can delist");
        
        listing.active = false;
        
        // Return skins to seller
        skinToken.mintSkin(msg.sender, listing.skinId, listing.amount);
        
        emit SkinDelisted(listingId);
    }
    
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
    
    function getSkinMetadata(uint256 skinId) external view returns (SkinMetadata memory) {
        return skinMetadata[skinId];
    }
    
    function addSkinMetadata(
        uint256 skinId,
        string memory name,
        string memory rarity,
        string memory gameUnit,
        string memory imageURI
    ) external onlyOwner {
        skinMetadata[skinId] = SkinMetadata(name, rarity, gameUnit, imageURI);
    }
}