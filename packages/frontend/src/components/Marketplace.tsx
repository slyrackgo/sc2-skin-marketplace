import React, { useState, useEffect } from 'react';
import { Contract, BrowserProvider, JsonRpcSigner, ethers } from 'ethers';
import { SC2SkinMarketplaceABI } from '../abis';

interface Listing {
  seller: string;
  skinId: bigint;
  amount: bigint;
  price: bigint;
  active: boolean;
}

interface SkinMetadata {
  name: string;
  rarity: string;
  gameUnit: string;
  imageURI: string;
}

interface MarketplaceProps {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  marketplaceAddress: string;
  skinTokenAddress: string;
}

// Demo skin metadata since we don't have real contract data yet
const DEMO_SKIN_METADATA: { [key: number]: SkinMetadata } = {
  1: {
    name: "Golden Marine",
    rarity: "Rare",
    gameUnit: "Marine",
    imageURI: "https://via.placeholder.com/300x200/FFD700/000000?text=Golden+Marine"
  },
  2: {
    name: "Infernal Zergling",
    rarity: "Epic",
    gameUnit: "Zergling", 
    imageURI: "https://via.placeholder.com/300x200/FF4500/000000?text=Infernal+Zergling"
  },
  3: {
    name: "Protoss Zealot Armor",
    rarity: "Legendary",
    gameUnit: "Zealot",
    imageURI: "https://via.placeholder.com/300x200/00BFFF/000000?text=Protoss+Zealot"
  },
  4: {
    name: "Standard Marine",
    rarity: "Common",
    gameUnit: "Marine",
    imageURI: "https://via.placeholder.com/300x200/808080/000000?text=Standard+Marine"
  }
};

// Demo listings data
const DEMO_LISTINGS: (Listing & { listingId: number })[] = [
  {
    listingId: 1,
    seller: "0x1234567890123456789012345678901234567890",
    skinId: BigInt(1),
    amount: BigInt(2),
    price: ethers.parseEther("0.01"),
    active: true
  },
  {
    listingId: 2,
    seller: "0x2345678901234567890123456789012345678901", 
    skinId: BigInt(2),
    amount: BigInt(1),
    price: ethers.parseEther("0.05"),
    active: true
  },
  {
    listingId: 3,
    seller: "0x3456789012345678901234567890123456789012",
    skinId: BigInt(3),
    amount: BigInt(1),
    price: ethers.parseEther("0.1"),
    active: true
  },
  {
    listingId: 4,
    seller: "0x4567890123456789012345678901234567890123",
    skinId: BigInt(4),
    amount: BigInt(5),
    price: ethers.parseEther("0.001"),
    active: true
  }
];

export const Marketplace: React.FC<MarketplaceProps> = ({
  provider,
  signer,
  marketplaceAddress,
  skinTokenAddress,
}) => {
  const [listings, setListings] = useState<(Listing & { listingId: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDemoData, setUseDemoData] = useState(true);

  useEffect(() => {
    loadListings();
  }, [provider, marketplaceAddress]);

  const loadListings = async () => {
    setLoading(true);
    
    // If no provider or invalid address, use demo data
    if (!provider || marketplaceAddress === "0x0000000000000000000000000000000000000000") {
      setListings(DEMO_LISTINGS);
      setUseDemoData(true);
      setLoading(false);
      return;
    }

    try {
      const marketplace = new Contract(
        marketplaceAddress,
        SC2SkinMarketplaceABI,
        provider
      );

      // Try to get listing counter - if this fails, use demo data
      try {
        const listingCounter = await marketplace.listingCounter();
        const activeListings: (Listing & { listingId: number })[] = [];

        for (let i = 1; i <= listingCounter; i++) {
          const listing = await marketplace.getListing(i);
          if (listing.active) {
            activeListings.push({
              ...listing,
              listingId: i
            });
          }
        }

        setListings(activeListings);
        setUseDemoData(false);
      } catch (contractError) {
        console.log('Contract not deployed yet, using demo data', contractError);
        setListings(DEMO_LISTINGS);
        setUseDemoData(true);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings(DEMO_LISTINGS);
      setUseDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const purchaseSkin = async (listingId: number, price: bigint) => {
    if (!signer) {
      alert('Please connect your wallet first');
      return;
    }

    // If using demo data, show message
    if (useDemoData || marketplaceAddress === "0x0000000000000000000000000000000000000000") {
      alert('This is a demo. Connect real contracts to enable purchases.');
      return;
    }

    try {
      const marketplace = new Contract(
        marketplaceAddress,
        SC2SkinMarketplaceABI,
        signer
      );

      const tx = await marketplace.purchaseSkin(listingId, { value: price });
      await tx.wait();
      
      alert('Purchase successful!');
      loadListings(); // Refresh listings
    } catch (error: any) {
      console.error('Error purchasing skin:', error);
      alert(`Purchase failed: ${error.message || 'Unknown error'}`);
    }
  };

  const getSkinMetadata = (skinId: bigint): SkinMetadata => {
    const id = Number(skinId);
    return DEMO_SKIN_METADATA[id] || {
      name: `Skin #${id}`,
      rarity: "Unknown",
      gameUnit: "Unknown",
      imageURI: "https://via.placeholder.com/300x200/333333/FFFFFF?text=Unknown+Skin"
    };
  };

  if (loading) {
    return (
      <div className="marketplace">
        <h2>SC2 Skin Marketplace</h2>
        <div className="loading">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <h2>SC2 Skin Marketplace</h2>
      
      {useDemoData && (
        <div className="demo-notice">
          <p>🔬 Using demo data - deploy contracts to enable real trading</p>
        </div>
      )}

      <div className="listings-grid">
        {listings.length === 0 ? (
          <div className="no-listings">
            <p>No skins available for sale</p>
          </div>
        ) : (
          listings.map((listing) => {
            const metadata = getSkinMetadata(listing.skinId);
            const priceInEth = ethers.formatEther(listing.price);
            
            return (
              <div key={listing.listingId} className="skin-card">
                <img 
                  src={metadata.imageURI} 
                  alt={metadata.name}
                  className="skin-image"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = `https://via.placeholder.com/300x200/333333/FFFFFF?text=${encodeURIComponent(metadata.name)}`;
                  }}
                />
                <div className="skin-info">
                  <h3>{metadata.name}</h3>
                  <p className="unit">Unit: {metadata.gameUnit}</p>
                  <p className={`rarity ${metadata.rarity.toLowerCase()}`}>
                    Rarity: {metadata.rarity}
                  </p>
                  <p className="amount">Amount: {listing.amount.toString()}</p>
                  <p className="seller">
                    Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                  </p>
                  <p className="price">
                    Price: {priceInEth} ETH
                  </p>
                  <button 
                    onClick={() => purchaseSkin(listing.listingId, listing.price)}
                    className="buy-button"
                    disabled={useDemoData}
                  >
                    {useDemoData ? 'Demo Mode' : 'Buy Now'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};