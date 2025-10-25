import React, { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner, ethers } from 'ethers';
import {Marketplace} from '../src/components/Marketplace';
import { Wallet } from './components/Wallet';
import { MySkins } from './components/MySkins';
import { ListSkin } from '../src/components/ListSkin';
import './App.css';

// Temporary addresses - replace with your deployed contract addresses
const MARKETPLACE_ADDRESS = "0x8C41C7bfd0568D7cf1aeb51d8ccA562771959ad0"; // Replace after deployment
const SKIN_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace after deployment

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [currentView, setCurrentView] = useState<'marketplace' | 'my-skins' | 'list-skin'>('marketplace');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const newProvider = new BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
        
        const address = await newSigner.getAddress();
        setAccount(address);
        
        console.log('Connected account:', address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const newProvider = new BrowserProvider(window.ethereum);
            setProvider(newProvider);
            const newSigner = await newProvider.getSigner();
            setSigner(newSigner);
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connected wallet:', error);
        }
      }
    };

    checkConnectedWallet();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>SC2 Skin Marketplace</h1>
        <nav className="nav">
          <button 
            onClick={() => setCurrentView('marketplace')}
            className={currentView === 'marketplace' ? 'active' : ''}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setCurrentView('my-skins')}
            className={currentView === 'my-skins' ? 'active' : ''}
          >
            My Skins
          </button>
          <button 
            onClick={() => setCurrentView('list-skin')}
            className={currentView === 'list-skin' ? 'active' : ''}
          >
            List Skin
          </button>
        </nav>
        <Wallet account={account} onConnect={connectWallet} />
      </header>

      <main className="app-main">
        {!account ? (
          <div className="connect-wallet-prompt">
            <h2>Connect your wallet to start trading SC2 skins</h2>
            <p>Make sure you're connected to Xsolla ZK Sepolia testnet</p>
            <button onClick={connectWallet} className="connect-button">
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {currentView === 'marketplace' && (
              <Marketplace 
                provider={provider}
                signer={signer}
                marketplaceAddress={MARKETPLACE_ADDRESS}
                skinTokenAddress={SKIN_TOKEN_ADDRESS}
              />
            )}
            {currentView === 'my-skins' && (
              <MySkins 
                provider={provider}
                signer={signer}
                marketplaceAddress={MARKETPLACE_ADDRESS}
                skinTokenAddress={SKIN_TOKEN_ADDRESS}
              />
            )}
            {currentView === 'list-skin' && (
              <ListSkin 
                provider={provider}
                signer={signer}
                marketplaceAddress={MARKETPLACE_ADDRESS}
                skinTokenAddress={SKIN_TOKEN_ADDRESS}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;