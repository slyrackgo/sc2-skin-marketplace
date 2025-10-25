import React from 'react';
import { BrowserProvider, ethers } from 'ethers';

interface MySkinsProps {
  provider: BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  marketplaceAddress: string;
  skinTokenAddress: string;
}

export const MySkins: React.FC<MySkinsProps> = ({
  provider,
  signer,
  marketplaceAddress,
  skinTokenAddress,
}) => {
  return (
    <div className="my-skins">
      <h2>🎒 My Skin Collection</h2>
      <p>Your owned SC2 skins will appear here</p>
      <div className="coming-soon">
        <p>🔧 My Skins feature coming soon!</p>
        <p>Connect real contracts to see your skin inventory</p>
      </div>
    </div>
  );
};