import React, { useState, useEffect } from 'react';
import { BrowserProvider, ethers } from 'ethers';

interface MarketplaceProps {
  provider: BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  marketplaceAddress: string;
  skinTokenAddress: string;
}

interface SkinListing {
  id: number;
  name: string;
  rarity: string;
  unit: string;
  price: string;
  seller: string;
  image: string;
  amount: number;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  provider,
  signer,
  marketplaceAddress,
  skinTokenAddress,
}) => {
  const [listings, setListings] = useState<SkinListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Demo data - replace with real contract data
  const demoListings: SkinListing[] = [
    {
      id: 1,
      name: "Golden Marine",
      rarity: "Rare",
      unit: "Marine",
      price: "0.01",
      seller: "0x1234...5678",
      image: "https://via.placeholder.com/200x150/FFD700/000000?text=Golden+Marine",
      amount: 2
    },
    {
      id: 2,
      name: "Infernal Zergling",
      rarity: "Epic",
      unit: "Zergling",
      price: "0.05",
      seller: "0x2345...6789",
      image: "https://via.placeholder.com/200x150/FF4500/FFFFFF?text=Infernal+Zergling",
      amount: 1
    },
    {
      id: 3,
      name: "Protoss Zealot Armor",
      rarity: "Legendary",
      unit: "Zealot",
      price: "0.1",
      seller: "0x3456...7890",
      image: "https://via.placeholder.com/200x150/00BFFF/FFFFFF?text=Protoss+Zealot",
      amount: 1
    },
    {
      id: 4,
      name: "Standard Marine",
      rarity: "Common",
      unit: "Marine",
      price: "0.001",
      seller: "0x4567...8901",
      image: "https://via.placeholder.com/200x150/808080/FFFFFF?text=Standard+Marine",
      amount: 5
    }
  ];

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    
    // For now, use demo data. Replace with actual contract calls later.
    setTimeout(() => {
      setListings(demoListings);
      setLoading(false);
    }, 1000);
  };

  const purchaseSkin = async (listingId: number, price: string) => {
    if (!signer) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // This will be replaced with actual contract interaction
      alert(`This would purchase skin #${listingId} for ${price} ETH`);
      
      // Simulate transaction
      console.log('Purchasing skin:', listingId, 'for', price, 'ETH');
      
    } catch (error) {
      console.error('Error purchasing skin:', error);
      alert('Failed to purchase skin. Please try again.');
    }
  };

  const filteredListings = selectedRarity === 'all' 
    ? listings 
    : listings.filter(listing => listing.rarity === selectedRarity);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return '#808080';
      case 'Rare': return '#007bff';
      case 'Epic': return '#6f42c1';
      case 'Legendary': return '#fd7e14';
      default: return '#333';
    }
  };

  if (loading) {
    return (
      <div className="marketplace">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h2>🎪 Skin Marketplace</h2>
        <p>Browse and purchase SC2 skins from other players</p>
        
        <div className="filters">
          <label>Filter by Rarity:</label>
          <select 
            value={selectedRarity} 
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="rarity-filter"
          >
            <option value="all">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
        </div>
      </div>

      <div className="listings-grid">
        {filteredListings.length === 0 ? (
          <div className="no-listings">
            <p>No skins available for sale</p>
            <p>Be the first to list a skin!</p>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div key={listing.id} className="skin-card">
              <div className="skin-image">
                <img src={listing.image} alt={listing.name} />
                <div 
                  className="rarity-badge"
                  style={{ backgroundColor: getRarityColor(listing.rarity) }}
                >
                  {listing.rarity}
                </div>
              </div>
              
              <div className="skin-details">
                <h3>{listing.name}</h3>
                <p className="unit">Unit: {listing.unit}</p>
                <p className="amount">Available: {listing.amount}</p>
                <p className="seller">Seller: {listing.seller}</p>
                
                <div className="price-section">
                  <span className="price">{listing.price} ETH</span>
                  <button 
                    onClick={() => purchaseSkin(listing.id, listing.price)}
                    className="buy-button"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};