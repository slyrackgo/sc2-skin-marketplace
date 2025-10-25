import React from 'react';

interface WalletProps {
  account: string;
  onConnect: () => void;
}

export const Wallet: React.FC<WalletProps> = ({ account, onConnect }) => {
  return (
    <div className="wallet">
      {account ? (
        <div className="connected-wallet">
          <span>Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
        </div>
      ) : (
        <button onClick={onConnect} className="connect-wallet-button">
          Connect Wallet
        </button>
      )}
    </div>
  );
};