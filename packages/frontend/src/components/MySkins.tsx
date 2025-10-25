import React, { useState, useEffect } from 'react';
import { Contract, BrowserProvider, JsonRpcSigner, ethers } from 'ethers';
import { SC2SkinTokenABI } from '../abis';

interface MySkinsProps {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  marketplaceAddress: string;
  skinTokenAddress: string;
}

interface SkinBalance {
  skinId: number;
  balance: number;
  name: string;
  rarity: string;
}

const DEMO_SKINS: SkinBalance[] = [
  { skinId: 1, balance: 3, name: "Golden Marine", rarity: "Rare" },
  { skinId: 2, balance: 1, name: "Infernal Zergling", rarity: "Epic" },
  { skinId: 4, balance: 10, name: "Standard Marine", rarity: "Common" }
];

export const MySkins: React.FC<MySkinsProps> = ({
  provider,
  signer,
  marketplaceAddress,
  skinTokenAddress,
}) => {
  const [mySkins, setMySkins] = useState<SkinBalance[]>([]);
  const [useDemoData, setUseDemoData] = useState(true);

  useEffect(() => {
    loadMySkins();
  }, [provider, signer, skinTokenAddress]);

  const loadMySkins = async () => {
    if (!provider || !signer || skinTokenAddress === "0x0000000000000000000000000000000000000000") {
      setMySkins(DEMO_SKINS);
      setUseDemoData(true);
      return;
    }

    try {
      const skinToken = new Contract(
        skinTokenAddress,
        SC2SkinTokenABI,
        provider
      );

      const address = await signer.getAddress();
      const skins: SkinBalance[] = [];

      // Check balances for known skin IDs (1-4)
      for (let skinId = 1; skinId <= 4; skinId++) {
        try {
          const balance = await skinToken.balanceOf(address, skinId);
          const balanceNumber = Number(balance);
          
          if (balanceNumber > 0) {
            skins.push({
              skinId,
              balance: balanceNumber,
              name: `Skin #${skinId}`,
              rarity: ["Common", "Rare", "Epic", "Legendary"][skinId - 1] || "Unknown"
            });
          }
        } catch (error) {
          console.error(`Error loading skin ${skinId}:`, error);
        }
      }

      if (skins.length > 0) {
        setMySkins(skins);
        setUseDemoData(false);
      } else {
        setMySkins(DEMO_SKINS);
        setUseDemoData(true);
      }
    } catch (error) {
      console.error('Error loading skins:', error);
      setMySkins(DEMO_SKINS);
      setUseDemoData(true);
    }
  };

  return (
    <div className="my-skins">
      <h2>My SC2 Skins</h2>
      
      {useDemoData && (
        <div className="demo-notice">
          <p>🔬 Using demo data - connect real contracts to see your actual skins</p>
        </div>
      )}

      <div className="skins-grid">
        {mySkins.length === 0 ? (
          <div className="no-skins">
            <p>No skins in your inventory</p>
            <p>Purchase some skins from the marketplace!</p>
          </div>
        ) : (
          mySkins.map(skin => (
            <div key={skin.skinId} className="skin-item">
              <div className="skin-header">
                <h3>{skin.name}</h3>
                <span className={`rarity-badge ${skin.rarity.toLowerCase()}`}>
                  {skin.rarity}
                </span>
              </div>
              <p className="skin-id">ID: #{skin.skinId}</p>
              <p className="skin-balance">Balance: {skin.balance}</p>
              {useDemoData ? (
                <button className="demo-button" disabled>
                  Demo Skin
                </button>
              ) : (
                <button className="list-button">
                  List for Sale
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};