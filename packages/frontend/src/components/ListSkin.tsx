import React, { useState } from 'react';
import { Contract, BrowserProvider, JsonRpcSigner } from 'ethers';

interface ListSkinProps {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  marketplaceAddress: string;
  skinTokenAddress: string;
}

export const ListSkin: React.FC<ListSkinProps> = ({
  provider,
  signer,
  marketplaceAddress,
  skinTokenAddress,
}) => {
  const [skinId, setSkinId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const listSkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) return;

    setLoading(true);
    try {
      // For now, just show a success message since we don't have the full ABI
      console.log('Listing skin:', { skinId, amount, price });
      alert('Skin listed successfully! (This is a demo - connect contracts to enable real listing)');
      
      // Reset form
      setSkinId('');
      setAmount('');
      setPrice('');
    } catch (error) {
      console.error('Error listing skin:', error);
      alert('Error listing skin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-skin">
      <h2>List Skin for Sale</h2>
      <form onSubmit={listSkin} className="list-form">
        <div className="form-group">
          <label>Skin ID:</label>
          <input
            type="number"
            value={skinId}
            onChange={(e) => setSkinId(e.target.value)}
            placeholder="1, 2, 3, or 4"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="How many to list"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Price (ETH):</label>
          <input
            type="number"
            step="0.001"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price in ETH"
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="list-button">
          {loading ? 'Listing...' : 'List Skin'}
        </button>
      </form>
      
      <div className="skin-info">
        <h3>Available Skin IDs:</h3>
        <ul>
          <li>1 - Golden Marine (Rare)</li>
          <li>2 - Infernal Zergling (Epic)</li>
          <li>3 - Protoss Zealot Armor (Legendary)</li>
          <li>4 - Standard Marine (Common)</li>
        </ul>
      </div>
    </div>
  );
};