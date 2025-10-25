import React from 'react';

interface WalletProps {
  account: string;
  network: string;
  balance: string;
  isConnecting: boolean;
  hasMetaMask: boolean;
  connectionError: string;
  targetAddress: string;
  onConnect: () => void;
  onConnectSimple: () => void;
  onDisconnect: () => void;
}

export const Wallet: React.FC<WalletProps> = ({
  account,
  network,
  balance,
  isConnecting,
  hasMetaMask,
  connectionError,
  targetAddress,
  onConnect,
  onConnectSimple,
  onDisconnect,
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isTargetAddress = account.toLowerCase() === targetAddress.toLowerCase();

  if (!hasMetaMask) {
    return (
      <div className="wallet-no-metamask">
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="install-metamask-button"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="wallet-disconnected">
        {connectionError && (
          <div className="connection-error" title={connectionError}>
            ⚠️
          </div>
        )}
        <div className="wallet-buttons">
          <button 
            onClick={onConnect} 
            className="connect-wallet-button primary"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <div className="spinner-small"></div>
                Connecting...
              </>
            ) : (
              `Connect to ${formatAddress(targetAddress)}`
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connected">
      <div className="wallet-info">
        <div className={`address-status ${isTargetAddress ? 'correct' : 'incorrect'}`}>
          {isTargetAddress ? '✅' : '⚠️'}
        </div>
        <div className="network-badge">
          {network || 'Unknown Network'}
        </div>
        <div className="balance">
          {parseFloat(balance).toFixed(4)} ETH
        </div>
        <div className={`account ${isTargetAddress ? 'target-account' : 'wrong-account'}`} title={account}>
          {formatAddress(account)}
          {!isTargetAddress && <span className="wrong-warning"> (!)</span>}
        </div>
      </div>
      <button 
        onClick={onDisconnect}
        className="disconnect-button"
        title="Disconnect Wallet"
      >
        Disconnect
      </button>
    </div>
  );
};