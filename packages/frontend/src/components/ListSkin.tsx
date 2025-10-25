import React from 'react';
import { BrowserProvider, ethers } from 'ethers';

interface ListSkinProps {
  provider: BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  marketplaceAddress: string;
  skinTokenAddress: string;
}

export const ListSkin: React.FC<ListSkinProps> = ({
  provider,
  signer,
  marketplaceAddress,
  skinTokenAddress,
}) => {
  return (
    <div className="list-skin">
      <h2>📤 List Skin for Sale</h2>
      <p>List your SC2 skins on the marketplace</p>
      <div className="coming-soon">
        <p>🔧 List Skin feature coming soon!</p>
        <p>Connect real contracts to list your skins for sale</p>
      </div>
    </div>
  );
};