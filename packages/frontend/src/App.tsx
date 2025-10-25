import React, { useState, useEffect } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { Marketplace } from './components/Marketplace';
import { Wallet } from './components/Wallet';
import { MySkins } from './components/MySkins';
import { ListSkin } from './components/ListSkin';
import './App.css';

// Contract addresses - update these after deployment
const MARKETPLACE_ADDRESS = "0x0000000000000000000000000000000000000000";
const SKIN_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

// Target wallet address you want to connect to
const TARGET_ADDRESS = "0x1a1C76154Eb6973831BA9176c12e5929068CCC3A";

// Extend Window interface for Ethereum
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

function App() {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [currentView, setCurrentView] = useState<'marketplace' | 'my-skins' | 'list-skin'>('marketplace');
  const [network, setNetwork] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (window.ethereum) {
        setHasMetaMask(true);
        setDebugInfo('MetaMask detected');
        // Don't auto-initialize to avoid the error
      } else {
        setHasMetaMask(false);
        setConnectionError('MetaMask not detected. Please install MetaMask.');
        setDebugInfo('MetaMask not found');
      }
    };

    checkMetaMask();
  }, []);

  const setupProvider = async (accountAddress: string) => {
    try {
      setDebugInfo(`Setting up provider for: ${accountAddress}`);
      
      // Create provider
      const newProvider = new BrowserProvider(window.ethereum);
      setProvider(newProvider);
      
      // Get signer
      const newSigner = await newProvider.getSigner();
      setSigner(newSigner);
      
      setAccount(accountAddress);
      setConnectionError('');
      
      // Get network info
      try {
        const networkInfo = await newProvider.getNetwork();
        const networkName = networkInfo.name === 'unknown' ? 'Local Network' : networkInfo.name;
        setNetwork(networkName);
        setDebugInfo(`Network: ${networkName} (Chain ID: ${networkInfo.chainId})`);
      } catch (error) {
        setNetwork('Unknown Network');
        setDebugInfo('Network detection failed');
      }
      
      // Get balance
      try {
        const balanceWei = await newProvider.getBalance(accountAddress);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(balanceEth);
        setDebugInfo(`Balance: ${balanceEth} ETH`);
      } catch (error) {
        setBalance('0');
        setDebugInfo('Balance check failed');
      }
      
    } catch (error) {
      const errorMsg = `Error setting up provider: ${error}`;
      console.error(errorMsg);
      setConnectionError('Failed to setup provider');
      setDebugInfo(errorMsg);
    }
  };

  // Method 1: Direct window.ethereum access (most reliable)
  const connectWalletDirect = async () => {
    if (!window.ethereum) {
      setConnectionError('MetaMask not available');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');
    setDebugInfo('Trying direct connection method...');
    
    try {
      // Method 1A: Try the standard way first
      setDebugInfo('Attempting standard eth_requestAccounts...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        await handleConnectedAccount(accounts[0]);
        return;
      }
      
    } catch (error: any) {
      setDebugInfo(`Standard method failed: ${error.message}`);
      console.log('Standard method failed, trying alternatives...');
    }

    // If standard method fails, try alternatives
    await tryAlternativeMethods();
  };

  // Method 2: Alternative connection methods
  const tryAlternativeMethods = async () => {
    if (!window.ethereum) return;

    const methods = [
      {
        name: 'enable (legacy)',
        call: async () => await window.ethereum.enable()
      },
      {
        name: 'send (legacy)',
        call: async () => await window.ethereum.send('eth_requestAccounts')
      }
    ];

    for (const method of methods) {
      try {
        setDebugInfo(`Trying ${method.name}...`);
        const result = await method.call();
        const accounts = Array.isArray(result) ? result : (result?.result || result);
        
        if (accounts && accounts.length > 0) {
          await handleConnectedAccount(accounts[0]);
          return;
        }
      } catch (error: any) {
        setDebugInfo(`${method.name} failed: ${error.message}`);
      }
    }

    // If all methods fail, try the manual selection approach
    await tryManualSelection();
  };

  // Method 3: Manual account selection
  const tryManualSelection = async () => {
    try {
      setDebugInfo('Trying manual account selection...');
      
      // Get all accounts without requesting access
      const allAccounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      
      setDebugInfo(`Available accounts: ${allAccounts.join(', ')}`);
      
      if (allAccounts.length === 0) {
        setConnectionError('No accounts found. Please unlock MetaMask and try again.');
        return;
      }

      // If only one account, use it
      if (allAccounts.length === 1) {
        await handleConnectedAccount(allAccounts[0]);
        return;
      }

      // If multiple accounts, check if target is available
     const targetAccount = allAccounts.find((acc: string) =>
  acc.toLowerCase() === TARGET_ADDRESS.toLowerCase()
);
      
      if (targetAccount) {
        await handleConnectedAccount(targetAccount);
      } else {
        setConnectionError(`Target account not found in available accounts. Please select ${TARGET_ADDRESS} in MetaMask.`);
      }
      
    } catch (error: any) {
      setConnectionError(`Manual selection failed: ${error.message}`);
    }
  };

  const handleConnectedAccount = async (accountAddress: string) => {
    const isTarget = accountAddress.toLowerCase() === TARGET_ADDRESS.toLowerCase();
    
    if (isTarget) {
      setDebugInfo(`✅ Successfully connected to target address: ${TARGET_ADDRESS}`);
      setConnectionError('');
    } else {
      setDebugInfo(`⚠️ Connected to: ${accountAddress} but target is: ${TARGET_ADDRESS}`);
      setConnectionError(`Connected to different address. Please switch to: ${TARGET_ADDRESS}`);
    }
    
    await setupProvider(accountAddress);
    setIsConnecting(false);
  };

  // Method 4: Simple provider setup without account requests
  const connectWalletSimple = async () => {
    if (!window.ethereum) {
      setConnectionError('MetaMask not available');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');
    setDebugInfo('Trying simple connection...');
    
    try {
      // Just create a provider and see what account is currently selected
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      await handleConnectedAccount(address);
      
    } catch (error: any) {
      setConnectionError(`Simple connection failed: ${error.message}. Please make sure MetaMask is unlocked.`);
      setDebugInfo(`Simple connection error: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setDebugInfo('Wallet disconnected');
    setAccount('');
    setProvider(null);
    setSigner(null);
    setBalance('0');
    setNetwork('');
    setConnectionError('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <h1>🎮 SC2 Skin Marketplace</h1>
          <p>Trade StarCraft 2 skins on the blockchain</p>
          <div className="target-address">
            <small>Target Wallet: {TARGET_ADDRESS}</small>
          </div>
        </div>
        
        <nav className="nav">
          <button 
            onClick={() => setCurrentView('marketplace')}
            className={currentView === 'marketplace' ? 'active' : ''}
          >
            🏪 Marketplace
          </button>
          <button 
            onClick={() => setCurrentView('my-skins')}
            className={currentView === 'my-skins' ? 'active' : ''}
          >
            🎒 My Skins
          </button>
          <button 
            onClick={() => setCurrentView('list-skin')}
            className={currentView === 'list-skin' ? 'active' : ''}
          >
            📤 List Skin
          </button>
        </nav>

        <Wallet 
          account={account}
          network={network}
          balance={balance}
          isConnecting={isConnecting}
          hasMetaMask={hasMetaMask}
          connectionError={connectionError}
          targetAddress={TARGET_ADDRESS}
          onConnect={connectWalletDirect}
          onConnectSimple={connectWalletSimple}
          onDisconnect={disconnectWallet}
        />
      </header>

      <main className="app-main">
        {!account ? (
          <div className="connect-wallet-prompt">
            <div className="welcome-card">
              <h2>Welcome to SC2 Skin Marketplace</h2>
              <p>Connect your wallet to start trading StarCraft 2 skins on the blockchain</p>
              
              <div className="target-wallet-info">
                <h3>🔑 Target Wallet Address</h3>
                <code className="address-display">{TARGET_ADDRESS}</code>
                <p className="instruction">Please make sure you're connected with this specific wallet in MetaMask</p>
              </div>

              {connectionError && (
                <div className="error-message">
                  ⚠️ {connectionError}
                </div>
              )}

              <div className="connection-methods">
                <h4>Connection Methods</h4>
                <div className="method-buttons">
                  <button 
                    onClick={connectWalletDirect} 
                    className="connect-button primary"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <div className="spinner"></div>
                        Connecting...
                      </>
                    ) : (
                      'Method 1: Standard Connection'
                    )}
                  </button>
                  
                  <button 
                    onClick={connectWalletSimple} 
                    className="connect-button secondary"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <div className="spinner"></div>
                        Connecting...
                      </>
                    ) : (
                      'Method 2: Simple Connection'
                    )}
                  </button>
                </div>
              </div>

              {hasMetaMask && (
                <div className="troubleshooting">
                  <h4>MetaMask Connection Issues?</h4>
                  <ol>
                    <li><strong>Make sure MetaMask is unlocked</strong> and the correct account is selected</li>
                    <li><strong>Try both connection methods</strong> above</li>
                    <li><strong>Refresh the page</strong> and try again</li>
                    <li><strong>Clear site data</strong> in browser settings</li>
                    <li><strong>Restart your browser</strong> if issues persist</li>
                  </ol>
                </div>
              )}

              <div className="debug-section">
                <details>
                  <summary>Debug Information</summary>
                  <pre className="debug-info">{debugInfo}</pre>
                </details>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="connection-status">
              {account.toLowerCase() === TARGET_ADDRESS.toLowerCase() ? (
                <div className="status-success">
                  ✅ Connected to target wallet: {account}
                </div>
              ) : (
                <div className="status-warning">
                  ⚠️ Connected to different wallet: {account}. Please switch to: {TARGET_ADDRESS}
                </div>
              )}
            </div>

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