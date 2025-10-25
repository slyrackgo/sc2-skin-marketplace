import React, { useState } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // This should trigger the MetaMask popup
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error: any) {
      if (error.code === 4001) {
        // User rejected the request
        console.log('User rejected connection');
      } else {
        console.error('Connection error:', error);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '2rem' }}>SC2 Marketplace</h1>
      
      {!account ? (
        <div style={{
          border: '1px solid #0f0',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '8px'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Connect Your Wallet</h2>
          <button 
            onClick={connectWallet}
            style={{
              background: '#0f0',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              borderRadius: '4px'
            }}
          >
            Connect MetaMask
          </button>
          <p style={{ marginTop: '1rem', fontSize: '14px', color: '#888' }}>
            Click to open MetaMask popup
          </p>
        </div>
      ) : (
        <div style={{
          border: '1px solid #0f0',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#0f0', marginBottom: '1rem' }}>✅ Connected</h2>
          <div style={{
            background: '#1a1a1a',
            padding: '1rem',
            borderRadius: '4px',
            margin: '1rem 0',
            fontFamily: 'monospace'
          }}>
            {account}
          </div>
          <button 
            onClick={() => setAccount('')}
            style={{
              background: 'transparent',
              color: '#ff4444',
              border: '1px solid #ff4444',
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default App;